import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
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

    // SMS functionality is disabled - just return overdue count
    return NextResponse.json({
      success: true,
      message: 'SMS reminders disabled. Enable Twilio to send reminders.',
      overdueCount: overduePayments?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
