'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MissingFieldWarning } from './MissingFieldWarning';

interface ExtractionFieldInputProps {
  id: string;
  label: string;
  value: string;
  isMissing: boolean;
  type?: 'text' | 'number' | 'date' | 'month';
  onChange: (value: string) => void;
}

export function ExtractionFieldInput({
  id,
  label,
  value,
  isMissing,
  type = 'text',
  onChange,
}: ExtractionFieldInputProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        // Never show a blank as if it were a confirmed empty value — a
        // flagged field starts genuinely empty so it visibly needs input,
        // rather than pre-filled with 0 that would read as real data.
        placeholder={isMissing ? 'Not detected' : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={
          isMissing ? 'border-alert focus-visible:ring-alert' : undefined
        }
      />
      {isMissing && <MissingFieldWarning />}
    </div>
  );
}
