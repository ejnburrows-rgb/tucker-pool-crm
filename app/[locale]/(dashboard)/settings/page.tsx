'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Download, Upload, Trash2, Shield } from 'lucide-react';
import { backupSystem } from '@/lib/backup-system';
import { validateImportData } from '@/lib/validations/import';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const common = useTranslations('common');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    business_name: 'R&D Pool Services',
    business_phone: '305-555-0000',
    business_email: 'rodeanddavid@yahoo.com',
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
              business_email: data.settings.business_email || 'rodeanddavid@yahoo.com',
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

  const handleExportData = async () => {
    try {
      const supabase = createClient();
      const [clientsRes, paymentsRes, workRes, scheduleRes] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('additional_work').select('*'),
        supabase.from('schedule').select('*'),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        clients: clientsRes.data || [],
        payments: paymentsRes.data || [],
        additionalWork: workRes.data || [],
        schedule: scheduleRes.data || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tucker-pool-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // Also save to local backup system
      await backupSystem.save(exportData);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const handleLocalBackup = async () => {
    try {
      const supabase = createClient();
      const [clientsRes, paymentsRes, workRes, scheduleRes] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('additional_work').select('*'),
        supabase.from('schedule').select('*'),
      ]);

      const backupData = {
        exportDate: new Date().toISOString(),
        clients: clientsRes.data || [],
        payments: paymentsRes.data || [],
        additionalWork: workRes.data || [],
        schedule: scheduleRes.data || [],
      };

      const result = await backupSystem.save(backupData);
      if (result.primary || result.indexed) {
        toast.success('Local backup saved successfully!');
      } else {
        toast.error('Failed to save local backup');
      }
    } catch (error) {
      console.error('Local backup error:', error);
      toast.error('Failed to create local backup');
    }
  };

  const handleRecoverFromBackup = async () => {
    try {
      const recovered = await backupSystem.recover();
      if (recovered) {
        toast.success(`Backup found from ${recovered.source}. Data available for restore.`);
        console.log('Recovered data:', recovered.data);
      } else {
        toast.info('No local backup found');
      }
    } catch (error) {
      console.error('Recovery error:', error);
      toast.error('Failed to check backup');
    }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rawData = JSON.parse(text);
      
      // Validate import data
      const validation = validateImportData(rawData);
      
      if (!validation.valid) {
        toast.error(`Validation failed: ${validation.errors?.join(', ')}`);
        e.target.value = '';
        return;
      }

      if (validation.warnings && validation.warnings.length > 0) {
        console.warn('Import warnings:', validation.warnings);
      }

      const data = validation.data!;
      const supabase = createClient();

      // Import clients first (they are referenced by other tables)
      if (data.clients.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from('clients').upsert(data.clients as any);
      }

      // Import payments
      if (data.payments.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from('payments').upsert(data.payments as any);
      }

      // Import additional work
      if (data.additionalWork.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from('additional_work').upsert(data.additionalWork as any);
      }

      // Import schedule
      if (data.schedule.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from('schedule').upsert(data.schedule as any);
      }

      toast.success(`Imported: ${validation.stats?.clients} clients, ${validation.stats?.payments} payments, ${validation.stats?.additionalWork} work orders, ${validation.stats?.schedule} schedule entries`);
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Please check the file format.');
    }
    e.target.value = '';
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      return;
    }

    try {
      const supabase = createClient();
      await Promise.all([
        supabase.from('schedule').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('additional_work').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      ]);
      toast.success('All data cleared!');
      window.location.reload();
    } catch (error) {
      console.error('Clear error:', error);
      toast.error('Failed to clear data');
    }
  };

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

      <Card>
        <CardHeader>
          <CardTitle>{t('dataManagement')}</CardTitle>
          <CardDescription>{t('dataManagementDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              {t('exportData')}
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {t('importData')}
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportData}
            />
            <Button variant="destructive" onClick={handleClearData}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('clearData')}
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleLocalBackup}>
              <Shield className="mr-2 h-4 w-4" />
              Save Local Backup
            </Button>
            <Button variant="outline" onClick={handleRecoverFromBackup}>
              <Shield className="mr-2 h-4 w-4" />
              Check Backup Status
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {common('save')}
        </Button>
      </div>
    </div>
  );
}
