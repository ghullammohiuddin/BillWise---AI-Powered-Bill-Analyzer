'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB cap per Section 3.1 (confirm with backend)

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
}

export function UploadDropzone({ onFileSelected }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setValidationError('Please upload a JPG, PNG, or WEBP image.');
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setValidationError('That image is over 10MB — try a smaller photo.');
        return;
      }
      setValidationError(null);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndSelect(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-space-sm rounded-lg border-2 border-dashed p-space-xl text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-surface hover:border-primary/40',
        )}
      >
        <UploadCloud className="h-8 w-8 text-primary" aria-hidden="true" />
        <p className="font-display text-headline-sm text-ink">
          Drag &amp; drop your bill photo
        </p>
        <p className="text-body-sm text-ink-muted">
          or tap to choose a file — JPG, PNG, or WEBP, up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
        />
      </div>
      {validationError && (
        <p className="mt-space-xs text-body-sm text-danger">
          {validationError}
        </p>
      )}
    </div>
  );
}
