import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { PercentageChangeIndicator } from '@/components/shared/PercentageChangeIndicator';
import { formatBillingMonth } from '@/lib/utils/formatDate';
import type {
  ComparisonBillSummary,
  ComparisonMetrics,
} from '@/lib/types/comparison';

interface ComparisonHeadlineProps {
  currentBill: ComparisonBillSummary;
  previousBill: ComparisonBillSummary;
  comparison: ComparisonMetrics;
}

// Section 3.5: "big, unmissable headline numbers" — this is the hero moment,
// styled with the largest currency size in the type scale.
export function ComparisonHeadline({
  currentBill,
  previousBill,
  comparison,
}: ComparisonHeadlineProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-space-lg shadow-card">
      <div className="grid grid-cols-2 gap-space-md">
        <div>
          <p className="text-body-sm text-ink-muted">
            {formatBillingMonth(previousBill.billingMonth)}
          </p>
          <CurrencyDisplay amount={previousBill.totalAmount} size="sm" />
        </div>
        <div>
          <p className="text-body-sm text-ink-muted">
            {formatBillingMonth(currentBill.billingMonth)}
          </p>
          <CurrencyDisplay amount={currentBill.totalAmount} size="lg" />
        </div>
      </div>

      <div className="mt-space-md flex items-center gap-space-sm border-t border-border pt-space-md">
        <PercentageChangeIndicator
          difference={comparison.billDifference}
          percent={comparison.billIncreasePercent}
        />
        <span className="text-body-md text-ink-muted">vs last bill</span>
      </div>
    </div>
  );
}
