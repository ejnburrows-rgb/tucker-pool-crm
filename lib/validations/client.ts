import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  gate_code: z.string().optional().nullable(),
  service_day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
  monthly_rate: z.number().min(0, 'Monthly rate must be positive'),
  pool_type: z.enum(['chlorine', 'salt', 'other']),
  language: z.enum(['en', 'es']),
  is_active: z.boolean(),
  notes: z.string().optional().nullable(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
