'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const NAV_ITEMS = [
  { href: '', key: 'dashboard' },
  { href: '/clients', key: 'clients' },
  { href: '/payments', key: 'payments' },
  { href: '/work', key: 'work' },
  { href: '/schedule', key: 'schedule' },
  { href: '/overdue', key: 'overdue' },
  { href: '/reports', key: 'reports' },
  { href: '/settings', key: 'settings' },
  { href: '/faq', key: 'faq' },
];

export function MobileNav() {
  const pathname = usePathname();
  const nav = useTranslations('nav');
  const locale = useLocale();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {NAV_ITEMS.map((item, index) => {
        const fullHref = `/${locale}${item.href}`;
        const isActive = pathname === fullHref || (item.href && pathname?.startsWith(fullHref));
        return (
          <div key={item.key}>
            <Link
              href={fullHref}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100'
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
