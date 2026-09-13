// src/ai/gemini.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export type GeminiErrorCode =
  | 'API_FAILURE'
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'EMPTY_RESPONSE';

export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly code: GeminiErrorCode,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

export type ImageMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/heic';

@Injectable()
export class GeminiService implements OnModuleInit {
  private readonly logger = new Logger(GeminiService.name);
  private model!: GenerativeModel;
  private readonly MAX_RETRIES = 2;
  private readonly BASE_DELAY_MS = 1500;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
    const modelName = this.config.get<string>('GEMINI_MODEL', 'gemini-2.0-flash-lite');
    const client = new GoogleGenerativeAI(apiKey);
    this.model = client.getGenerativeModel({ model: modelName });
    this.logger.log(`GeminiService ready — model: ${modelName}`);
  }

  async generateText(prompt: string): Promise<string> {
    return this.withRetry(() => this.callGemini([{ text: prompt }]));
  }

  async generateFromImage(
    prompt: string,
    imageBase64: string,
    mimeType: ImageMimeType,
  ): Promise<string> {
    return this.withRetry(() =>
      this.callGemini([
        { text: prompt },
        { inlineData: { data: imageBase64, mimeType } },
      ]),
    );
  }

  private async callGemini(parts: object[]): Promise<string> {
    const result = await this.model.generateContent(parts as never);
    const text = result.response.text();
    if (!text?.trim()) {
      throw new GeminiError('Gemini returned empty response', 'EMPTY_RESPONSE');
    }
    return text;
  }

  private async withRetry(fn: () => Promise<string>, attempt = 1): Promise<string> {
    try {
      return await fn();
    } catch (err) {
      const geminiErr = this.classify(err);
      if (geminiErr.retryable && attempt <= this.MAX_RETRIES) {
        const delay = this.BASE_DELAY_MS * attempt;
        this.logger.warn(
          `Gemini [${geminiErr.code}] attempt ${attempt}/${this.MAX_RETRIES}: retrying in ${delay}ms`,
        );
        await this.sleep(delay);
        return this.withRetry(fn, attempt + 1);
      }
      throw geminiErr;
    }
  }

  private classify(err: unknown): GeminiError {
    if (err instanceof GeminiError) return err;
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('429') || /quota|rate.?limit/i.test(msg))
      return new GeminiError(msg, 'RATE_LIMIT', true);
    if (/timeout|deadline|ETIMEDOUT/i.test(msg))
      return new GeminiError(msg, 'TIMEOUT', true);
    return new GeminiError(msg, 'API_FAILURE', false);
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}