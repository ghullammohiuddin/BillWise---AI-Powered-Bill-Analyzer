/** Standard error shape returned on every non-2xx response (Section 5).
 *  Only statusCode/error/message/path/timestamp are guaranteed — the doc is
 *  explicit that `message` text itself isn't a stable contract. */
export interface ApiErrorShape {
  statusCode: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}

export class ApiError extends Error {
  statusCode: number;
  errorType: string;
  path?: string;

  constructor(payload: ApiErrorShape) {
    super(payload.message);
    this.name = 'ApiError';
    this.statusCode = payload.statusCode;
    this.errorType = payload.error;
    this.path = payload.path;
  }
}
