import { cn } from '@/lib/utils';
import type { UploadStep } from '@/hooks/useUploadBill';

const STEP_LABEL: Partial<Record<UploadStep, string>> = {
  uploading: 'Uploading your bill photo…',
  extracting: 'Reading your bill — this takes a few seconds…',
  saving: 'Saving your bill…',
};

interface UploadProgressProps {
  step: UploadStep;
  progress: number;
}

export function UploadProgress({ step, progress }: UploadProgressProps) {
  const isDeterminate = step === 'uploading';

  return (
    <div className="rounded-lg border border-border bg-surface p-space-lg text-center">
      <p className="font-display text-headline-sm text-ink">
        {STEP_LABEL[step] ?? 'Working on it…'}
      </p>
      <div className="mt-space-md h-2 w-full overflow-hidden rounded-full bg-border/60">
        <div
          className={cn(
            'h-full rounded-full bg-primary transition-all',
            !isDeterminate && 'animate-pulse',
          )}
          style={{ width: isDeterminate ? `${progress}%` : '100%' }}
        />
      </div>
      {!isDeterminate && (
        <p className="mt-space-xs text-body-sm text-ink-muted">Hang tight…</p>
      )}
    </div>
  );
}
