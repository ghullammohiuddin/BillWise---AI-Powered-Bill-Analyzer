// src/ai/ai.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { BillExtractionService } from './bill-extraction.service';
import { BillExplanationService } from './bill-explanation.service';
import { BillQuestionService } from './bill-question.service';

@Module({
  imports: [ConfigModule],
  providers: [
    GeminiService,
    BillExtractionService,
    BillExplanationService,
    BillQuestionService,
  ],
  exports: [
    BillExtractionService,
    BillExplanationService,
    BillQuestionService,
  ],
})
export class AIModule {}