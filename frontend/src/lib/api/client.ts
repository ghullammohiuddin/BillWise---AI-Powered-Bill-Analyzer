import { ApiError, type ApiErrorShape } from '@/lib/types/api-error';

// Falls back to the documented local default (.env.local.example) instead of
// throwing at build/render time if the env var is unset.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

/**
 * Shared JSON fetch wrapper. Throws ApiError (built from the standard error
 * shape, Section 5) on any non-2xx response. Endpoints with a special
 * non-standard response on a particular status — like the comparison
 * endpoint's 409 — should NOT use this and instead handle that status
 * before falling through to the generic error path (see comparison.ts).
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body && !isFormData
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(await safeParseError(res, path));
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function safeParseError(
  res: Response,
  path: string,
): Promise<ApiErrorShape> {
  try {
    return await res.json();
  } catch {
    return {
      statusCode: res.status,
      error: res.statusText || 'Request Failed',
      message: 'Something went wrong. Please try again.',
      path,
      timestamp: new Date().toISOString(),
    };
  }
}
