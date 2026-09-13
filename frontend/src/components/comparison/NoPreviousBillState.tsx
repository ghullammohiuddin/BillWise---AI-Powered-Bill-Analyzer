import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { formatBillingMonth } from '@/lib/utils/formatDate';
import type { ComparisonBillSummary } from '@/lib/types/comparison';

interface NoPreviousBillStateProps {
  currentBill: ComparisonBillSummary;
  message: string;
}

// Section 5: the backend returns 409 with previousBill: null when there's
// nothing to compare against yet — a documented, expected state, rendered
// here as its own distinct UI rather than routed through ErrorState.
export function NoPreviousBillState({
  currentBill,
  message,
}: NoPreviousBillStateProps) {
  return (
    <div className="flex flex-col items-center gap-space-sm rounded-lg border border-dashed border-border bg-surface p-space-xl text-center">
      <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
      <p className="text-body-sm text-ink-muted">
        {formatBillingMonth(currentBill.billingMonth)}
      </p>
      <CurrencyDisplay amount={currentBill.totalAmount} size="md" />
      <p className="text-body-md text-ink-muted">{message}</p>
      <Link href="/upload" className={buttonVariants({ variant: 'primary' })}>
        Upload another bill to see a comparison
      </Link>
    </div>
  );
}
