-- Disable Row Level Security for public access (no authentication)
-- Run this in Supabase SQL Editor

ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE additional_work DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON clients;
DROP POLICY IF EXISTS "Enable insert access for all users" ON clients;
DROP POLICY IF EXISTS "Enable update access for all users" ON clients;
DROP POLICY IF EXISTS "Enable delete access for all users" ON clients;

DROP POLICY IF EXISTS "Enable read access for all users" ON payments;
DROP POLICY IF EXISTS "Enable insert access for all users" ON payments;
DROP POLICY IF EXISTS "Enable update access for all users" ON payments;
DROP POLICY IF EXISTS "Enable delete access for all users" ON payments;

DROP POLICY IF EXISTS "Enable read access for all users" ON additional_work;
DROP POLICY IF EXISTS "Enable insert access for all users" ON additional_work;
DROP POLICY IF EXISTS "Enable update access for all users" ON additional_work;
DROP POLICY IF EXISTS "Enable delete access for all users" ON additional_work;

DROP POLICY IF EXISTS "Enable read access for all users" ON schedule;
DROP POLICY IF EXISTS "Enable insert access for all users" ON schedule;
DROP POLICY IF EXISTS "Enable update access for all users" ON schedule;
DROP POLICY IF EXISTS "Enable delete access for all users" ON schedule;

DROP POLICY IF EXISTS "Enable read access for all users" ON app_settings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON app_settings;
DROP POLICY IF EXISTS "Enable update access for all users" ON app_settings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON app_settings;

DROP POLICY IF EXISTS "Enable read access for all users" ON sms_templates;
DROP POLICY IF EXISTS "Enable insert access for all users" ON sms_templates;
DROP POLICY IF EXISTS "Enable update access for all users" ON sms_templates;
DROP POLICY IF EXISTS "Enable delete access for all users" ON sms_templates;

-- Grant full access to anon and authenticated roles
GRANT ALL ON clients TO anon, authenticated;
GRANT ALL ON payments TO anon, authenticated;
GRANT ALL ON additional_work TO anon, authenticated;
GRANT ALL ON schedule TO anon, authenticated;
GRANT ALL ON app_settings TO anon, authenticated;
GRANT ALL ON sms_templates TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
