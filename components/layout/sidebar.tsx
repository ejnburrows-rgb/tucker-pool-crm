'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutGrid,
  Users,
  CreditCard,
  Hammer,
  Calendar,
  AlertTriangle,
  BarChart,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '', icon: LayoutGrid, key: 'dashboard' },
  { href: '/clients', icon: Users, key: 'clients' },
  { href: '/payments', icon: CreditCard, key: 'payments' },
  { href: '/work', icon: Hammer, key: 'work' },
  { href: '/schedule', icon: Calendar, key: 'schedule' },
  { href: '/overdue', icon: AlertTriangle, key: 'overdue' },
  { href: '/reports', icon: BarChart, key: 'reports' },
  { href: '/settings', icon: Settings, key: 'settings' },
];

export function Sidebar() {
  const nav = useTranslations('nav');
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <aside className="hidden w-60 flex-col border-r border-border/60 bg-white/70 px-4 py-6 shadow-sm backdrop-blur dark:bg-background/80 md:flex">
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Navigate</h2>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
          const fullHref = `/${locale}${href}`;
          const isActive = pathname === fullHref || (href && pathname?.startsWith(fullHref));
          return (
            <Link
              key={key}
              href={fullHref}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-emerald-100 text-emerald-900 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-100'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{nav(key)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-xs text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
        <p className="font-semibold">Water Quality Tip</p>
        <p>Test chlorine and pH levels before adding chemicals on-site.</p>
      </div>
    </aside>
  );
}
