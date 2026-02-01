-- Enable RLS on all tables (idempotent)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Drop insecure policies if they exist (from 0002_disable_rls.sql)
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

-- Revoke public access from anon
REVOKE ALL ON clients FROM anon;
REVOKE ALL ON payments FROM anon;
REVOKE ALL ON additional_work FROM anon;
REVOKE ALL ON schedule FROM anon;
REVOKE ALL ON app_settings FROM anon;
REVOKE ALL ON sms_templates FROM anon;

-- Grant access to authenticated users
GRANT ALL ON clients TO authenticated;
GRANT ALL ON payments TO authenticated;
GRANT ALL ON additional_work TO authenticated;
GRANT ALL ON schedule TO authenticated;
GRANT ALL ON app_settings TO authenticated;
GRANT ALL ON sms_templates TO authenticated;

-- Create policies for authenticated users (Full Access)
-- Re-creating them to ensure they exist and are correct
DROP POLICY IF EXISTS "Enable all for authenticated users" ON clients;
CREATE POLICY "Enable all for authenticated users" ON clients FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON payments;
CREATE POLICY "Enable all for authenticated users" ON payments FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON additional_work;
CREATE POLICY "Enable all for authenticated users" ON additional_work FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON schedule;
CREATE POLICY "Enable all for authenticated users" ON schedule FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON sms_templates;
CREATE POLICY "Enable all for authenticated users" ON sms_templates FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON app_settings;
CREATE POLICY "Enable all for authenticated users" ON app_settings FOR ALL USING (auth.role() = 'authenticated');
