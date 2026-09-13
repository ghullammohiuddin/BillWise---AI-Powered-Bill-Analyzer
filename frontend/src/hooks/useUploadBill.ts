'use client';

import { useCallback, useState } from 'react';
import { uploadBillImage } from '@/lib/api/uploads';
import { createBill, extractBill } from '@/lib/api/bills';
import type {
  Bill,
  CreateBillRequest,
  ExtractionResult,
} from '@/lib/types/bill';

export type UploadStep =
  'idle' | 'uploading' | 'extracting' | 'review' | 'saving' | 'done';

interface UseUploadBillResult {
  step: UploadStep;
  progress: number; // upload progress 0-100 (Section 3.1)
  extraction: ExtractionResult | null;
  savedBill: Bill | null;
  error: Error | null;
  startUpload: (file: File) => Promise<void>;
  saveBill: (fields: Omit<CreateBillRequest, 'imageUrl'>) => Promise<void>;
  reset: () => void;
}

/**
 * Orchestrates the three-step upload flow from Section 5: upload image ->
 * extract fields -> (user reviews/corrects) -> save. No bill `id` exists
 * until the final `saveBill` call succeeds.
 */
export function useUploadBill(): UseUploadBillResult {
  const [step, setStep] = useState<UploadStep>('idle');
  const [progress, setProgress] = useState(0);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [savedBill, setSavedBill] = useState<Bill | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const startUpload = useCallback(async (file: File) => {
    setError(null);
    setStep('uploading');
    setProgress(0);

    try {
      const { imageUrl: uploadedUrl } = await uploadBillImage(
        file,
        setProgress,
      );
      setImageUrl(uploadedUrl);

      setStep('extracting');
      const { extracted } = await extractBill(uploadedUrl);
      setExtraction(extracted);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Upload failed.'));
      setStep('idle');
    }
  }, []);

  const saveBill = useCallback(
    async (fields: Omit<CreateBillRequest, 'imageUrl'>) => {
      if (!imageUrl) return;
      setError(null);
      setStep('saving');

      try {
        const bill = await createBill({ ...fields, imageUrl });
        setSavedBill(bill);
        setStep('done');
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to save bill.'),
        );
        setStep('review'); // back to the same reviewed data, not a full reset
      }
    },
    [imageUrl],
  );

  const reset = useCallback(() => {
    setStep('idle');
    setProgress(0);
    setExtraction(null);
    setImageUrl(null);
    setSavedBill(null);
    setError(null);
  }, []);

  return {
    step,
    progress,
    extraction,
    savedBill,
    error,
    startUpload,
    saveBill,
    reset,
  };
}
