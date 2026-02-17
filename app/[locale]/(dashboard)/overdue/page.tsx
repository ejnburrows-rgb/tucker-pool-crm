import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, AlertTriangle, DollarSign, MessageSquare } from 'lucide-react';

export default async function OverduePage() {
  const t = await getTranslations('overdue');
  const common = await getTranslations('common');
  const supabase = await createClient();

  const [
    { data: overduePayments },
    { data: overdueWork }
  ] = await Promise.all([
    supabase
      .from('payments')
      .select('*, client:clients(id, name, phone, language)')
      .eq('status', 'overdue')
      .order('days_overdue', { ascending: false }),
    supabase
      .from('additional_work')
      .select('*, client:clients(id, name, phone, language)')
      .eq('status', 'overdue')
      .order('work_date', { ascending: true })
  ]);

  const totalPaymentsOverdue = overduePayments?.reduce((sum, p: any) => sum + Number(p.amount_due - p.amount_paid), 0) || 0;
  const totalWorkOverdue = overdueWork?.reduce((sum, w: any) => sum + Number(w.total_charge - w.amount_paid), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('totalOverdue')}: <span className="font-bold text-red-600">${(totalPaymentsOverdue + totalWorkOverdue).toFixed(2)}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              {t('overduePayments')} ({overduePayments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overduePayments && overduePayments.length > 0 ? (
              overduePayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                  <div>
                    <Link href={`clients/${payment.client?.id}`} className="font-medium hover:underline">
                      {payment.client?.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      ${(payment.amount_due - payment.amount_paid).toFixed(2)} · {payment.days_overdue} {t('daysPastDue')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${payment.client?.phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/api/sms/send?type=payment&id=${payment.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-muted-foreground">No overdue payments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              {t('overdueWork')} ({overdueWork?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueWork && overdueWork.length > 0 ? (
              overdueWork.map((work: any) => (
                <div key={work.id} className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div>
                    <Link href={`clients/${work.client?.id}`} className="font-medium hover:underline">
                      {work.client?.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {work.work_type.replace(/_/g, ' ')} · ${(work.total_charge - work.amount_paid).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${work.client?.phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/api/sms/send?type=work&id=${work.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-muted-foreground">No overdue work invoices</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
