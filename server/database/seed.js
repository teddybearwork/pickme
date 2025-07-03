import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          email: 'admin@pickme.intel',
          password_hash: hashedPassword,
          name: 'Admin User',
          role: 'admin'
        }
      ])
      .select()
      .single();
    
    if (adminError && !adminError.message.includes('duplicate')) {
      console.error('❌ Error creating admin user:', adminError);
    } else {
      console.log('✅ Admin user created/exists');
    }
    
    // Seed officers
    const officers = [
      {
        name: 'Inspector Ramesh Kumar',
        mobile: '+919791103607',
        telegram_id: '@rameshcop',
        email: 'ramesh.kumar@police.gov.in',
        department: 'Cyber Crime',
        rank: 'Inspector',
        badge_number: 'CC001',
        credits_remaining: 32,
        total_credits: 50,
        total_queries: 146
      },
      {
        name: 'ASI Priya Sharma',
        mobile: '+919876543210',
        telegram_id: '@priyacop',
        email: 'priya.sharma@police.gov.in',
        department: 'Intelligence',
        rank: 'Assistant Sub Inspector',
        badge_number: 'INT002',
        credits_remaining: 45,
        total_credits: 50,
        total_queries: 89
      },
      {
        name: 'SI Rajesh Patel',
        mobile: '+919123456789',
        telegram_id: '@rajeshcop',
        email: 'rajesh.patel@police.gov.in',
        department: 'Crime Branch',
        rank: 'Sub Inspector',
        badge_number: 'CB003',
        status: 'Suspended',
        credits_remaining: 12,
        total_credits: 50,
        total_queries: 203
      },
      {
        name: 'Constable Anita Singh',
        mobile: '+919987654321',
        telegram_id: '@anitacop',
        email: 'anita.singh@police.gov.in',
        department: 'Traffic',
        rank: 'Constable',
        badge_number: 'TR004',
        credits_remaining: 38,
        total_credits: 50,
        total_queries: 67
      }
    ];
    
    const { data: officersData, error: officersError } = await supabase
      .from('officers')
      .insert(officers)
      .select();
    
    if (officersError && !officersError.message.includes('duplicate')) {
      console.error('❌ Error creating officers:', officersError);
    } else {
      console.log('✅ Officers created/exist');
    }
    
    // Seed API keys (if officers were created)
    if (officersData && officersData.length > 0) {
      const apiKeys = [
        {
          name: 'Signzy Phone Verification',
          provider: 'Signzy',
          api_key_encrypted: 'sk_test_encrypted_key_placeholder',
          usage_count: 1245,
          monthly_limit: 10000,
          cost_per_request: 2.0
        },
        {
          name: 'Surepass Identity Verification',
          provider: 'Surepass',
          api_key_encrypted: 'sp_live_encrypted_key_placeholder',
          usage_count: 856,
          monthly_limit: 5000,
          cost_per_request: 1.5
        }
      ];
      
      const { error: apiError } = await supabase
        .from('api_keys')
        .insert(apiKeys);
      
      if (apiError && !apiError.message.includes('duplicate')) {
        console.error('❌ Error creating API keys:', apiError);
      } else {
        console.log('✅ API keys created/exist');
      }
      
      // Seed sample requests
      const requests = [
        {
          officer_id: officersData[0].id,
          type: 'PRO',
          input: '9791103607',
          source: 'Signzy API',
          result_summary: 'Phone owner details found',
          credits_used: 2,
          status: 'Success',
          response_time_ms: 1800,
          platform: 'telegram'
        },
        {
          officer_id: officersData[1].id,
          type: 'OSINT',
          input: 'john.doe@email.com',
          source: 'Social Media Scraper',
          result_summary: 'Social profiles located',
          credits_used: 0,
          status: 'Success',
          response_time_ms: 3200,
          platform: 'telegram'
        },
        {
          officer_id: officersData[3].id,
          type: 'PRO',
          input: 'AADHAAR123456789',
          source: 'Surepass API',
          result_summary: 'Verification failed',
          credits_used: 1,
          status: 'Failed',
          response_time_ms: 5000,
          platform: 'whatsapp'
        }
      ];
      
      const { error: requestsError } = await supabase
        .from('requests')
        .insert(requests);
      
      if (requestsError) {
        console.error('❌ Error creating requests:', requestsError);
      } else {
        console.log('✅ Sample requests created');
      }
    }
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();