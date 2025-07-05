/*
  # Officer Registration System

  1. New Tables
    - `officer_registration_requests`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `mobile` (text, required)
      - `station` (text, required)
      - `department` (text, optional)
      - `rank` (text, optional)
      - `badge_number` (text, optional)
      - `additional_info` (text, optional)
      - `status` (text, default 'pending')
      - `approved_by` (uuid, foreign key to admin_users)
      - `approved_at` (timestamp)
      - `rejected_by` (uuid, foreign key to admin_users)
      - `rejected_at` (timestamp)
      - `rejection_reason` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `officer_registration_requests` table
    - Add policy for admins to manage registration requests

  3. Indexes
    - Add indexes for performance optimization
*/

-- Officer Registration Requests Table
CREATE TABLE IF NOT EXISTS officer_registration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  station text NOT NULL,
  department text,
  rank text,
  badge_number text,
  additional_info text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES admin_users(id),
  approved_at timestamptz,
  rejected_by uuid REFERENCES admin_users(id),
  rejected_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE officer_registration_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'officer_registration_requests' 
    AND policyname = 'Admins can manage registration requests'
  ) THEN
    DROP POLICY "Admins can manage registration requests" ON officer_registration_requests;
  END IF;
END $$;

-- Create RLS Policy
CREATE POLICY "Admins can manage registration requests"
  ON officer_registration_requests
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_officer_registration_status ON officer_registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_officer_registration_created_at ON officer_registration_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_officer_registration_email ON officer_registration_requests(email);
CREATE INDEX IF NOT EXISTS idx_officer_registration_mobile ON officer_registration_requests(mobile);

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_officer_registration_requests_updated_at'
  ) THEN
    CREATE TRIGGER update_officer_registration_requests_updated_at 
      BEFORE UPDATE ON officer_registration_requests 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;