import Link from 'next/link';
import { Camera } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-space-md rounded-lg border border-dashed border-border bg-surface p-space-xl text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Camera className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-headline-md text-ink">No bills yet</p>
        <p className="text-body-md text-ink-muted">
          Upload your first bill to get started.
        </p>
      </div>
      <Link href="/upload" className={buttonVariants({ variant: 'primary' })}>
        Upload a bill
      </Link>
    </div>
  );
}
