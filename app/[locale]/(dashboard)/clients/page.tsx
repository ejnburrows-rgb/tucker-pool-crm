import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusCircle, Phone, MapPin } from 'lucide-react';
import type { Client } from '@/types/database';

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; active?: string }>;
}) {
  const t = await getTranslations('clients');
  const common = await getTranslations('common');
  const serviceDays = await getTranslations('serviceDays');
  const supabase = createClient();
  const params = await searchParams;

  let query = (supabase.from('clients') as any).select('*').order('name');

  if (params.active === 'true') {
    query = query.eq('is_active', true);
  }

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`);
  }

  const { data: clients } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('allClients')}</p>
        </div>
        <Button asChild>
          <Link href="clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addClient')}
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <form className="flex-1">
          <Input name="q" placeholder={common('search')} defaultValue={params.q} />
        </form>
        <Button variant="outline" asChild>
          <Link href="?active=true">{t('activeOnly')}</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="?">{t('allClients')}</Link>
        </Button>
      </div>

      {clients && clients.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client: Client) => (
            <Link key={client.id} href={`clients/${client.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <Badge variant={client.is_active ? 'default' : 'secondary'}>
                      {client.is_active ? t('active') : t('inactive')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <a href={`tel:${client.phone}`} className="hover:underline">
                      {client.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{client.city}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-medium text-emerald-600">${client.monthly_rate}/mo</span>
                    <span>{serviceDays(client.service_day)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {common('noResults')}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
