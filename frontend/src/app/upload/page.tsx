'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadBill } from '@/hooks/useUploadBill';
import { UploadDropzone } from '@/components/upload/UploadDropzone';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { HowItWorksSteps } from '@/components/upload/HowItWorksSteps';
import { ExtractionForm } from '@/components/extraction/ExtractionForm';
import { ErrorState } from '@/components/shared/ErrorState';

export default function UploadPage() {
  const router = useRouter();
  const {
    step,
    progress,
    extraction,
    savedBill,
    error,
    startUpload,
    saveBill,
    reset,
  } = useUploadBill();

  useEffect(() => {
    if (step === 'done' && savedBill) {
      router.push(`/bills/${savedBill.id}`);
    }
  }, [step, savedBill, router]);

  return (
    <main className="mx-auto max-w-2xl px-margin-sm py-space-xl">
      <h1 className="font-display text-headline-lg-mobile text-ink md:text-headline-lg">
        Upload a bill
      </h1>

      <div className="mt-space-lg space-y-space-lg">
        {/* Upload/extract failures reset to 'idle' — surfaced here as a
            top-level banner. Save failures instead return to 'review' and
            are shown inline on the form itself (see saveError below), so the
            user can just retry Confirm & Save without losing their edits. */}
        {error && step === 'idle' && (
          <ErrorState
            title="Upload didn't go through"
            message={
              error.message ||
              'Something went wrong reading your bill. Please try again.'
            }
            onRetry={reset}
          />
        )}

        {step === 'idle' && (
          <>
            <UploadDropzone onFileSelected={startUpload} />
            <HowItWorksSteps />
          </>
        )}

        {(step === 'uploading' || step === 'extracting') && (
          <UploadProgress step={step} progress={progress} />
        )}

        {step === 'review' && extraction && (
          <ExtractionForm
            extraction={extraction}
            onConfirm={saveBill}
            saveError={error?.message ?? null}
          />
        )}

        {step === 'saving' && <UploadProgress step={step} progress={100} />}
      </div>
    </main>
  );
}
