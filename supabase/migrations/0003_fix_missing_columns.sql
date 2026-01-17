-- Fix missing columns in clients table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ijwtylvekuirzvlreuhp/sql

-- Add missing columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS gate_code VARCHAR(50);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have default values
UPDATE clients SET is_active = true WHERE is_active IS NULL;
UPDATE clients SET language = 'en' WHERE language IS NULL;
UPDATE clients SET created_at = NOW() WHERE created_at IS NULL;
UPDATE clients SET updated_at = NOW() WHERE updated_at IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;
