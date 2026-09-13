export interface ComparisonBillSummary {
  id: string;
  billingMonth: string;
  totalAmount: number;
  units: number;
}

export interface ChargeChange {
  name: string;
  previous: number;
  current: number;
  difference: number;
  percentage: number;
}

export interface ComparisonMetrics {
  billDifference: number;
  billIncreasePercent: number;
  unitDifference: number;
  unitIncreasePercent: number;
}

export interface ComparisonSuccess {
  /** Client-side discriminant only — not part of the API response. Lets
   *  components exhaustively switch on the union below. */
  status: 'ok';
  currentBill: ComparisonBillSummary;
  previousBill: ComparisonBillSummary;
  comparison: ComparisonMetrics;
  chargeChanges: ChargeChange[];
  largestContributor: string;
  explanation: string;
}

export interface ComparisonNoPrevious {
  status: 'no-previous-bill';
  currentBill: ComparisonBillSummary;
  previousBill: null;
  message: string;
}

/** GET /bills/:id/comparison (Section 5) — success shape, or the documented
 *  409 "no previous bill" shape, which is an expected state, not an error. */
export type ComparisonResult = ComparisonSuccess | ComparisonNoPrevious;
