import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSMS } from '@/lib/twilio/client';
import { getSMSTemplate, formatMessage } from '@/lib/sms-templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: overduePayments, error } = await supabase
      .from('payments')
      .select('*, client:clients(*)')
      .eq('status', 'overdue')
      .eq('reminder_sent', false)
      .gte('days_overdue', 3);

    if (error) throw error;

    let sentCount = 0;

    for (const payment of overduePayments || []) {
      const client = (payment as any).client;
      if (!client?.phone) continue;

      const template = getSMSTemplate('payment_reminder_3day', client.language);
      const message = formatMessage(template, {
        amount: ((payment as any).amount_due - (payment as any).amount_paid).toFixed(2),
        date: (payment as any).due_date,
        zelle: process.env.ZELLE_ADDRESS || 'tucker@email.com',
        phone: process.env.BUSINESS_PHONE || '305-555-0000',
      });

      try {
        await sendSMS(client.phone, message);
        await supabase
          .from('payments')
          .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
          .eq('id', (payment as any).id);
        sentCount++;
      } catch (smsError) {
        console.error(`Failed to send SMS to ${client.phone}:`, smsError);
      }
    }

    return NextResponse.json({ success: true, sentCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
