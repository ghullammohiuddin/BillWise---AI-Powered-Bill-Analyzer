import { apiFetch } from './client';
import type {
  Bill,
  BillsListResponse,
  CreateBillRequest,
  ExtractionResult,
} from '@/lib/types/bill';

/** GET /bills?limit&offset (Section 5) — powers the Dashboard (3.3) and the
 *  Historical Trend chart (3.8), which reuses this same list. */
export function getBills(params: { limit?: number; offset?: number } = {}) {
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;
  return apiFetch<BillsListResponse>(`/bills?limit=${limit}&offset=${offset}`);
}

/** GET /bills/:id (Section 5) — powers the Bill Detail page (3.4). */
export function getBillById(id: string) {
  return apiFetch<Bill>(`/bills/${id}`);
}

/** POST /bills/extract (Section 5), step 2 of the upload flow. */
export function extractBill(imageUrl: string) {
  return apiFetch<{ extracted: ExtractionResult }>('/bills/extract', {
    method: 'POST',
    body: JSON.stringify({ imageUrl }),
  });
}

/** POST /bills (Section 5), step 3 — persists the (possibly corrected)
 *  extracted fields plus imageUrl, returns the full saved record. */
export function createBill(payload: CreateBillRequest) {
  return apiFetch<Bill>('/bills', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** DELETE /bills/:id (Section 5). Not wired to any screen yet — the
 *  required screens (3.1–3.8) don't call for a delete action anywhere. */
export function deleteBill(id: string) {
  return apiFetch<{ id: string; deleted: boolean }>(`/bills/${id}`, {
    method: 'DELETE',
  });
}
