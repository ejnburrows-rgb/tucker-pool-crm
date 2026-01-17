import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; client?: string }>;
}) {
  const t = await getTranslations('work');
  const common = await getTranslations('common');
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from('additional_work')
    .select('*, client:clients(id, name)')
    .order('work_date', { ascending: false });

  if (params.status) {
    query = query.eq('status', params.status);
  }

  if (params.client) {
    query = query.eq('client_id', params.client);
  }

  const { data: workOrders } = await query;

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
        </div>
        <Button asChild>
          <Link href="work/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addWork')}
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant={!params.status ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?">All</Link>
        </Button>
        <Button variant={params.status === 'pending' ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?status=pending">Pending</Link>
        </Button>
        <Button variant={params.status === 'overdue' ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?status=overdue">Overdue</Link>
        </Button>
        <Button variant={params.status === 'paid' ? 'default' : 'outline'} size="sm" asChild>
          <Link href="?status=paid">Paid</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>{t('workDate')}</TableHead>
                <TableHead>{t('workType')}</TableHead>
                <TableHead className="text-right">{t('totalCharge')}</TableHead>
                <TableHead className="text-right">{common('amount')} Paid</TableHead>
                <TableHead>{common('status')}</TableHead>
                <TableHead>{common('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders && workOrders.length > 0 ? (
                workOrders.map((work: any) => (
                  <TableRow key={work.id}>
                    <TableCell>
                      <Link
                        href={`clients/${work.client?.id}`}
                        className="font-medium hover:underline"
                      >
                        {work.client?.name}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(work.work_date).toLocaleDateString()}</TableCell>
                    <TableCell>{work.work_type.replace(/_/g, ' ')}</TableCell>
                    <TableCell className="text-right font-medium">${work.total_charge}</TableCell>
                    <TableCell className="text-right">${work.amount_paid}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(work.status)}>{work.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`work/${work.id}`}>{common('view')}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
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
