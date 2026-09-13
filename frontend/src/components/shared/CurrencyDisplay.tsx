import { cn } from '@/lib/utils';
import { formatPKR } from '@/lib/utils/formatCurrency';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<CurrencyDisplayProps['size']>, string> = {
  sm: 'text-headline-sm',
  md: 'text-metric-currency-mobile md:text-metric-currency',
  lg: 'text-display-lg-mobile md:text-display-lg',
};

export function CurrencyDisplay({
  amount,
  className,
  size = 'md',
}: CurrencyDisplayProps) {
  return (
    <span
      className={cn(
        'font-display tabular-nums text-ink',
        sizeClasses[size],
        className,
      )}
    >
      {formatPKR(amount)}
    </span>
  );
}
