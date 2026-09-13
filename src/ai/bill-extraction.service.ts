// src/ai/bill-extraction.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { GeminiService, GeminiError, ImageMimeType } from './gemini.service';
import {
  BILL_EXTRACTION_PROMPT,
  STRICT_JSON_REMINDER,
} from './prompts/bill-extraction.prompt';
import { BillExtractionResult, NUMERIC_BILL_FIELDS } from './types/bill.types';

export interface ExtractionSuccess {
  ok: true;
  data: BillExtractionResult;
}

export interface ExtractionFailure {
  ok: false;
  code: 'MALFORMED_JSON' | 'API_FAILURE';
  message: string;
}

export type ExtractionResult = ExtractionSuccess | ExtractionFailure;

const RECONCILIATION_TOLERANCE = 0.12;
const MIN_FIELDS_FOR_RECONCILIATION = 3;

@Injectable()
export class BillExtractionService {
  private readonly logger = new Logger(BillExtractionService.name);

  constructor(private readonly gemini: GeminiService) {}

  async extractFromImage(
    imageBase64: string,
    mimeType: ImageMimeType,
  ): Promise<ExtractionResult> {
    let rawResponse: string;

    try {
      rawResponse = await this.gemini.generateFromImage(
        BILL_EXTRACTION_PROMPT,
        imageBase64,
        mimeType,
      );
    } catch (err) {
      return {
        ok: false,
        code: 'API_FAILURE',
        message: err instanceof GeminiError ? err.message : 'Gemini API call failed',
      };
    }

    const parsed = this.tryParseJSON(rawResponse);
    if (parsed) return this.validateAndFinalize(parsed);

    // Retry with strict JSON reminder
    this.logger.warn('First extraction returned malformed JSON — retrying');
    let retryResponse: string;
    try {
      retryResponse = await this.gemini.generateFromImage(
        BILL_EXTRACTION_PROMPT + STRICT_JSON_REMINDER,
        imageBase64,
        mimeType,
      );
    } catch (err) {
      return {
        ok: false,
        code: 'API_FAILURE',
        message: 'Retry API call failed after malformed JSON',
      };
    }

    const retryParsed = this.tryParseJSON(retryResponse);
    if (!retryParsed) {
      return {
        ok: false,
        code: 'MALFORMED_JSON',
        message: 'Gemini returned unparseable JSON on both attempts',
      };
    }

    return this.validateAndFinalize(retryParsed);
  }

  private tryParseJSON(raw: string): Record<string, unknown> | null {
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
    try {
      const value = JSON.parse(cleaned);
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
      return value as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private validateAndFinalize(raw: Record<string, unknown>): ExtractionResult {
    const result = this.coerceToSchema(raw);

    // Fix any type issues — null out bad fields and add to missingFields
    for (const field of NUMERIC_BILL_FIELDS) {
      const val = result[field];
      if (val !== null && (typeof val !== 'number' || isNaN(val))) {
        this.logger.warn(`Type issue on field "${field}" — nulling out`);
        (result as unknown as Record<string, unknown>)[field] = null;
        if (!result.missingFields.includes(field)) result.missingFields.push(field);
      }
    }

    // Reconciliation check (flag only — never block)
    if (this.reconciliationMismatch(result)) {
      this.logger.warn('Reconciliation warning: totalAmount diverges from component sum');
      result._reconciliationWarning = true;
    }

    return { ok: true, data: result };
  }

  private coerceToSchema(raw: Record<string, unknown>): BillExtractionResult {
    return {
      provider: typeof raw['provider'] === 'string' ? raw['provider'] : null,
      billingMonth: typeof raw['billingMonth'] === 'string' ? raw['billingMonth'] : null,
      referenceNumber: typeof raw['referenceNumber'] === 'string' ? raw['referenceNumber'] : null,
      meterNumber: typeof raw['meterNumber'] === 'string' ? raw['meterNumber'] : null,
      previousReading: this.toNum(raw['previousReading']),
      currentReading: this.toNum(raw['currentReading']),
      units: this.toNum(raw['units']),
      energyCharges: this.toNum(raw['energyCharges']),
      fixedCharges: this.toNum(raw['fixedCharges']),
      taxes: this.toNum(raw['taxes']),
      surcharges: this.toNum(raw['surcharges']),
      adjustments: this.toNum(raw['adjustments']),
      arrears: this.toNum(raw['arrears']),
      totalAmount: this.toNum(raw['totalAmount']),
      dueDate: typeof raw['dueDate'] === 'string' ? raw['dueDate'] : null,
      currency: 'PKR',
      missingFields: Array.isArray(raw['missingFields'])
        ? (raw['missingFields'] as unknown[]).filter((f): f is string => typeof f === 'string')
        : [],
      confidence:
        typeof raw['confidence'] === 'number' && !isNaN(raw['confidence'] as number)
          ? Math.min(1, Math.max(0, raw['confidence'] as number))
          : 0,
    };
  }

  private reconciliationMismatch(bill: BillExtractionResult): boolean {
    if (!bill.totalAmount) return false;
    const components = [
      bill.energyCharges, bill.fixedCharges, bill.taxes,
      bill.surcharges, bill.adjustments, bill.arrears,
    ].filter((v): v is number => v !== null);
    if (components.length < MIN_FIELDS_FOR_RECONCILIATION) return false;
    const sum = components.reduce((a, b) => a + b, 0);
    return Math.abs(sum - bill.totalAmount) / Math.abs(bill.totalAmount) > RECONCILIATION_TOLERANCE;
  }

  private toNum(val: unknown): number | null {
    if (val === null || val === undefined) return null;
    const n = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : Number(val);
    return isNaN(n) ? null : n;
  }
}