'use client';

import { useParams } from 'next/navigation';
import { useBillQA } from '@/hooks/useBillQA';
import { QAChatWindow } from '@/components/qa/QAChatWindow';
import { QAInput } from '@/components/qa/QAInput';
import { ErrorState } from '@/components/shared/ErrorState';

export default function AskBillPage() {
  const { id } = useParams<{ id: string }>();
  const { messages, isLoading, error, ask } = useBillQA(id);

  return (
    <main className="mx-auto flex h-[calc(100vh-5rem)] max-w-2xl flex-col px-margin-sm py-space-lg">
      <h1 className="font-display text-headline-lg-mobile text-ink md:text-headline-lg">
        Ask about this bill
      </h1>

      <div className="mt-space-md flex flex-1 flex-col overflow-hidden">
        <QAChatWindow messages={messages} isLoading={isLoading} />
      </div>

      {error && (
        <ErrorState message="Couldn't get an answer. Please try asking again." />
      )}

      <div className="mt-space-sm">
        <QAInput onSend={ask} disabled={isLoading} />
      </div>
    </main>
  );
}
