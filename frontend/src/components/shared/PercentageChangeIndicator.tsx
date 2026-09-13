import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PercentageChangeIndicatorProps {
  /** Signed — determines direction. Positive = increase, negative = decrease. */
  difference: number;
  /** Magnitude to display; shown as an absolute value regardless of sign. */
  percent: number;
  className?: string;
}

// Accessibility principle 8: never rely on color alone — every state pairs
// an icon with the color.
export function PercentageChangeIndicator({
  difference,
  percent,
  className,
}: PercentageChangeIndicatorProps) {
  const isFlat = difference === 0;
  const isIncrease = difference > 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-label-md tabular-nums',
        isFlat
          ? 'bg-border/40 text-ink-muted'
          : isIncrease
            ? 'bg-alert-tint text-alert'
            : 'bg-mint-tint text-mint',
        className,
      )}
    >
      {isFlat ? (
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      ) : isIncrease ? (
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {Math.abs(percent).toFixed(1)}%
    </span>
  );
}
