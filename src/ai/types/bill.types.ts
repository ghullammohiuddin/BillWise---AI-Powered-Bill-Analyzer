// src/ai/types/bill.types.ts

export const NUMERIC_BILL_FIELDS = [
  'previousReading',
  'currentReading',
  'units',
  'energyCharges',
  'fixedCharges',
  'taxes',
  'surcharges',
  'adjustments',
  'arrears',
  'totalAmount',
] as const;

export type NumericBillField = (typeof NUMERIC_BILL_FIELDS)[number];

export interface BillExtractionResult {
  provider: string | null;
  billingMonth: string | null;
  referenceNumber: string | null;
  meterNumber: string | null;
  previousReading: number | null;
  currentReading: number | null;
  units: number | null;
  energyCharges: number | null;
  fixedCharges: number | null;
  taxes: number | null;
  surcharges: number | null;
  adjustments: number | null;
  arrears: number | null;
  totalAmount: number | null;
  dueDate: string | null;
  currency: 'PKR';
  missingFields: string[];
  confidence: number;
  _reconciliationWarning?: boolean;
}

export interface ChargeChange {
  name: string;
  previous: number;
  current: number;
  difference: number;
  percentage: number;
}

export interface ExplanationInput {
  currentUnits: number;
  previousUnits: number;
  unitDifference: number;
  unitIncreasePercent: number;
  currentBill: number;
  previousBill: number;
  billDifference: number;
  billIncreasePercent: number;
  chargeChanges: ChargeChange[];
  largestContributor: string;
  hasLowConfidenceFields?: boolean;
}

export interface QAContext {
  question: string;
  currentBill: BillExtractionResult;
  historicalBills?: BillExtractionResult[];
  backendCalculations?: Record<string, unknown>;
}

export interface QAResult {
  answer: string;
  isGrounded: boolean;
}