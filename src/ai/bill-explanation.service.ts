// src/ai/bill-explanation.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { GeminiService, GeminiError } from './gemini.service';
import { buildExplanationPrompt } from './prompts/explanation.prompt';
import { ExplanationInput } from './types/bill.types';

export interface ExplanationSuccess { ok: true; explanation: string }
export interface ExplanationFailure { ok: false; code: 'API_FAILURE' | 'EMPTY_RESPONSE'; message: string }
export type ExplanationOutcome = ExplanationSuccess | ExplanationFailure;

@Injectable()
export class BillExplanationService {
  private readonly logger = new Logger(BillExplanationService.name);

  constructor(private readonly gemini: GeminiService) {}

  async generateExplanation(input: ExplanationInput): Promise<ExplanationOutcome> {
    try {
      const text = await this.gemini.generateText(buildExplanationPrompt(input));
      const explanation = text.trim();
      if (!explanation) return { ok: false, code: 'EMPTY_RESPONSE', message: 'Empty response from Gemini' };
      return { ok: true, explanation };
    } catch (err) {
      this.logger.error('Explanation generation failed', err);
      return {
        ok: false,
        code: 'API_FAILURE',
        message: err instanceof GeminiError ? err.message : 'Unexpected error',
      };
    }
  }
}