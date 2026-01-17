import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, AlertTriangle, Calendar, Hammer } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');
  const nav = await getTranslations('nav');
  const supabase = await createClient();

  const [
    { count: totalClients },
    { count: activeClients },
    { data: overduePayments },
    { data: pendingWork },
    { data: todaySchedule },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('payments').select('amount_due').eq('status', 'overdue'),
    supabase.from('additional_work').select('id').eq('status', 'pending'),
    supabase.from('schedule').select('id, client:clients(name), scheduled_time, service_type').eq('scheduled_date', new Date().toISOString().split('T')[0]).eq('status', 'scheduled'),
  ]);

  const overdueAmount = overduePayments?.reduce((sum, p) => sum + Number(p.amount_due), 0) || 0;

  const stats = [
    { label: t('totalClients'), value: totalClients ?? 0, icon: Users, color: 'text-blue-600' },
    { label: t('activeClients'), value: activeClients ?? 0, icon: Users, color: 'text-emerald-600' },
    { label: t('overduePayments'), value: overduePayments?.length ?? 0, icon: AlertTriangle, color: 'text-red-600' },
    { label: t('overdueAmount'), value: `$${overdueAmount.toFixed(2)}`, icon: DollarSign, color: 'text-red-600' },
    { label: t('pendingWork'), value: pendingWork?.length ?? 0, icon: Hammer, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('welcome')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              {t('todaySchedule')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySchedule && todaySchedule.length > 0 ? (
              <ul className="space-y-3">
                {todaySchedule.map((item: any) => (
                  <li key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{item.client?.name}</p>
                      <p className="text-sm text-muted-foreground">{item.scheduled_time || 'Anytime'}</p>
                    </div>
                    <Badge variant="outline">{item.service_type}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {nav('overdue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overduePayments && overduePayments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold text-red-600">{overduePayments.length}</span> overdue payments totaling{' '}
                  <span className="font-semibold text-red-600">${overdueAmount.toFixed(2)}</span>
                </p>
                <Link href="/overdue" className="text-sm font-medium text-emerald-600 hover:underline">
                  View all overdue accounts →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All payments are up to date!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
