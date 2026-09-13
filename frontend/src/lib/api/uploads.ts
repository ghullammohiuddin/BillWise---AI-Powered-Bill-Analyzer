import { API_BASE_URL } from './client';
import { ApiError, type ApiErrorShape } from '@/lib/types/api-error';

export interface UploadBillResponse {
  imageUrl: string;
}

/**
 * POST /uploads/bill (Section 5) — multipart/form-data, field `file`.
 * Uses XMLHttpRequest instead of fetch so we can report real upload
 * progress (Section 3.1) — fetch has no cross-browser upload-progress event.
 */
export function uploadBillImage(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadBillResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      const isSuccess = xhr.status >= 200 && xhr.status < 300;
      let body: unknown = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = null;
      }

      if (isSuccess && body) {
        resolve(body as UploadBillResponse);
        return;
      }

      const payload: ApiErrorShape = (body as ApiErrorShape) ?? {
        statusCode: xhr.status,
        error: 'Upload Failed',
        message: 'Something went wrong while uploading your bill photo.',
        path: '/uploads/bill',
        timestamp: new Date().toISOString(),
      };
      reject(new ApiError(payload));
    });

    xhr.addEventListener('error', () => {
      reject(
        new ApiError({
          statusCode: 0,
          error: 'Network Error',
          message:
            'Could not reach the BillWise server. Check your connection and try again.',
          path: '/uploads/bill',
          timestamp: new Date().toISOString(),
        }),
      );
    });

    xhr.open('POST', `${API_BASE_URL}/uploads/bill`);
    xhr.send(formData);
  });
}
