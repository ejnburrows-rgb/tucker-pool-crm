'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const NAV_ITEMS = [
  { href: '/dashboard', key: 'dashboard' },
  { href: '/clients', key: 'clients' },
  { href: '/payments', key: 'payments' },
  { href: '/work', key: 'work' },
  { href: '/schedule', key: 'schedule' },
  { href: '/overdue', key: 'overdue' },
  { href: '/reports', key: 'reports' },
  { href: '/settings', key: 'settings' },
];

export function MobileNav() {
  const pathname = usePathname();
  const nav = useTranslations('nav');

  return (
    <nav className="flex flex-col gap-1 p-4">
      {NAV_ITEMS.map((item, index) => {
        const isActive = pathname?.includes(item.href);
        return (
          <div key={item.key}>
            <Link
              href={item.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {nav(item.key)}
            </Link>
            {index === 0 && <Separator className="my-2" />}
          </div>
        );
      })}
    </nav>
  );
}
