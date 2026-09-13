'use client';

import { useBills } from '@/hooks/useBills';
import { BillList } from '@/components/dashboard/BillList';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';

export default function BillsPage() {
  const { bills, total, isLoading, error, refetch } = useBills();

  return (
    <main className="mx-auto max-w-2xl px-margin-sm py-space-xl">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-headline-lg-mobile text-ink md:text-headline-lg">
          Your bills
        </h1>
        {!isLoading && !error && total > 0 && (
          <span className="text-body-sm text-ink-muted">{total} saved</span>
        )}
      </div>

      <div className="mt-space-lg">
        {isLoading && <LoadingState label="Loading your bills" rows={4} />}

        {!isLoading && error && (
          <ErrorState
            message="We had trouble loading your bills. Your data is safe — just a connection hiccup."
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && (total === 0 || bills.length === 0) && (
          <EmptyState />
        )}

        {!isLoading && !error && bills.length > 0 && <BillList bills={bills} />}
      </div>
    </main>
  );
}
