// src/ai/bill-question.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { GeminiService, GeminiError } from './gemini.service';
import { buildQAPrompt } from './prompts/question-answering.prompt';
import { QAContext, QAResult } from './types/bill.types';

export interface QASuccess { ok: true; result: QAResult }
export interface QAFailure { ok: false; code: 'API_FAILURE' | 'EMPTY_RESPONSE'; message: string }
export type QAOutcome = QASuccess | QAFailure;

const UNGROUNDED_PHRASES = [
  "i don't have enough information",
  "i don't have enough billing history",
  "cannot be answered",
  "not available",
  "no data available",
];

@Injectable()
export class BillQuestionService {
  private readonly logger = new Logger(BillQuestionService.name);

  constructor(private readonly gemini: GeminiService) {}

  async answerQuestion(ctx: QAContext): Promise<QAOutcome> {
    try {
      const raw = await this.gemini.generateText(buildQAPrompt(ctx));
      const answer = raw.trim();
      if (!answer) return { ok: false, code: 'EMPTY_RESPONSE', message: 'Empty response from Gemini' };
      const isGrounded = !UNGROUNDED_PHRASES.some((p) => answer.toLowerCase().includes(p));
      return { ok: true, result: { answer, isGrounded } };
    } catch (err) {
      this.logger.error('Q&A generation failed', err);
      return {
        ok: false,
        code: 'API_FAILURE',
        message: err instanceof GeminiError ? err.message : 'Unexpected error',
      };
    }
  }
}