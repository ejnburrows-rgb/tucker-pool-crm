import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendSMS } from '@/lib/twilio/client';
import { getSMSTemplate, formatMessage } from '@/lib/sms-templates';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { type, id, templateName } = body;

  if (!type || !id) {
    return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
  }

  let client: any;
  let amount: number;
  let date: string;
  let workType: string | undefined;

  if (type === 'payment') {
    const { data: payment } = await supabase
      .from('payments')
      .select('*, client:clients(*)')
      .eq('id', id)
      .single();

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    client = payment.client;
    amount = payment.amount_due - payment.amount_paid;
    date = payment.due_date;
  } else if (type === 'work') {
    const { data: work } = await supabase
      .from('additional_work')
      .select('*, client:clients(*)')
      .eq('id', id)
      .single();

    if (!work) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    client = work.client;
    amount = work.total_charge - work.amount_paid;
    date = work.work_date;
    workType = work.work_type;
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const template = getSMSTemplate(
    templateName || (type === 'payment' ? 'payment_reminder_3day' : 'work_reminder_7day'),
    client.language
  );

  const message = formatMessage(template, {
    amount: amount.toFixed(2),
    date,
    work_type: workType?.replace(/_/g, ' '),
    zelle: process.env.ZELLE_ADDRESS || 'tucker@email.com',
    phone: process.env.BUSINESS_PHONE || '305-555-0000',
  });

  try {
    await sendSMS(client.phone, message);

    if (type === 'payment') {
      await supabase
        .from('payments')
        .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
        .eq('id', id);
    } else {
      await supabase
        .from('additional_work')
        .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
        .eq('id', id);
    }

    return NextResponse.json({ success: true, message: 'SMS sent' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
