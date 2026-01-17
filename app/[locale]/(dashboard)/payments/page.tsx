import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; client?: string }>;
}) {
  const t = await getTranslations('payments');
  const common = await getTranslations('common');
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from('payments')
    .select('*, client:clients(id, name, phone)')
    .order('invoice_date', { ascending: false });

  if (params.status) {
    query = query.eq('status', params.status);
  }

  if (params.client) {
    query = query.eq('client_id', params.client);
  }

  const { data: payments } = await query;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('monthlyPayments')}</p>
        </div>
        <Button asChild>
          <Link href="payments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addPayment')}
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant={!params.status ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?">All</Link>
        </Button>
        <Button variant={params.status === 'pending' ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?status=pending">{t('pending')}</Link>
        </Button>
        <Button variant={params.status === 'overdue' ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?status=overdue">{t('overdue')}</Link>
        </Button>
        <Button variant={params.status === 'paid' ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?status=paid">{t('paid')}</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>{t('invoiceDate')}</TableHead>
                <TableHead>{t('dueDate')}</TableHead>
                <TableHead className="text-right">{t('amountDue')}</TableHead>
                <TableHead className="text-right">{t('amountPaid')}</TableHead>
                <TableHead>{common('status')}</TableHead>
                <TableHead>{t('daysOverdue')}</TableHead>
                <TableHead>{common('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments && payments.length > 0 ? (
                payments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Link
                        href={`clients/${payment.client?.id}`}
                        className="font-medium hover:underline"
                      >
                        {payment.client?.name}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(payment.invoice_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(payment.due_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-medium">${payment.amount_due}</TableCell>
                    <TableCell className="text-right">${payment.amount_paid}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)}>{t(payment.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      {payment.days_overdue > 0 && (
                        <span className="text-red-600">{payment.days_overdue}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`payments/${payment.id}`}>{common('view')}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    {common('noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
