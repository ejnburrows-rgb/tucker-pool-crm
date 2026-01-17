import { z } from 'zod';

export const scheduleSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
  scheduled_time: z.string().optional().nullable(),
  service_type: z.enum(['regular', 'additional_work', 'estimate']),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).default('scheduled'),
  notes: z.string().optional().nullable(),
  confirmation_sent: z.boolean().optional().default(false),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
