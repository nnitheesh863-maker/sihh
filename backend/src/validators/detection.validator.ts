import { z } from 'zod';

export const detectionQuerySchema = z.object({
  page: z.string().optional().transform((val) => parseInt(val || '1', 10)),
  limit: z.string().optional().transform((val) => parseInt(val || '10', 10)),
  grade: z.enum(['A', 'B', 'C', 'REJECTED']).optional(),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

export type DetectionQueryInput = z.infer<typeof detectionQuerySchema>;
