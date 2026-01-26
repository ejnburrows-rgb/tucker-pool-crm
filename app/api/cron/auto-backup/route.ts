import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all data
    const [clientsRes, paymentsRes, workRes, scheduleRes, settingsRes] = await Promise.all([
      supabase.from('clients').select('*'),
      supabase.from('payments').select('*'),
      supabase.from('additional_work').select('*'),
      supabase.from('schedule').select('*'),
      supabase.from('app_settings').select('*'),
    ]);

    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      exportType: 'auto-cron',
      stats: {
        clients: clientsRes.data?.length || 0,
        payments: paymentsRes.data?.length || 0,
        additionalWork: workRes.data?.length || 0,
        schedule: scheduleRes.data?.length || 0,
      },
      data: {
        clients: clientsRes.data || [],
        payments: paymentsRes.data || [],
        additionalWork: workRes.data || [],
        schedule: scheduleRes.data || [],
        settings: settingsRes.data || [],
      },
    };

    // Store backup in app_settings as a JSON string
    const backupKey = `backup_${new Date().toISOString().split('T')[0]}`;
    
    await supabase.from('app_settings').upsert({
      key: backupKey,
      value: JSON.stringify(backupData),
    }, { onConflict: 'key' });

    // Clean up old backups (keep last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: oldBackups } = await supabase
      .from('app_settings')
      .select('key')
      .like('key', 'backup_%');

    if (oldBackups) {
      for (const backup of oldBackups) {
        const dateStr = backup.key.replace('backup_', '');
        const backupDate = new Date(dateStr);
        if (backupDate < sevenDaysAgo) {
          await supabase.from('app_settings').delete().eq('key', backup.key);
        }
      }
    }

    console.log(`[Auto-Backup] Completed: ${JSON.stringify(backupData.stats)}`);

    return NextResponse.json({
      success: true,
      message: 'Auto-backup completed',
      stats: backupData.stats,
      backupKey,
    });
  } catch (error) {
    console.error('[Auto-Backup] Error:', error);
    return NextResponse.json(
      { error: 'Backup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
