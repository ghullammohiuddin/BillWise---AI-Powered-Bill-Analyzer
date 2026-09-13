import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  label?: string;
  rows?: number;
}

export function LoadingState({
  label = 'Loading…',
  rows = 3,
}: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-space-sm">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
