export const SERVICE_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

export const POOL_TYPES = ['chlorine', 'salt', 'other'] as const;

export const PAYMENT_METHODS = ['zelle', 'check', 'cash', 'venmo'] as const;

export const PAYMENT_STATUSES = ['pending', 'paid', 'overdue'] as const;

export const SCHEDULE_STATUSES = ['scheduled', 'completed', 'cancelled', 'rescheduled'] as const;

export const SERVICE_TYPES = ['regular', 'additional_work', 'estimate'] as const;

export const WORK_TYPES = [
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
  'other',
] as const;

export const LANGUAGES = ['en', 'es'] as const;

export const DEFAULT_LABOR_RATE = 75.0;

export const OVERDUE_REMINDER_DAYS = 3;

export const WORK_REMINDER_DAYS = 7;

export const LOCALES = ['en', 'es'] as const;

export const DEFAULT_LOCALE = 'en';
