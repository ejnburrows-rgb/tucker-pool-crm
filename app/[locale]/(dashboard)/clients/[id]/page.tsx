import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, MapPin, Calendar, DollarSign, Edit, ArrowLeft } from 'lucide-react';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations('clients');
  const common = await getTranslations('common');
  const serviceDays = await getTranslations('serviceDays');
  const poolTypes = await getTranslations('poolTypes');
  const languages = await getTranslations('languages');
  const supabase = await createClient();

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (!client) {
    notFound();
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', id)
    .order('invoice_date', { ascending: false })
    .limit(5);

  const { data: workOrders } = await supabase
    .from('additional_work')
    .select('*')
    .eq('client_id', id)
    .order('work_date', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/clients`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">{t('clientDetails')}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/clients/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {common('edit')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('contactInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${client.phone}`} className="font-medium text-emerald-600 hover:underline">
                {client.phone}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p>{client.address}</p>
                <p className="text-muted-foreground">{client.city}</p>
              </div>
            </div>
            {client.gate_code && (
              <div className="rounded-md bg-amber-50 p-3 text-sm">
                <span className="font-medium">Gate Code:</span> {client.gate_code}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('language')}:</span>
              <Badge variant="outline">{languages(client.language)}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('serviceInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('serviceDay')}</span>
              <span className="font-medium">{serviceDays(client.service_day)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('monthlyRate')}</span>
              <span className="text-lg font-bold text-emerald-600">${client.monthly_rate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('poolType')}</span>
              <Badge>{poolTypes(client.pool_type)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{common('status')}</span>
              <Badge variant={client.is_active ? 'default' : 'secondary'}>
                {client.is_active ? t('active') : t('inactive')}
              </Badge>
            </div>
            {client.notes && (
              <>
                <Separator />
                <div>
                  <p className="mb-1 text-sm font-medium">{common('notes')}</p>
                  <p className="text-sm text-muted-foreground">{client.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('paymentHistory')}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/payments?client=${id}`}>{common('view')}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <ul className="space-y-2">
                {payments.map((payment: any) => (
                  <li key={payment.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <span>{new Date(payment.invoice_date).toLocaleDateString()}</span>
                    <span className="font-medium">${payment.amount_due}</span>
                    <Badge
                      variant={
                        payment.status === 'paid'
                          ? 'default'
                          : payment.status === 'overdue'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('noPayments')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('workHistory')}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${locale}/work?client=${id}`}>{common('view')}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {workOrders && workOrders.length > 0 ? (
              <ul className="space-y-2">
                {workOrders.map((work: any) => (
                  <li key={work.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <span>{new Date(work.work_date).toLocaleDateString()}</span>
                    <span>{work.work_type.replace(/_/g, ' ')}</span>
                    <span className="font-medium">${work.total_charge}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('noWork')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
