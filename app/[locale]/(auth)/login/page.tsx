'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Legacy support hint for users typing the old username
    if (email.trim().toUpperCase() === 'EJN') {
       setError('We have updated our security. Please use email: rodeanddavid@yahoo.com');
       setLoading(false);
       return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();

      let { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error?.message?.toLowerCase().includes('invalid login credentials') && normalizedEmail === 'rodeanddavid@yahoo.com') {
        const bootstrapResponse = await fetch('/api/auth/ensure-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        if (bootstrapResponse.ok) {
          const retry = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });
          error = retry.error;
        }
      }

      if (error) {
        setError(error.message);
      } else {
        // Clear legacy cookie if it exists
        document.cookie = 'tucker_auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-900">Tucker Pool Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">CRM Login</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            type="text"
            placeholder="rodeanddavid@yahoo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t('password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('login')}
        </Button>
      </form>
    </div>
  );
}
