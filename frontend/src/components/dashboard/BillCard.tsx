import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { PercentageChangeIndicator } from '@/components/shared/PercentageChangeIndicator';
import { formatBillingMonth } from '@/lib/utils/formatDate';
import type { BillListItem } from '@/lib/types/bill';

interface BillCardProps {
  bill: BillListItem & {
    displayDelta: { amount: number; percent: number } | null;
  };
}

export function BillCard({ bill }: BillCardProps) {
  return (
    <Link
      href={`/bills/${bill.id}`}
      className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    >
      <Card className="flex items-center gap-space-md p-space-md transition-shadow hover:shadow-hover">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-canvas">
          <Image
            src={bill.imageUrl}
            alt={`${bill.provider} bill for ${formatBillingMonth(bill.billingMonth)}`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="neutral">{bill.provider}</Badge>
            <span className="text-body-sm text-ink-muted">
              {formatBillingMonth(bill.billingMonth)}
            </span>
          </div>
          <div className="mt-1">
            <CurrencyDisplay amount={bill.totalAmount} size="sm" />
          </div>
          <p className="text-body-sm text-ink-muted tabular-nums">
            {bill.units.toLocaleString('en-US')} kWh
          </p>
        </div>

        <div className="shrink-0">
          {bill.displayDelta ? (
            <PercentageChangeIndicator
              difference={bill.displayDelta.amount}
              percent={bill.displayDelta.percent}
            />
          ) : (
            // No earlier bill on this page to compare against — an explicit
            // label, never a bare "0%" that could pass as a real reading.
            <span className="text-body-sm text-ink-muted">First bill</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
