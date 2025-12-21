import { z } from 'zod';

// Base language schema
const baseLanguageSchema = z.object({
  code: z.string().min(2).max(5),
  name: z.string().min(2).max(50),
  direction: z.enum(['ltr', 'rtl']).default('ltr'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  meta: z.record(z.string(), z.any()).optional(),
});

// Create language schema
export const languageCreateSchema = baseLanguageSchema.required({
  code: true,
  name: true,
});

// Update language schema
export const languageUpdateSchema = baseLanguageSchema.partial();

// Query parameters for language filtering
export const languageQuerySchema = z.object({
  active: z.enum(['true', 'false']).optional(),
});

// Params validation
export const languageParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  code: z.string().min(2).max(5),
});
