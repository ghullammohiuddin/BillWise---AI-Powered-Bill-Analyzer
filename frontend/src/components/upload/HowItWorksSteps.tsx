import { Camera, Sparkles, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Upload',
    body: 'Snap or choose a photo of your bill.',
  },
  {
    icon: Sparkles,
    title: 'AI reads it',
    body: 'We extract every field in seconds.',
  },
  {
    icon: TrendingUp,
    title: 'See what changed',
    body: 'Compare it to last month, explained plainly.',
  },
];

export function HowItWorksSteps() {
  return (
    <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
      {steps.map(({ icon: Icon, title, body }, i) => (
        <div
          key={title}
          className="rounded-lg border border-border bg-surface p-space-md text-center"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-space-xs text-label-md text-ink-muted">
            Step {i + 1}
          </p>
          <p className="font-display text-headline-sm text-ink">{title}</p>
          <p className="text-body-sm text-ink-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}
