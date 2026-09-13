import { API_BASE_URL, safeParseError } from './client';
import { ApiError } from '@/lib/types/api-error';
import type { ComparisonResult } from '@/lib/types/comparison';

/**
 * GET /bills/:id/comparison (Section 5) — powers the Comparison screen (3.5)
 * and the AI Explanation panel (3.6), whose text is bundled in this response.
 *
 * Handled with a bespoke fetch rather than the shared apiFetch: the "no
 * previous bill" case is a 409 with its own distinct, non-error body shape
 * (`{ currentBill, previousBill: null, message }`), not the standard error
 * shape. It must be special-cased here, before the generic error path,
 * rather than thrown as an error — Section 5 is explicit that it's a valid,
 * expected state.
 */
export async function getComparison(billId: string): Promise<ComparisonResult> {
  const path = `/bills/${billId}/comparison`;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (res.status === 409) {
    const body = await res.json();
    return {
      status: 'no-previous-bill',
      currentBill: body.currentBill,
      previousBill: null,
      message: body.message,
    };
  }

  if (!res.ok) {
    throw new ApiError(await safeParseError(res, path));
  }

  const body = await res.json();
  return { status: 'ok', ...body };
}
