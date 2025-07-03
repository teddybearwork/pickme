import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Database migration completed successfully!');
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Error verifying tables:', tablesError);
    } else {
      console.log('📋 Created tables:', tables.map(t => t.table_name).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function runMigrationDirect() {
  try {
    console.log('🚀 Starting database migration (direct method)...');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error);
            console.error('Statement:', statement);
          } else {
            console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
          }
        } catch (err) {
          console.error(`❌ Exception in statement ${i + 1}:`, err);
        }
      }
    }
    
    console.log('✅ Migration completed!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
if (process.argv.includes('--direct')) {
  runMigrationDirect();
} else {
  runMigration();
}

export { runMigration, runMigrationDirect };