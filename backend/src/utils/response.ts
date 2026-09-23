// ─── Standard API Response Helpers ───────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export const successResponse = <T>(
  data: T,
  message?: string
): ApiSuccessResponse<T> => ({
  success: true,
  data,
  ...(message ? { message } : {}),
});

export const errorResponse = (
  message: string,
  code: string = 'INTERNAL_ERROR',
  details?: unknown[]
): ApiErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    ...(details ? { details } : {}),
  },
});
