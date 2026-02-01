import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';

export default async function SchedulePage() {
  const t = await getTranslations('schedule');
  const common = await getTranslations('common');
  const supabase = await createClient();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const { data: appointments } = await supabase
    .from('schedule')
    .select(
      'id, scheduled_date, scheduled_time, status, client:clients(id, name, city)'
    )
    .gte('scheduled_date', weekStart.toISOString().split('T')[0])
    .lte('scheduled_date', weekEnd.toISOString().split('T')[0])
    .order('scheduled_date')
    .order('scheduled_time');

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'rescheduled':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments?.filter((a: any) => a.scheduled_date === dateStr) || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('thisWeek')}</p>
        </div>
        <Button asChild>
          <Link href="schedule/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addAppointment')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {weekDays.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

          return (
            <Card key={day.toISOString()} className={isToday ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {format(day, 'EEE, MMM d')}
                  {isToday && <Badge className="ml-auto">{t('today')}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayAppointments.length > 0 ? (
                  dayAppointments.map((appt: any) => (
                    <Link
                      key={appt.id}
                      href={`schedule/${appt.id}`}
                      className="block rounded-lg border p-2 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm">{appt.client?.name}</p>
                        <Badge variant={getStatusVariant(appt.status)} className="text-xs">
                          {appt.status}
                        </Badge>
                      </div>
                      {appt.scheduled_time && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {appt.scheduled_time}
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {appt.client?.city}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No appointments
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
