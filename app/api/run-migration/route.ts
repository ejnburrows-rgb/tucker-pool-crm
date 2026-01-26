import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Migration 0004: Ensure all columns exist
    const migrations = [
      // Ensure payments table has all required columns
      `ALTER TABLE payments ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false`,
      `ALTER TABLE payments ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ`,
      
      // Ensure additional_work table has all required columns
      `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS invoice_sent BOOLEAN DEFAULT false`,
      `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMPTZ`,
      `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false`,
      `ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ`,
      
      // Ensure schedule table has all required columns
      `ALTER TABLE schedule ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT false`,
      `ALTER TABLE schedule ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ`,
      
      // Update NULL values to defaults
      `UPDATE payments SET reminder_sent = false WHERE reminder_sent IS NULL`,
      `UPDATE additional_work SET invoice_sent = false WHERE invoice_sent IS NULL`,
      `UPDATE additional_work SET reminder_sent = false WHERE reminder_sent IS NULL`,
      `UPDATE schedule SET confirmation_sent = false WHERE confirmation_sent IS NULL`,
    ];

    const results = [];
    
    for (const sql of migrations) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();
      if (error) {
        // Try direct query if RPC doesn't exist
        const directResult = await supabase.from('_migrations_log').select('*').limit(1);
        results.push({ sql: sql.substring(0, 50), status: 'attempted', note: error.message });
      } else {
        results.push({ sql: sql.substring(0, 50), status: 'success' });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration attempted',
      results,
    });
  } catch (error) {
    console.error('[Migration] Error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
