'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useBillDetail } from '@/hooks/useBillDetail';
import { BillFieldGroup } from '@/components/bill-detail/BillFieldGroup';
import { BillImagePreview } from '@/components/bill-detail/BillImagePreview';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { formatBillingMonth, formatDueDate } from '@/lib/utils/formatDate';

function displayValue(
  value: string | number | null | undefined,
  fallback = 'Not detected',
): string {
  if (value === null || value === undefined || value === '') return fallback;
  return typeof value === 'number' ? value.toLocaleString('en-US') : value;
}

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { bill, isLoading, error, refetch } = useBillDetail(id);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-margin-sm py-space-xl">
        <LoadingState label="Loading bill" rows={5} />
      </main>
    );
  }

  if (error || !bill) {
    return (
      <main className="mx-auto max-w-2xl px-margin-sm py-space-xl">
        <ErrorState message="We couldn't load this bill." onRetry={refetch} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-space-lg px-margin-sm py-space-xl">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral">{bill.provider}</Badge>
          <span className="text-body-sm text-ink-muted">
            {formatBillingMonth(bill.billingMonth)}
          </span>
        </div>
        <div className="mt-space-xs">
          <CurrencyDisplay amount={bill.totalAmount} size="lg" />
        </div>
      </div>

      <BillImagePreview
        imageUrl={bill.imageUrl}
        alt={`${bill.provider} bill for ${formatBillingMonth(bill.billingMonth)}`}
      />

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        {/* Section 3.4 says "link to comparison if a previous bill exists" —
            the bill detail response has no such flag, and calling the
            comparison endpoint just to decide would duplicate the fetch that
            page already makes. So this link always shows; the comparison
            page itself renders the honest "no previous bill" state (Section
            5's documented 409 case) when there's nothing to compare. */}
        <Link
          href={`/bills/${bill.id}/comparison`}
          className={buttonVariants({ variant: 'primary' })}
        >
          View comparison &amp; AI insights
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href={`/bills/${bill.id}/ask`}
          className={buttonVariants({ variant: 'secondary' })}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Ask about this bill
        </Link>
      </div>

      <BillFieldGroup
        title="Usage"
        fields={[
          {
            label: 'Meter number',
            value: displayValue(bill.meterNumber),
            isMissing: !bill.meterNumber,
          },
          {
            label: 'Previous reading',
            value: displayValue(bill.previousReading),
          },
          {
            label: 'Current reading',
            value: displayValue(bill.currentReading),
          },
          {
            label: 'Units consumed',
            value: `${bill.units.toLocaleString('en-US')} kWh`,
          },
        ]}
      />

      <BillFieldGroup
        title="Charges"
        fields={[
          { label: 'Energy charges', value: displayValue(bill.energyCharges) },
          { label: 'Fixed charges', value: displayValue(bill.fixedCharges) },
          { label: 'Surcharges', value: displayValue(bill.surcharges) },
          { label: 'Arrears', value: displayValue(bill.arrears) },
        ]}
      />

      <BillFieldGroup
        title="Taxes & Adjustments"
        fields={[
          { label: 'Taxes', value: displayValue(bill.taxes) },
          { label: 'Adjustments', value: displayValue(bill.adjustments) },
        ]}
      />

      <BillFieldGroup
        title="Metadata"
        fields={[
          {
            label: 'Reference number',
            value: displayValue(bill.referenceNumber),
            isMissing: !bill.referenceNumber,
          },
          { label: 'Due date', value: formatDueDate(bill.dueDate) },
          { label: 'Currency', value: bill.currency },
        ]}
      />
    </main>
  );
}
