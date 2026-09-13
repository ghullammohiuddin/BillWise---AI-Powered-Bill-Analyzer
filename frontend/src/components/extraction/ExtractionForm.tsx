'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ExtractionFieldInput } from './ExtractionFieldInput';
import type { ExtractedBillFields, ExtractionResult } from '@/lib/types/bill';

interface ExtractionFormProps {
  extraction: ExtractionResult;
  onConfirm: (fields: ExtractedBillFields) => void;
  saveError?: string | null;
}

type FieldKey = keyof ExtractedBillFields;
type FormState = Record<FieldKey, string>;

const NUMERIC_KEYS: FieldKey[] = [
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
];

const FIELD_CONFIG: {
  key: FieldKey;
  label: string;
  type: 'text' | 'number' | 'date' | 'month';
}[] = [
  { key: 'provider', label: 'Provider', type: 'text' },
  { key: 'billingMonth', label: 'Billing month', type: 'month' },
  { key: 'referenceNumber', label: 'Reference number', type: 'text' },
  { key: 'meterNumber', label: 'Meter number', type: 'text' },
  { key: 'previousReading', label: 'Previous reading', type: 'number' },
  { key: 'currentReading', label: 'Current reading', type: 'number' },
  { key: 'units', label: 'Units (kWh)', type: 'number' },
  { key: 'energyCharges', label: 'Energy charges', type: 'number' },
  { key: 'fixedCharges', label: 'Fixed charges', type: 'number' },
  { key: 'taxes', label: 'Taxes', type: 'number' },
  { key: 'surcharges', label: 'Surcharges', type: 'number' },
  { key: 'adjustments', label: 'Adjustments', type: 'number' },
  { key: 'arrears', label: 'Arrears', type: 'number' },
  { key: 'totalAmount', label: 'Total amount', type: 'number' },
  { key: 'dueDate', label: 'Due date', type: 'date' },
];

function toFormState(extraction: ExtractionResult): FormState {
  const state = {} as FormState;
  for (const { key } of FIELD_CONFIG) {
    const raw = extraction[key];
    if (raw === null || raw === undefined) {
      state[key] = '';
    } else if (key === 'dueDate' && typeof raw === 'string') {
      // Defensive: native <input type="date"> needs exactly YYYY-MM-DD.
      state[key] = raw.slice(0, 10);
    } else {
      state[key] = String(raw);
    }
  }
  return state;
}

export function ExtractionForm({
  extraction,
  onConfirm,
  saveError,
}: ExtractionFormProps) {
  const [values, setValues] = useState<FormState>(() =>
    toFormState(extraction),
  );
  // Fields the user has edited since extraction — their "missing" warning
  // clears once they've provided/confirmed a value, even if it started
  // flagged in `missingFields`.
  const [resolved, setResolved] = useState<Set<FieldKey>>(new Set());

  const handleChange = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setResolved((prev) => new Set(prev).add(key));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fields = { ...values } as unknown as ExtractedBillFields;

    for (const key of NUMERIC_KEYS) {
      const raw = values[key];
      (fields as unknown as Record<string, unknown>)[key] =
        raw === '' ? null : Number(raw);
    }

    fields.referenceNumber =
      values.referenceNumber === '' ? null : values.referenceNumber;
    fields.meterNumber = values.meterNumber === '' ? null : values.meterNumber;
    fields.currency = extraction.currency;

    onConfirm(fields);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-space-lg">
      <div className="flex items-center justify-between gap-space-sm">
        <h2 className="font-display text-headline-md text-ink">
          Review extracted details
        </h2>
        <ConfidenceBadge confidence={extraction.confidence} />
      </div>

      {extraction.missingFields.length > 0 && (
        <p className="text-body-sm text-ink-muted">
          A few fields couldn&apos;t be read from the photo — they&apos;re
          flagged below. Fill them in before saving.
        </p>
      )}

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        {FIELD_CONFIG.map(({ key, label, type }) => (
          <ExtractionFieldInput
            key={key}
            id={key}
            label={label}
            type={type}
            value={values[key]}
            isMissing={
              extraction.missingFields.includes(key) && !resolved.has(key)
            }
            onChange={(value) => handleChange(key, value)}
          />
        ))}
      </div>

      {saveError && <p className="text-body-sm text-danger">{saveError}</p>}

      <Button type="submit" className="w-full sm:w-auto">
        Confirm &amp; Save
      </Button>
    </form>
  );
}
