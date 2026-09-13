import { apiFetch } from './client';

export interface AskQuestionResponse {
  question: string;
  answer: string;
  grounded: boolean;
}

/** POST /bills/:id/ask (Section 5) — powers the Bill Q&A interface (3.7). */
export function askQuestion(billId: string, question: string) {
  return apiFetch<AskQuestionResponse>(`/bills/${billId}/ask`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}
