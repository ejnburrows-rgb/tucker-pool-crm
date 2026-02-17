import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusCircle, Phone, MapPin, Upload, Search, SearchX, Users, UserPlus } from 'lucide-react';
import type { Client } from '@/types/database';
import { PaginationControls } from '@/components/ui/pagination-controls';

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; active?: string; page?: string }>;
}) {
  const t = await getTranslations('clients');
  const common = await getTranslations('common');
  const serviceDays = await getTranslations('serviceDays');
  const supabase = await createClient();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('clients') as any)
    .select('*', { count: 'exact' })
    .order('name');

  if (params.active === 'true') {
    query = query.eq('is_active', true);
  }

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`);
  }

  // Apply pagination
  query = query.range(from, to);

  const { data: clients, count } = await query;
  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('allClients')}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="clients/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('addClient')}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="clients/import">
              <Upload className="mr-2 h-4 w-4" />
              {common('import')}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <form className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder={common('search')}
            defaultValue={params.q}
            className="pl-9"
            aria-label={common('search')}
          />
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
                    <span className="font-medium text-blue-700">${client.monthly_rate}/mo</span>
                    <span>{serviceDays(client.service_day)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : params.q ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <SearchX className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">{common('noResults')}</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="clients">{common('clearSearch')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">{t('noClients')}</p>
            <p className="text-sm text-muted-foreground/80">{t('startAdding')}</p>
            <Button asChild className="mt-4">
              <Link href="clients/new">
                <UserPlus className="mr-2 h-4 w-4" />
                {t('addClient')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          previousLabel={common('back')} // Using 'Back' as fallback for Previous
          nextLabel="Next" // Hardcoded for now as 'Next' key is missing
        />
      )}
    </div>
  );
}
