import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s+()-]/g, '').replace(/^91(?=\d{10}$)/, ''))
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: 'Please enter a valid 10-digit mobile number (e.g. 9876543210)',
    }),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['FARMER', 'PROCUREMENT_OFFICER', 'ADMIN']).default('FARMER'),
  village: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s+()-]/g, '').replace(/^91(?=\d{10}$)/, ''))
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: 'Invalid phone number',
    })
    .optional(),
  village: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
