/**
 * Validates critical environment variables on startup
 */
export function validateEnv(): void {
  const required = ['PORT', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[Config Warning] Missing optional/defaulted env vars: ${missing.join(', ')}`);
  }
}
