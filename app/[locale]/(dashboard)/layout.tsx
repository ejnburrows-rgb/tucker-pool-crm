import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { OverdueAlert } from '@/components/overdue-alert';
import { ErrorBoundary } from '@/components/error-boundary';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col text-slate-900 dark:text-slate-100">
        <Header />
        <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
          <Sidebar />
          <main className="flex-1 pb-10">{children}</main>
        </div>
        <Footer />
        <Toaster richColors closeButton position="top-right" />
        <OverdueAlert />
      </div>
    </ErrorBoundary>
  );
}
