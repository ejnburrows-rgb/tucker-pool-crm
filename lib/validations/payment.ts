import { z } from 'zod';

export const paymentSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  invoice_date: z.string().min(1, 'Invoice date is required'),
  amount_due: z.number().min(0, 'Amount must be positive'),
  amount_paid: z.number().min(0, 'Amount must be positive').optional().default(0),
  payment_date: z.string().optional().nullable(),
  payment_method: z.enum(['zelle', 'check', 'cash', 'venmo']).optional().nullable(),
  reminder_sent: z.boolean().optional().default(false),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
