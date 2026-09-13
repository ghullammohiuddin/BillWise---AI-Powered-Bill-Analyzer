// src/ai/prompts/question-answering.prompt.ts

import { QAContext } from '../types/bill.types';

export function buildQAPrompt(ctx: QAContext): string {
  const historySection =
    ctx.historicalBills && ctx.historicalBills.length > 0
      ? `Historical Bills (${ctx.historicalBills.length} on file):\n${JSON.stringify(ctx.historicalBills, null, 2)}`
      : `Historical Bills: None on file yet.`;

  const calculationsSection = ctx.backendCalculations
    ? `Backend Calculations (verified — use these for numeric answers, never compute inline):\n${JSON.stringify(ctx.backendCalculations, null, 2)}`
    : `Backend Calculations: Not provided for this request.`;

  return `You are a helpful assistant answering questions about a Pakistani electricity bill.

===== CONTEXT DATA =====

Current Bill:
${JSON.stringify(ctx.currentBill, null, 2)}

${historySection}

${calculationsSection}

===== USER QUESTION =====
"${ctx.question}"

===== YOUR RULES =====
1. Answer ONLY using the data provided above. No external knowledge about tariffs or typical bills.
2. If the question cannot be answered from available data, say clearly:
   "I don't have enough information from your bill history to answer that yet."
3. Keep your answer short and direct — this is a chat interface, not an essay.
4. If the question implies a calculation, use the Backend Calculations section — never compute inline.
5. Accuracy matters more than completeness. Never guess or make up values.

Answer the user's question now:`;
}