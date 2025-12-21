import { z } from 'zod';

export const advertisementCreateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  clickUrl: z.string().url('Invalid URL').optional(),
  position: z.enum(['header', 'sidebar', 'content', 'footer']),
  isActive: z.boolean().default(true),
  startDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
});

export const advertisementUpdateSchema = advertisementCreateSchema.partial();

export const advertisementQuerySchema = z.object({
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
  position: z.enum(['header', 'sidebar', 'content', 'footer']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
});
