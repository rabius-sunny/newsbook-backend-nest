import { z } from 'zod';

export const galleryCreateSchema = z.object({
  fileId: z.string().min(1, 'File ID is required'),
  url: z.string().url('Invalid URL'),
  type: z.enum(['image', 'video']),
});

export const galleryQuerySchema = z.object({
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
  type: z.enum(['image', 'video']).optional(),
});
