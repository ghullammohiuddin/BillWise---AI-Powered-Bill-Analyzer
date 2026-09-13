import { QAMessageBubble } from './QAMessageBubble';
import type { QAMessage } from '@/hooks/useBillQA';

interface QAChatWindowProps {
  messages: QAMessage[];
  isLoading: boolean;
}

export function QAChatWindow({ messages, isLoading }: QAChatWindowProps) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-space-lg text-center text-body-md text-ink-muted">
        Ask something like &quot;Why did my bill increase?&quot;
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-space-sm overflow-y-auto">
      {messages.map((message) => (
        <QAMessageBubble key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="rounded-lg border border-border bg-surface px-space-md py-space-sm text-body-md text-ink-muted">
            Thinking…
          </div>
        </div>
      )}
    </div>
  );
}
