'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertTriangle, X, ExternalLink, Phone } from 'lucide-react';

interface OverduePayment {
  id: string;
  client_id: string;
  client_name: string;
  client_phone: string;
  amount_due: number;
  due_date: string;
  days_overdue: number;
}

export function OverdueAlert() {
  const t = useTranslations('overdue');
  const locale = useLocale();
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOverdue = async () => {
      if (dismissed) return;
      
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      const { data: payments } = await (supabase
        .from('payments') as any)
        .select(`
          id,
          client_id,
          amount_due,
          amount_paid,
          due_date,
          clients (name, phone)
        `)
        .lt('due_date', today)
        .or('amount_paid.is.null,amount_paid.lt.amount_due');

      if (payments && payments.length > 0) {
        const overdue: OverduePayment[] = payments
          .filter((p: any) => {
            const amountPaid = p.amount_paid || 0;
            return amountPaid < p.amount_due;
          })
          .map((p: any) => {
            const dueDate = new Date(p.due_date);
            const now = new Date();
            const diffTime = now.getTime() - dueDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
              id: p.id,
              client_id: p.client_id,
              client_name: p.clients?.name || 'Unknown',
              client_phone: p.clients?.phone || '',
              amount_due: p.amount_due - (p.amount_paid || 0),
              due_date: p.due_date,
              days_overdue: diffDays,
            };
          });

        if (overdue.length > 0) {
          setOverduePayments(overdue);
          setIsOpen(true);
        }
      }
    };

    const sessionKey = 'overdue_alert_shown';
    const shown = sessionStorage.getItem(sessionKey);
    
    if (!shown) {
      checkOverdue();
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, [dismissed]);

  const handleDismiss = () => {
    setIsOpen(false);
    setDismissed(true);
  };

  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount_due, 0);

  if (overduePayments.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            {t('title')} ({overduePayments.length})
          </DialogTitle>
          <DialogDescription>
            {t('totalOverdue')}: <span className="font-bold text-red-600">${totalOverdue.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-64 overflow-y-auto space-y-3">
          {overduePayments.slice(0, 10).map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div>
                <p className="font-semibold">{payment.client_name}</p>
                <p className="text-sm text-muted-foreground">
                  ${payment.amount_due.toFixed(2)} · {payment.days_overdue} {t('daysPastDue')}
                </p>
              </div>
              <div className="flex gap-2">
                {payment.client_phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${payment.client_phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
          {overduePayments.length > 10 && (
            <p className="text-sm text-center text-muted-foreground">
              +{overduePayments.length - 10} more overdue payments
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button asChild className="flex-1">
            <Link href={`/${locale}/overdue`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('title')}
            </Link>
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            <X className="mr-2 h-4 w-4" />
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
