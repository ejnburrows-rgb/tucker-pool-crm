'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  className,
  previousLabel,
  nextLabel,
}: PaginationControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create links for prev/next pages
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-8", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
            {previousLabel}
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
            {previousLabel}
          </span>
        )}
      </Button>

      <div className="text-sm text-muted-foreground font-medium">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)}>
            {nextLabel}
            <span className="sr-only">Next Page</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            {nextLabel}
            <span className="sr-only">Next Page</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
