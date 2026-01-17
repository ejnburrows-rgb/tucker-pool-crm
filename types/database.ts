export type ServiceDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
export type PoolType = 'chlorine' | 'salt' | 'other';
export type LanguagePreference = 'en' | 'es';
export type PaymentMethod = 'zelle' | 'check' | 'cash' | 'venmo';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type ServiceType = 'regular' | 'additional_work' | 'estimate';

export type WorkType =
  | 'motor_replacement'
  | 'pool_light'
  | 'pump_repair'
  | 'filter_replacement'
  | 'heater_repair'
  | 'tile_coping_repair'
  | 'resurfacing'
  | 'leak_detection'
  | 'leak_repair'
  | 'equipment_upgrade'
  | 'construction_project'
  | 'deck_repair'
  | 'safety_cover'
  | 'pool_cover'
  | 'valve_replacement'
  | 'salt_cell_replacement'
  | 'automation_system'
  | 'other';

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  gate_code: string | null;
  service_day: ServiceDay;
  monthly_rate: number;
  pool_type: PoolType;
  is_active: boolean;
  language: LanguagePreference;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  client_id: string;
  invoice_date: string;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  payment_date: string | null;
  payment_method: PaymentMethod | null;
  status: PaymentStatus;
  days_overdue: number;
  reminder_sent: boolean;
  reminder_sent_at: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface AdditionalWork {
  id: string;
  client_id: string;
  work_date: string;
  work_type: WorkType;
  description: string | null;
  parts_cost: number;
  labor_hours: number;
  labor_rate: number;
  total_charge: number;
  amount_paid: number;
  payment_date: string | null;
  payment_method: PaymentMethod | null;
  status: PaymentStatus;
  invoice_sent: boolean;
  invoice_sent_at: string | null;
  reminder_sent: boolean;
  reminder_sent_at: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface Schedule {
  id: string;
  client_id: string;
  scheduled_date: string;
  scheduled_time: string | null;
  service_type: ServiceType;
  status: ScheduleStatus;
  notes: string | null;
  confirmation_sent: boolean;
  confirmation_sent_at: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface SMSTemplate {
  id: string;
  template_name: string;
  english_message: string;
  spanish_message: string;
  created_at: string;
  updated_at: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface ClientWithBalance extends Client {
  total_payments_owed: number;
  total_payments_paid: number;
  total_work_owed: number;
  total_work_paid: number;
  overdue_payments_count: number;
  overdue_work_count: number;
}

export interface OverdueItem {
  type: 'payment' | 'work';
  id: string;
  client_id: string;
  client_name: string;
  phone: string;
  language: LanguagePreference;
  amount: number;
  date: string;
  days_overdue: number;
  reminder_sent: boolean;
}

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: Client;
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'due_date' | 'status' | 'days_overdue' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payment, 'id' | 'due_date' | 'status' | 'days_overdue' | 'created_at' | 'updated_at'>>;
      };
      additional_work: {
        Row: AdditionalWork;
        Insert: Omit<AdditionalWork, 'id' | 'total_charge' | 'status' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AdditionalWork, 'id' | 'total_charge' | 'status' | 'created_at' | 'updated_at'>>;
      };
      schedule: {
        Row: Schedule;
        Insert: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Schedule, 'id' | 'created_at' | 'updated_at'>>;
      };
      sms_templates: {
        Row: SMSTemplate;
        Insert: Omit<SMSTemplate, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SMSTemplate, 'id' | 'created_at' | 'updated_at'>>;
      };
      app_settings: {
        Row: AppSetting;
        Insert: Omit<AppSetting, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AppSetting, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      clients_with_balance: {
        Row: ClientWithBalance;
      };
      all_overdue: {
        Row: OverdueItem;
      };
    };
  };
}
