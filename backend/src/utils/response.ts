// ─── Standard API Response Helpers ───────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
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
  errors?: unknown[]
): ApiErrorResponse => ({
  success: false,
  message,
  ...(errors ? { errors } : {}),
});
