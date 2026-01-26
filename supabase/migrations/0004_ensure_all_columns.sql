-- Ensure all columns exist with correct types
-- Run this in Supabase SQL Editor if you encounter any column-related errors

-- Ensure payments table has all required columns
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Ensure additional_work table has all required columns  
ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS invoice_sent BOOLEAN DEFAULT false;
ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMPTZ;
ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE additional_work ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Ensure schedule table has all required columns
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT false;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ;

-- Update any NULL values to defaults
UPDATE payments SET reminder_sent = false WHERE reminder_sent IS NULL;
UPDATE additional_work SET invoice_sent = false WHERE invoice_sent IS NULL;
UPDATE additional_work SET reminder_sent = false WHERE reminder_sent IS NULL;
UPDATE schedule SET confirmation_sent = false WHERE confirmation_sent IS NULL;

-- Verify table structures
SELECT 'payments' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position;

SELECT 'additional_work' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'additional_work' 
ORDER BY ordinal_position;

SELECT 'schedule' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'schedule' 
ORDER BY ordinal_position;
