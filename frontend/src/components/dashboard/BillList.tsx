import { BillCard } from './BillCard';
import type { BillListItem } from '@/lib/types/bill';

interface BillWithDelta extends BillListItem {
  displayDelta: { amount: number; percent: number } | null;
}

/**
 * GET /bills (Section 5) doesn't return a per-item delta, even though
 * Section 3.3 asks for a "small arrow + %" per bill. This derives a
 * display-only delta from `totalAmount` values already in the list — real
 * backend data, just compared client-side rather than invented. It's
 * separate from, and can drift slightly from, the authoritative
 * `comparison` math on GET /bills/:id/comparison, which always wins if the
 * two ever disagree. Worth asking backend to expose this directly on the
 * list endpoint if pixel-perfect consistency matters.
 */
function withDisplayDeltas(bills: BillListItem[]): BillWithDelta[] {
  const sorted = [...bills].sort((a, b) =>
    a.billingMonth < b.billingMonth ? 1 : -1,
  );

  return sorted.map((bill, index) => {
    const previous = sorted[index + 1];
    if (!previous || previous.totalAmount === 0) {
      return { ...bill, displayDelta: null };
    }
    const amount = bill.totalAmount - previous.totalAmount;
    const percent = (amount / previous.totalAmount) * 100;
    return { ...bill, displayDelta: { amount, percent } };
  });
}

export function BillList({ bills }: { bills: BillListItem[] }) {
  return (
    <div className="space-y-space-sm">
      {withDisplayDeltas(bills).map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </div>
  );
}
