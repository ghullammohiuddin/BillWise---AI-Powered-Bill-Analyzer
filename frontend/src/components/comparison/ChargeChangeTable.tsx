import { cn } from '@/lib/utils';
import { formatPKR } from '@/lib/utils/formatCurrency';
import { PercentageChangeIndicator } from '@/components/shared/PercentageChangeIndicator';
import type { ChargeChange } from '@/lib/types/comparison';

interface ChargeChangeTableProps {
  chargeChanges: ChargeChange[];
  largestContributor: string;
}

// Section 3.5: "never calculate or reformat math yourself, only display what
// is given" — every number here is rendered straight from `chargeChanges`,
// no client-side arithmetic.
export function ChargeChangeTable({
  chargeChanges,
  largestContributor,
}: ChargeChangeTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-left">
        <thead className="bg-canvas text-label-sm uppercase tracking-wide text-ink-muted">
          <tr>
            <th className="px-space-sm py-space-xs">Charge</th>
            <th className="px-space-sm py-space-xs text-right">Previous</th>
            <th className="px-space-sm py-space-xs text-right">Current</th>
            <th className="px-space-sm py-space-xs text-right">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {chargeChanges.map((charge) => (
            <tr
              key={charge.name}
              className={cn(
                charge.name === largestContributor && 'bg-alert-tint/40',
              )}
            >
              <td className="px-space-sm py-space-sm text-body-md text-ink">
                {charge.name}
                {charge.name === largestContributor && (
                  <span className="ml-space-xs text-label-sm text-alert">
                    ★ Largest contributor
                  </span>
                )}
              </td>
              <td className="px-space-sm py-space-sm text-right text-body-md tabular-nums text-ink-muted">
                {formatPKR(charge.previous)}
              </td>
              <td className="px-space-sm py-space-sm text-right text-body-md tabular-nums text-ink">
                {formatPKR(charge.current)}
              </td>
              <td className="px-space-sm py-space-sm text-right">
                <PercentageChangeIndicator
                  difference={charge.difference}
                  percent={charge.percentage}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
