import { z } from 'zod'

// Create language schema - all required fields
export const languageCreateSchema = z.object({
  code: z
    .string()
    .min(2, 'code is required')
    .max(5)
    .regex(
      /^[a-z]{2}(-[A-Z]{2})?$/,
      'Invalid language code format (use ISO 639-1 like "en" or "en-US")',
    ),
  name: z.string().min(2, 'name is required').max(50),
  direction: z.enum(['ltr', 'rtl']),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  meta: z.record(z.string(), z.any()).optional(),
})

// Update language schema - all fields optional except code changes
export const languageUpdateSchema = z.object({
  name: z.string().min(2, 'name is required').max(50).optional(),
  direction: z.enum(['ltr', 'rtl']).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  meta: z.record(z.string(), z.any()).optional(),
})

// Query parameters for language filtering
export const languageQuerySchema = z.object({
  active: z.enum(['true', 'false']).optional(),
})

// Params validation
export const languageParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
})

// Export types
export type LanguageCreateInput = z.infer<typeof languageCreateSchema>
export type LanguageUpdateInput = z.infer<typeof languageUpdateSchema>
export type LanguageQueryParams = z.infer<typeof languageQuerySchema>
export type LanguagePathParams = z.infer<typeof languageParamsSchema>
