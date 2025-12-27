import { z } from 'zod'

// Create comment schema
export const commentCreateSchema = z.object({
  articleId: z.number().int().positive('Article ID must be a positive integer'),
  authorName: z.string().min(2).max(100),
  authorEmail: z.string().email('Invalid email format').max(100),
  content: z.string().min(10).max(2000),

  // These fields are typically set by the server/middleware
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

// Update comment schema (if needed in future)
export const commentUpdateSchema = z.object({
  content: z.string().min(10).max(2000),
})

// Query parameters for comment filtering
export const commentQuerySchema = z.object({
  articleId: z.string().regex(/^\d+$/).transform(Number).optional(),
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
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// Params validation
export const commentParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  articleId: z.string().regex(/^\d+$/).transform(Number),
})
