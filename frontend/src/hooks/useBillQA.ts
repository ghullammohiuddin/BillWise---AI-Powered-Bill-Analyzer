'use client';

import { useCallback, useState } from 'react';
import { askQuestion } from '@/lib/api/qa';

export interface QAMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Only set on assistant messages — mirrors the `grounded` flag from
   *  Section 5's /ask response. */
  grounded?: boolean;
}

export function useBillQA(billId: string) {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', text: trimmed },
      ]);
      setIsLoading(true);
      setError(null);

      try {
        const res = await askQuestion(billId, trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: res.answer,
            grounded: res.grounded,
          },
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to get an answer.'),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [billId],
  );

  return { messages, isLoading, error, ask };
}
