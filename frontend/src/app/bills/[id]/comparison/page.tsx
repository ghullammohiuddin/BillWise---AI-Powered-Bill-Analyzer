'use client';

import { useParams } from 'next/navigation';
import { useComparison } from '@/hooks/useComparison';
import { ComparisonHeadline } from '@/components/comparison/ComparisonHeadline';
import { UnitComparisonCard } from '@/components/comparison/UnitComparisonCard';
import { ChargeChangeTable } from '@/components/comparison/ChargeChangeTable';
import { LargestContributorBadge } from '@/components/comparison/LargestContributorBadge';
import { NoPreviousBillState } from '@/components/comparison/NoPreviousBillState';
import { AIExplanationPanel } from '@/components/explanation/AIExplanationPanel';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';

// Section 3.5: "this is the most important screen" — the hero moment of the
// whole app.
export default function ComparisonPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useComparison(id);

  return (
    <main className="mx-auto max-w-2xl space-y-space-lg px-margin-sm py-space-xl">
      <h1 className="font-display text-headline-lg-mobile text-ink md:text-headline-lg">
        Bill comparison
      </h1>

      {isLoading && <LoadingState label="Loading comparison" rows={4} />}

      {!isLoading && error && (
        <ErrorState
          message="We couldn't load the comparison for this bill."
          onRetry={refetch}
        />
      )}

      {!isLoading && !error && data?.status === 'no-previous-bill' && (
        <NoPreviousBillState
          currentBill={data.currentBill}
          message={data.message}
        />
      )}

      {!isLoading && !error && data?.status === 'ok' && (
        <>
          <ComparisonHeadline
            currentBill={data.currentBill}
            previousBill={data.previousBill}
            comparison={data.comparison}
          />
          <UnitComparisonCard
            currentBill={data.currentBill}
            previousBill={data.previousBill}
            comparison={data.comparison}
          />
          <div>
            <div className="mb-space-sm flex flex-wrap items-center justify-between gap-space-sm">
              <h2 className="font-display text-headline-md text-ink">
                Charge-by-charge breakdown
              </h2>
              <LargestContributorBadge name={data.largestContributor} />
            </div>
            <ChargeChangeTable
              chargeChanges={data.chargeChanges}
              largestContributor={data.largestContributor}
            />
          </div>
          <AIExplanationPanel explanation={data.explanation} />
        </>
      )}
    </main>
  );
}
