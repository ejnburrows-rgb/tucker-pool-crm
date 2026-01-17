-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE service_day AS ENUM (
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
);

CREATE TYPE pool_type AS ENUM (
  'chlorine', 'salt', 'other'
);

CREATE TYPE language_preference AS ENUM (
  'en', 'es'
);

CREATE TYPE payment_method AS ENUM (
  'zelle', 'check', 'cash', 'venmo'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'overdue'
);

CREATE TYPE work_type AS ENUM (
  'motor_replacement',
  'pool_light',
  'pump_repair',
  'filter_replacement',
  'heater_repair',
  'tile_coping_repair',
  'resurfacing',
  'leak_detection',
  'leak_repair',
  'equipment_upgrade',
  'construction_project',
  'deck_repair',
  'safety_cover',
  'pool_cover',
  'valve_replacement',
  'salt_cell_replacement',
  'automation_system',
  'other'
);

CREATE TYPE schedule_status AS ENUM (
  'scheduled', 'completed', 'cancelled', 'rescheduled'
);

CREATE TYPE service_type AS ENUM (
  'regular', 'additional_work', 'estimate'
);

-- ============================================
-- TABLES
-- ============================================

-- Clients Table (Master Client List)
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  gate_code VARCHAR(50),
  service_day service_day NOT NULL,
  monthly_rate DECIMAL(10,2) NOT NULL,
  pool_type pool_type NOT NULL DEFAULT 'chlorine',
  is_active BOOLEAN NOT NULL DEFAULT true,
  language language_preference NOT NULL DEFAULT 'en',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Table (Monthly Recurring Payments)
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_date DATE NOT NULL,
  due_date DATE GENERATED ALWAYS AS (invoice_date + INTERVAL '15 days') STORED,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_date DATE,
  payment_method payment_method,
  status payment_status GENERATED ALWAYS AS (
    CASE 
      WHEN amount_paid >= amount_due THEN 'paid'::payment_status
      WHEN CURRENT_DATE > (invoice_date + INTERVAL '15 days') THEN 'overdue'::payment_status
      ELSE 'pending'::payment_status
    END
  ) STORED,
  days_overdue INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN CURRENT_DATE > (invoice_date + INTERVAL '15 days') AND amount_paid < amount_due
      THEN EXTRACT(DAY FROM (CURRENT_DATE - (invoice_date + INTERVAL '15 days')))::INTEGER
      ELSE 0
    END
  ) STORED,
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional Work Table (One-Time Jobs)
CREATE TABLE additional_work (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  work_type work_type NOT NULL,
  description TEXT,
  parts_cost DECIMAL(10,2) DEFAULT 0,
  labor_hours DECIMAL(5,2) DEFAULT 0,
  labor_rate DECIMAL(10,2) DEFAULT 75.00,
  total_charge DECIMAL(10,2) GENERATED ALWAYS AS (
    parts_cost + (labor_hours * labor_rate)
  ) STORED,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_date DATE,
  payment_method payment_method,
  status payment_status GENERATED ALWAYS AS (
    CASE 
      WHEN amount_paid >= (parts_cost + (labor_hours * labor_rate)) THEN 'paid'::payment_status
      WHEN CURRENT_DATE > (work_date + INTERVAL '15 days') AND amount_paid < (parts_cost + (labor_hours * labor_rate)) THEN 'overdue'::payment_status
      ELSE 'pending'::payment_status
    END
  ) STORED,
  invoice_sent BOOLEAN DEFAULT false,
  invoice_sent_at TIMESTAMPTZ,
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule Table (Appointments)
CREATE TABLE schedule (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  service_type service_type NOT NULL DEFAULT 'regular',
  status schedule_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  confirmation_sent BOOLEAN DEFAULT false,
  confirmation_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS Templates Table
CREATE TABLE sms_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL UNIQUE,
  english_message TEXT NOT NULL,
  spanish_message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- App Settings Table
CREATE TABLE app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_clients_active ON clients(is_active);
CREATE INDEX idx_clients_service_day ON clients(service_day);
CREATE INDEX idx_clients_name ON clients(name);

CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_invoice_date ON payments(invoice_date);

CREATE INDEX idx_work_client_id ON additional_work(client_id);
CREATE INDEX idx_work_status ON additional_work(status);
CREATE INDEX idx_work_date ON additional_work(work_date);

CREATE INDEX idx_schedule_client_id ON schedule(client_id);
CREATE INDEX idx_schedule_date ON schedule(scheduled_date);
CREATE INDEX idx_schedule_status ON schedule(status);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_updated_at
    BEFORE UPDATE ON additional_work
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_updated_at
    BEFORE UPDATE ON schedule
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (all CRUD)
CREATE POLICY "Enable all for authenticated users" ON clients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON payments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON additional_work
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON schedule
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON sms_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON app_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: SMS TEMPLATES
-- ============================================

INSERT INTO sms_templates (template_name, english_message, spanish_message) VALUES
(
  'payment_reminder_3day',
  'Hi! This is Tucker Pool Service. Your monthly service payment of ${amount} was due on {date}. Please Zelle payment to: {zelle}. Questions? Call us at {phone}. Thank you!',
  '¡Hola! Le saluda Tucker Pool Service. Su pago mensual de servicio de ${amount} venció el {date}. Por favor envíe el pago por Zelle a: {zelle}. ¿Preguntas? Llámenos al {phone}. ¡Gracias!'
),
(
  'work_reminder_7day',
  'Hi! Tucker Pool Service here. Friendly reminder: your invoice for {work_type} completed on {date} is ready. Amount due: ${amount}. Please Zelle to: {zelle}. Thank you!',
  '¡Hola! Le saluda Tucker Pool Service. Recordatorio: su factura por {work_type} completado el {date} está lista. Monto: ${amount}. Por favor envíe por Zelle a: {zelle}. ¡Gracias!'
),
(
  'appointment_confirmation',
  'Reminder from Tucker Pool Service! We are scheduled to visit tomorrow, {date} at {time} for {service_type}. Address: {address}. Please ensure gate access. Questions? {phone}',
  '¡Recordatorio de Tucker Pool Service! Visitaremos mañana, {date} a las {time} para {service_type}. Dirección: {address}. Asegure acceso al portón. ¿Preguntas? {phone}'
);

-- ============================================
-- SEED DATA: APP SETTINGS
-- ============================================

INSERT INTO app_settings (key, value) VALUES
('business_name', 'Tucker Pool Service'),
('business_phone', '305-555-0000'),
('zelle_address', 'tucker@email.com'),
('owner_email', 'owner@tuckerps.com'),
('default_labor_rate', '75.00');

-- ============================================
-- VIEWS
-- ============================================

-- View: Clients with aggregated payment info
CREATE VIEW clients_with_balance AS
SELECT 
  c.*, 
  COALESCE(p.total_owed, 0) as total_payments_owed,
  COALESCE(p.total_paid, 0) as total_payments_paid,
  COALESCE(w.total_work_owed, 0) as total_work_owed,
  COALESCE(w.total_work_paid, 0) as total_work_paid,
  COALESCE(p.overdue_count, 0) as overdue_payments_count,
  COALESCE(w.overdue_work_count, 0) as overdue_work_count
FROM clients c
LEFT JOIN (
  SELECT 
    client_id,
    SUM(amount_due) as total_owed,
    SUM(amount_paid) as total_paid,
    COUNT(*) FILTER (WHERE status = 'overdue') as overdue_count
  FROM payments
  GROUP BY client_id
) p ON c.id = p.client_id
LEFT JOIN (
  SELECT 
    client_id,
    SUM(total_charge) as total_work_owed,
    SUM(amount_paid) as total_work_paid,
    COUNT(*) FILTER (WHERE status = 'overdue') as overdue_work_count
  FROM additional_work
  GROUP BY client_id
) w ON c.id = w.client_id;

-- View: All overdue items combined
CREATE VIEW all_overdue AS
SELECT 
  'payment' as type,
  p.id,
  c.id as client_id,
  c.name as client_name,
  c.phone,
  c.language,
  p.amount_due as amount,
  p.due_date as date,
  p.days_overdue,
  p.reminder_sent
FROM payments p
JOIN clients c ON p.client_id = c.id
WHERE p.status = 'overdue'
UNION ALL
SELECT 
  'work' as type,
  w.id,
  c.id as client_id,
  c.name as client_name,
  c.phone,
  c.language,
  w.total_charge as amount,
  w.work_date + INTERVAL '15 days' as date,
  EXTRACT(DAY FROM (CURRENT_DATE - (w.work_date + INTERVAL '15 days')))::INTEGER as days_overdue,
  w.reminder_sent
FROM additional_work w
JOIN clients c ON w.client_id = c.id
WHERE w.status = 'overdue';
