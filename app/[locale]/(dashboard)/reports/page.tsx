import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';

export default async function ReportsPage() {
  const t = await getTranslations('reports');
  const supabase = await createClient();

  const [
    { count: totalClients },
    { count: activeClients },
    { data: paymentsData },
    { data: workData },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('payments').select('amount_due, amount_paid, status'),
    supabase.from('additional_work').select('total_charge, amount_paid, status'),
  ]);

  const payments = (paymentsData as any[]) || [];
  const work = (workData as any[]) || [];

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const overduePayments = payments.filter(p => p.status === 'overdue').length;
  const paidPayments = payments.filter(p => p.status === 'paid').length;

  const workRevenue = work.reduce((sum, w) => sum + Number(w.amount_paid || 0), 0);
  const pendingWork = work.filter(w => w.status === 'pending').length;
  const completedWork = work.filter(w => w.status === 'completed').length;

  const stats = [
    { label: t('totalClients'), value: totalClients ?? 0, icon: Users, color: 'text-blue-600' },
    { label: t('activeClients'), value: activeClients ?? 0, icon: Users, color: 'text-blue-700' },
    { label: t('totalRevenue'), value: `$${(totalRevenue + workRevenue).toFixed(2)}`, icon: DollarSign, color: 'text-blue-600' },
    { label: t('monthlyRevenue'), value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <DollarSign className="h-5 w-5 text-blue-700" />
              {t('paymentsSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('paid')}</span>
              <span className="font-semibold text-blue-600">{paidPayments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('pending')}</span>
              <span className="font-semibold text-amber-600">{pendingPayments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('overdue')}</span>
              <span className="font-semibold text-red-600">{overduePayments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {t('workOrdersSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('completed')}</span>
              <span className="font-semibold text-blue-600">{completedWork}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('pending')}</span>
              <span className="font-semibold text-amber-600">{pendingWork}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('workRevenue')}</span>
              <span className="font-semibold text-blue-700">${workRevenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
