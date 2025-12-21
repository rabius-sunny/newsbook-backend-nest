import { z } from 'zod';

export const newsletterCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2).max(100).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});

export const newsletterUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
});

export const newsletterQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0)
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 100)
    .optional(),
  isActive: z.enum(['true', 'false']).optional(),
});
