// Script to apply marketplace schema to database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  console.log('🚀 Applying marketplace schema...\n');

  try {
    // Read the SQL file
    const sql = fs.readFileSync('./marketplace-orders-schema.sql', 'utf8');

    // Split into individual statements and filter out comments
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip empty statements
      if (!statement || statement.length < 5) continue;

      // Extract first few words for logging
      const preview = statement.substring(0, 100).replace(/\n/g, ' ');

      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement + ';'
        });

        if (error) {
          console.log(`❌ Error on statement ${i + 1}: ${preview}...`);
          console.log(`   ${error.message}\n`);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1}: ${preview}...`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Exception on statement ${i + 1}: ${preview}...`);
        console.log(`   ${err.message}\n`);
        errorCount++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total: ${statements.length}`);

  } catch (error) {
    console.error('Fatal error:', error);
  }
}

console.log('Note: This script requires a Supabase service role key or SQL execution permissions.\n');
console.log('Alternative: Copy the SQL from marketplace-orders-schema.sql and run it directly in the Supabase SQL Editor.\n');
console.log('Supabase Dashboard → SQL Editor → New Query → Paste SQL → Run\n');

// applySchema();
