/*
  # PickMe Intelligence Database Schema
  
  1. New Tables
    - `officers` - Law enforcement officer profiles
    - `requests` - Query requests and results
    - `request_logs` - Raw JSON results storage
    - `credit_transactions` - Credit management transactions
    - `api_usage` - API call tracking and usage
    - `admin_users` - Admin panel users
    - `audit_logs` - System audit trail
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Implement role-based access control
    
  3. Indexes
    - Performance optimization for frequent queries
    - Composite indexes for complex filters
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Officers Table
CREATE TABLE IF NOT EXISTS officers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text UNIQUE NOT NULL,
  telegram_id text UNIQUE,
  whatsapp_id text,
  email text,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Inactive')),
  department text,
  rank text,
  badge_number text,
  registered_on date DEFAULT CURRENT_DATE,
  last_active timestamptz,
  credits_remaining integer DEFAULT 50,
  total_credits integer DEFAULT 50,
  total_queries integer DEFAULT 0,
  pro_access_enabled boolean DEFAULT true,
  rate_limit_per_hour integer DEFAULT 100,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id uuid NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('OSINT', 'PRO')),
  input text NOT NULL,
  source text NOT NULL,
  result_summary text,
  credits_used integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Success', 'Failed')),
  response_time_ms integer,
  error_message text,
  session_id text,
  platform text CHECK (platform IN ('telegram', 'whatsapp', 'api')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Request Logs Table (for storing raw JSON results)
CREATE TABLE IF NOT EXISTS request_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  raw_json jsonb NOT NULL,
  file_urls text[],
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Credit Transactions Table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id uuid NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('Renewal', 'Deduction', 'Top-up', 'Refund', 'Adjustment')),
  credits integer NOT NULL,
  previous_balance integer NOT NULL,
  new_balance integer NOT NULL,
  payment_mode text,
  payment_reference text,
  remarks text,
  processed_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now()
);

-- API Usage Table
CREATE TABLE IF NOT EXISTS api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  api_name text NOT NULL,
  api_provider text NOT NULL,
  endpoint text,
  status_code integer,
  response_time_ms integer,
  cost_credits integer DEFAULT 0,
  error_details text,
  created_at timestamptz DEFAULT now()
);

-- API Keys Management Table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text NOT NULL,
  api_key_encrypted text NOT NULL,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Expired')),
  last_used timestamptz,
  usage_count integer DEFAULT 0,
  monthly_limit integer,
  cost_per_request decimal(10,4),
  created_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES admin_users(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Admin Users
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update own data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- RLS Policies for Officers (Admin access)
CREATE POLICY "Admins can manage all officers"
  ON officers
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for Requests (Admin access)
CREATE POLICY "Admins can view all requests"
  ON requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert requests"
  ON requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for Request Logs
CREATE POLICY "Admins can view all request logs"
  ON request_logs
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for Credit Transactions
CREATE POLICY "Admins can manage credit transactions"
  ON credit_transactions
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for API Usage
CREATE POLICY "Admins can view API usage"
  ON api_usage
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for API Keys
CREATE POLICY "Admins can manage API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for Audit Logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for System Settings
CREATE POLICY "Admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_officers_mobile ON officers(mobile);
CREATE INDEX IF NOT EXISTS idx_officers_telegram_id ON officers(telegram_id);
CREATE INDEX IF NOT EXISTS idx_officers_status ON officers(status);
CREATE INDEX IF NOT EXISTS idx_officers_last_active ON officers(last_active);

CREATE INDEX IF NOT EXISTS idx_requests_officer_id ON requests(officer_id);
CREATE INDEX IF NOT EXISTS idx_requests_type ON requests(type);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at);
CREATE INDEX IF NOT EXISTS idx_requests_officer_created ON requests(officer_id, created_at);

CREATE INDEX IF NOT EXISTS idx_request_logs_request_id ON request_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_request_logs_created_at ON request_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_officer_id ON credit_transactions(officer_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_action ON credit_transactions(action);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_api_usage_request_id ON api_usage(request_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_api_name ON api_usage(api_name);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update officer stats
CREATE OR REPLACE FUNCTION update_officer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update total queries count
        UPDATE officers 
        SET total_queries = total_queries + 1,
            last_active = NEW.created_at
        WHERE id = NEW.officer_id;
        
        -- Deduct credits if it's a PRO query
        IF NEW.type = 'PRO' AND NEW.credits_used > 0 THEN
            UPDATE officers 
            SET credits_remaining = credits_remaining - NEW.credits_used
            WHERE id = NEW.officer_id;
        END IF;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update officer stats on new requests
CREATE TRIGGER update_officer_stats_trigger 
    AFTER INSERT ON requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_officer_stats();

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('default_credits', '50', 'Default credits assigned to new officers'),
('max_queries_per_hour', '100', 'Maximum queries per officer per hour'),
('pro_query_cost', '2', 'Default cost in credits for PRO queries'),
('osint_query_cost', '0', 'Default cost in credits for OSINT queries'),
('session_timeout_minutes', '30', 'Session timeout for admin panel'),
('rate_limit_enabled', 'true', 'Enable rate limiting for queries'),
('maintenance_mode', 'false', 'System maintenance mode flag')
ON CONFLICT (key) DO NOTHING;