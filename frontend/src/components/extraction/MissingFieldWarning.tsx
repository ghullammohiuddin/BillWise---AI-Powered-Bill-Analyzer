import { AlertCircle } from 'lucide-react';

export function MissingFieldWarning() {
  return (
    <span className="mt-1 inline-flex items-center gap-1 text-body-sm text-alert">
      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      Not detected — please check and fill this in
    </span>
  );
}
