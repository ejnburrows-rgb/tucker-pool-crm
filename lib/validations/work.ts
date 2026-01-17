import { z } from 'zod';

export const workSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  work_date: z.string().min(1, 'Work date is required'),
  work_type: z.enum([
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
  ]),
  description: z.string().optional().nullable(),
  parts_cost: z.number().min(0, 'Parts cost must be positive').default(0),
  labor_hours: z.number().min(0, 'Labor hours must be positive').default(0),
  labor_rate: z.number().min(0, 'Labor rate must be positive').default(75),
  amount_paid: z.number().min(0, 'Amount must be positive').optional().default(0),
  payment_date: z.string().optional().nullable(),
  payment_method: z.enum(['zelle', 'check', 'cash', 'venmo']).optional().nullable(),
  invoice_sent: z.boolean().optional().default(false),
  reminder_sent: z.boolean().optional().default(false),
});

export type WorkFormData = z.infer<typeof workSchema>;
