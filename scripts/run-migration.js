#!/usr/bin/env node

/**
 * Run Supabase migration 0004_ensure_all_columns.sql
 * Usage: node scripts/run-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running migration 0004_ensure_all_columns.sql...\n');

  const migrations = [
    {
      name: 'Add payments.reminder_sent',
      sql: `ALTER TABLE payments ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false`,
    },
    {
      name: 'Add payments.reminder_sent_at',
      sql: `ALTER TABLE payments ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ`,
    },
    {
      name: 'Add additional_work.invoice_sent',
      sql: `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS invoice_sent BOOLEAN DEFAULT false`,
    },
    {
      name: 'Add additional_work.invoice_sent_at',
      sql: `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMPTZ`,
    },
    {
      name: 'Add additional_work.reminder_sent',
      sql: `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false`,
    },
    {
      name: 'Add additional_work.reminder_sent_at',
      sql: `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ`,
    },
    {
      name: 'Add schedule.confirmation_sent',
      sql: `ALTER TABLE schedule ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT false`,
    },
    {
      name: 'Add schedule.confirmation_sent_at',
      sql: `ALTER TABLE schedule ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ`,
    },
    {
      name: 'Update payments NULL values',
      sql: `UPDATE payments SET reminder_sent = false WHERE reminder_sent IS NULL`,
    },
    {
      name: 'Update additional_work.invoice_sent NULL values',
      sql: `UPDATE additional_work SET invoice_sent = false WHERE invoice_sent IS NULL`,
    },
    {
      name: 'Update additional_work.reminder_sent NULL values',
      sql: `UPDATE additional_work SET reminder_sent = false WHERE reminder_sent IS NULL`,
    },
    {
      name: 'Update schedule NULL values',
      sql: `UPDATE schedule SET confirmation_sent = false WHERE confirmation_sent IS NULL`,
    },
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const migration of migrations) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: migration.sql });
      
      if (error) {
        // Supabase doesn't have exec_sql RPC by default, so we'll use a workaround
        // Try to execute via a dummy select to test if columns exist
        console.log(`⚠️  ${migration.name} - Using alternative method`);
        
        // For ALTER TABLE, we can't execute directly via JS client
        // This would need to be run in SQL Editor
        console.log(`   SQL: ${migration.sql}`);
        errorCount++;
      } else {
        console.log(`✅ ${migration.name}`);
        successCount++;
      }
    } catch (err) {
      console.log(`⚠️  ${migration.name} - ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} need manual execution`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some migrations need to be run manually in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/ijwtylvekuirzvlreuhp/sql/new');
    console.log('\n   Copy and paste the SQL from: supabase/migrations/0004_ensure_all_columns.sql');
  } else {
    console.log('\n✅ All migrations completed successfully!');
  }
}

runMigration().catch(console.error);
