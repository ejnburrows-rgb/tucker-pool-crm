'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { clientSchema, type ClientFormData } from '@/lib/validations/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { SERVICE_DAYS, POOL_TYPES, LANGUAGES } from '@/lib/constants';

export default function NewClientPage() {
  const t = useTranslations('clients');
  const common = useTranslations('common');
  const serviceDays = useTranslations('serviceDays');
  const poolTypes = useTranslations('poolTypes');
  const languages = useTranslations('languages');
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      gate_code: '',
      service_day: 'monday',
      monthly_rate: 0,
      pool_type: 'chlorine',
      language: 'en',
      is_active: true,
      notes: '',
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || common('errors.serverError'));
        return;
      }

      toast.success(common('success.saved'));
      router.push(`/${locale}/clients`);
      router.refresh();
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error(common('errors.serverError'));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('addClient')}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Last, First" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common('phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder="305-555-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('language')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {languages(lang)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{common('address')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('city')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gate_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gateCode')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('serviceInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="service_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('serviceDay')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_DAYS.map((day) => (
                          <SelectItem key={day} value={day}>
                            {serviceDays(day)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthly_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('monthlyRate')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pool_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('poolType')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POOL_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {poolTypes(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{common('notes')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {common('save')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {common('cancel')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
