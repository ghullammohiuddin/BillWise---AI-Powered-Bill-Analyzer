'use client';

import { useBills } from '@/hooks/useBills';
import { HistoricalTrendChart } from '@/components/charts/HistoricalTrendChart';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';

export default function TrendsPage() {
  const { bills, isLoading, error, refetch } = useBills();

  return (
    <main className="mx-auto max-w-2xl px-margin-sm py-space-xl">
      <h1 className="font-display text-headline-lg-mobile text-ink md:text-headline-lg">
        Historical trend
      </h1>

      <div className="mt-space-lg">
        {isLoading && <LoadingState label="Loading trend" rows={1} />}

        {!isLoading && error && (
          <ErrorState
            message="Couldn't load your bill history."
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && bills.length < 2 && (
          <p className="rounded-lg border border-dashed border-border bg-surface p-space-lg text-center text-body-md text-ink-muted">
            Upload at least two bills to see a trend.
          </p>
        )}

        {!isLoading && !error && bills.length >= 2 && (
          <HistoricalTrendChart bills={bills} />
        )}
      </div>
    </main>
  );
}
