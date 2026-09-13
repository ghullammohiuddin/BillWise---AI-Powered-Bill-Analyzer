import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something didn't load",
  message = 'We had trouble reaching the BillWise server. Your data is safe — this is just a connection hiccup.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-space-sm"
            onClick={onRetry}
          >
            Try again
          </Button>
        )}
      </div>
    </Alert>
  );
}
