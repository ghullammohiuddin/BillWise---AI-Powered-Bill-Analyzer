'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface BillImagePreviewProps {
  imageUrl: string;
  alt: string;
}

// Section 3.4: "thumbnail -> full view on click". Uses the native <dialog>
// element rather than a hand-rolled modal — it gives focus trapping, ESC-to
// -close, and a backdrop for free, with far less code than reimplementing
// those from scratch.
export function BillImagePreview({ imageUrl, alt }: BillImagePreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="relative block h-40 w-full overflow-hidden rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary sm:h-56"
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </button>

      <dialog
        ref={dialogRef}
        className="max-h-[90vh] max-w-[90vw] rounded-lg border-0 p-0 backdrop:bg-ink/70"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute right-2 top-2 rounded-full bg-surface/90 p-1.5 text-ink shadow-card"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- a plain
              <img> keeps natural aspect-ratio sizing inside a <dialog> that
              sizes to its content; next/image needs an explicitly sized
              wrapper we don't have here. */}
          <img
            src={imageUrl}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      </dialog>
    </>
  );
}
