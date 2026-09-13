import { cn } from '@/lib/utils';
import type { QAMessage } from '@/hooks/useBillQA';

export function QAMessageBubble({ message }: { message: QAMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-space-md py-space-sm text-body-md',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-surface text-ink',
        )}
      >
        <p>{message.text}</p>
        {/* Section 3.7: when grounded is false, say so plainly rather than
            letting the UI imply an answer exists when it doesn't. */}
        {message.role === 'assistant' && message.grounded === false && (
          <p className="mt-space-xs text-body-sm italic text-ink-muted">
            This answer isn&apos;t backed by your bill&apos;s data — treat it as
            a general note, not a fact about this bill.
          </p>
        )}
      </div>
    </div>
  );
}
