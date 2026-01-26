import { z } from 'zod';

// Client schema for import validation
const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional().default(''),
  gate_code: z.string().nullable().optional(),
  service_day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
  monthly_rate: z.number().min(0),
  pool_type: z.enum(['chlorine', 'salt', 'other']).optional().default('chlorine'),
  is_active: z.boolean().optional().default(true),
  language: z.enum(['en', 'es']).optional().default('en'),
  notes: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const paymentSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  invoice_date: z.string(),
  amount_due: z.number().min(0),
  amount_paid: z.number().min(0).optional().default(0),
  payment_date: z.string().nullable().optional(),
  payment_method: z.enum(['zelle', 'check', 'cash', 'venmo']).nullable().optional(),
  reminder_sent: z.boolean().optional().default(false),
  reminder_sent_at: z.string().nullable().optional(),
});

const workSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  work_date: z.string(),
  work_type: z.enum([
    'motor_replacement', 'pool_light', 'pump_repair', 'filter_replacement',
    'heater_repair', 'tile_coping_repair', 'resurfacing', 'leak_detection',
    'leak_repair', 'equipment_upgrade', 'construction_project', 'deck_repair',
    'safety_cover', 'pool_cover', 'valve_replacement', 'salt_cell_replacement',
    'automation_system', 'other'
  ]),
  description: z.string().nullable().optional(),
  parts_cost: z.number().min(0).optional().default(0),
  labor_hours: z.number().min(0).optional().default(0),
  labor_rate: z.number().min(0).optional().default(75),
  amount_paid: z.number().min(0).optional().default(0),
  payment_date: z.string().nullable().optional(),
  payment_method: z.enum(['zelle', 'check', 'cash', 'venmo']).nullable().optional(),
  invoice_sent: z.boolean().optional().default(false),
  reminder_sent: z.boolean().optional().default(false),
});

const scheduleSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  scheduled_date: z.string(),
  scheduled_time: z.string().nullable().optional(),
  service_type: z.enum(['regular', 'additional_work', 'estimate']).optional().default('regular'),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).optional().default('scheduled'),
  notes: z.string().nullable().optional(),
  confirmation_sent: z.boolean().optional().default(false),
});

// Full backup schema
const backupSchema = z.object({
  exportDate: z.string().optional(),
  version: z.string().optional(),
  clients: z.array(clientSchema).optional().default([]),
  payments: z.array(paymentSchema).optional().default([]),
  additionalWork: z.array(workSchema).optional().default([]),
  schedule: z.array(scheduleSchema).optional().default([]),
});

export interface ValidationResult {
  valid: boolean;
  data?: z.infer<typeof backupSchema>;
  errors?: string[];
  warnings?: string[];
  stats?: {
    clients: number;
    payments: number;
    additionalWork: number;
    schedule: number;
  };
}

export function validateImportData(data: unknown): ValidationResult {
  const warnings: string[] = [];
  
  try {
    // Check if data is an object
    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: ['Invalid data format: expected an object'],
      };
    }

    // Parse and validate
    const result = backupSchema.safeParse(data);
    
    if (!result.success) {
      const errors = result.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return {
        valid: false,
        errors,
      };
    }

    const validData = result.data;

    // Check for orphaned references
    const clientIds = new Set(validData.clients.map(c => c.id).filter(Boolean));
    
    for (const payment of validData.payments) {
      if (payment.client_id && !clientIds.has(payment.client_id)) {
        warnings.push(`Payment references unknown client: ${payment.client_id}`);
      }
    }

    for (const work of validData.additionalWork) {
      if (work.client_id && !clientIds.has(work.client_id)) {
        warnings.push(`Work order references unknown client: ${work.client_id}`);
      }
    }

    for (const sched of validData.schedule) {
      if (sched.client_id && !clientIds.has(sched.client_id)) {
        warnings.push(`Schedule entry references unknown client: ${sched.client_id}`);
      }
    }

    return {
      valid: true,
      data: validData,
      warnings: warnings.length > 0 ? warnings : undefined,
      stats: {
        clients: validData.clients.length,
        payments: validData.payments.length,
        additionalWork: validData.additionalWork.length,
        schedule: validData.schedule.length,
      },
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown validation error'],
    };
  }
}

export function validateClient(data: unknown) {
  return clientSchema.safeParse(data);
}

export function validatePayment(data: unknown) {
  return paymentSchema.safeParse(data);
}

export function validateWork(data: unknown) {
  return workSchema.safeParse(data);
}

export function validateSchedule(data: unknown) {
  return scheduleSchema.safeParse(data);
}
