'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, Bell, PlusCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MobileNav } from './mobile-nav';
import { LanguageToggle } from './language-toggle';

interface HeaderProps {
  onQuickAdd?: () => void;
}

export function Header({ onQuickAdd }: HeaderProps) {
  const t = useTranslations('common');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'tucker_auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push(`/${locale}/login`);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="px-5 py-4 text-left">
                <SheetTitle>{t('appName')}</SheetTitle>
              </SheetHeader>
              <Separator />
              <MobileNav />
            </SheetContent>
          </Sheet>
          <div className="flex flex-col">
            <Link href={`/${locale}/dashboard`} className="text-lg font-semibold tracking-tight">
              {t('appName')}
            </Link>
            <span className="text-xs text-muted-foreground">Miami · since 1990</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden items-center gap-1 md:flex"
            onClick={onQuickAdd}
            disabled={!onQuickAdd}
          >
            <Link href={`/${locale}/clients/new`}>
              <PlusCircle className="h-4 w-4" />
              {nav('clients')}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href={`/${locale}/clients/new`}>
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">{nav('clients')}</span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="mx-2 hidden h-6 md:block" />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <LanguageToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
