import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 pb-10">{children}</main>
      </div>
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}
