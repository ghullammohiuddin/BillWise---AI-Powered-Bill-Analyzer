import { PercentageChangeIndicator } from '@/components/shared/PercentageChangeIndicator';
import type {
  ComparisonBillSummary,
  ComparisonMetrics,
} from '@/lib/types/comparison';

interface UnitComparisonCardProps {
  currentBill: ComparisonBillSummary;
  previousBill: ComparisonBillSummary;
  comparison: ComparisonMetrics;
}

export function UnitComparisonCard({
  currentBill,
  previousBill,
  comparison,
}: UnitComparisonCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-space-md">
      <p className="text-label-md uppercase tracking-wide text-ink-muted">
        Units consumed
      </p>
      <div className="mt-space-xs flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-baseline gap-space-sm">
          <span className="text-body-md tabular-nums text-ink-muted">
            {previousBill.units.toLocaleString('en-US')} kWh
          </span>
          <span className="text-ink-muted">→</span>
          <span className="font-display text-headline-sm tabular-nums text-ink">
            {currentBill.units.toLocaleString('en-US')} kWh
          </span>
        </div>
        <PercentageChangeIndicator
          difference={comparison.unitDifference}
          percent={comparison.unitIncreasePercent}
        />
      </div>
    </div>
  );
}
