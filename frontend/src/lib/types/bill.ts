/**
 * Types transcribed directly from 01-frontend-handoff.md, Section 5
 * (API Contract — LOCKED).
 */

export interface BillListItem {
  id: string;
  provider: string;
  billingMonth: string; // "YYYY-MM"
  totalAmount: number;
  units: number;
  imageUrl: string;
  createdAt: string; // ISO 8601
}

export interface BillsListResponse {
  bills: BillListItem[];
  total: number;
}

/** Shared by the extract response, the create request, and GET /bills/:id —
 *  Section 5 says these are all the same underlying schema. */
export interface ExtractedBillFields {
  provider: string;
  billingMonth: string;
  referenceNumber: string | null;
  meterNumber: string | null;
  previousReading: number | null;
  currentReading: number | null;
  units: number;
  energyCharges: number;
  fixedCharges: number;
  taxes: number;
  surcharges: number;
  adjustments: number;
  arrears: number;
  totalAmount: number;
  dueDate: string; // "YYYY-MM-DD"
  currency: string;
}

/** POST /bills/extract response body's `extracted` field. */
export interface ExtractionResult extends ExtractedBillFields {
  missingFields: string[];
  confidence: number; // 0-1
}

/** POST /bills request body. */
export interface CreateBillRequest extends ExtractedBillFields {
  imageUrl: string;
}

/** POST /bills response, and GET /bills/:id response (Section 5). */
export interface Bill extends ExtractedBillFields {
  id: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
