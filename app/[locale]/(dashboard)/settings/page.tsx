'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const common = useTranslations('common');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    business_name: 'Tucker Pool Service',
    business_phone: '305-555-0000',
    business_email: '',
    zelle_address: '',
    default_monthly_rate: 150,
    default_labor_rate: 75,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data?.settings) {
            setSettings({
              business_name: data.settings.business_name || 'Tucker Pool Service',
              business_phone: data.settings.business_phone || '305-555-0000',
              business_email: data.settings.business_email || '',
              zelle_address: data.settings.zelle_address || '',
              default_monthly_rate: data.settings.default_monthly_rate || 150,
              default_labor_rate: data.settings.default_labor_rate || 75,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || common('errors.serverError'));
      } else {
        toast.success(common('success.saved'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(common('errors.serverError'));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('businessInfo')}</CardTitle>
            <CardDescription>{t('businessInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">{t('businessName')}</Label>
              <Input
                id="business_name"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_phone">{t('businessPhone')}</Label>
              <Input
                id="business_phone"
                value={settings.business_phone}
                onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_email">{t('businessEmail')}</Label>
              <Input
                id="business_email"
                type="email"
                value={settings.business_email}
                onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zelle_address">{t('zelleAddress')}</Label>
              <Input
                id="zelle_address"
                value={settings.zelle_address}
                onChange={(e) => setSettings({ ...settings, zelle_address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('defaultRates')}</CardTitle>
            <CardDescription>{t('defaultRatesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default_monthly_rate">{t('defaultMonthlyRate')}</Label>
              <Input
                id="default_monthly_rate"
                type="number"
                value={settings.default_monthly_rate}
                onChange={(e) => setSettings({ ...settings, default_monthly_rate: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_labor_rate">{t('defaultLaborRate')}</Label>
              <Input
                id="default_labor_rate"
                type="number"
                value={settings.default_labor_rate}
                onChange={(e) => setSettings({ ...settings, default_labor_rate: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {common('save')}
        </Button>
      </div>
    </div>
  );
}
