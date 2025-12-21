import { z } from 'zod';

// Base tag schema
const baseTagSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    ),
  isActive: z.boolean().default(true),
  meta: z.record(z.string(), z.any()).optional(),
});

// Create tag schema
export const tagCreateSchema = baseTagSchema;

// Update tag schema - slug shouldn't change
export const tagUpdateSchema = baseTagSchema.partial().omit({
  slug: true,
});

// Query parameters for tag filtering
export const tagQuerySchema = z.object({
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
  q: z.string().max(100).optional(),
  active: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Params validation
export const tagParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  slug: z.string().min(2).max(50),
});
