import * as React from 'react';
import { cn } from '@/lib/utils';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('mb-1 block text-label-md text-ink-muted', className)}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
