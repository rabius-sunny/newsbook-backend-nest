import { z } from 'zod'
import { flexibleSeoSchema } from './setting.schema'

// Descriptions translations schema
export const flexibleSchema = z.record(z.string(), z.any())

// Base category schema
export const baseCategorySchema = z.object({
  // Primary fields (Bengali is default)
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  image: z.string().min(2).max(100),

  // Translations
  names: flexibleSchema.optional(),
  descriptions: flexibleSchema.optional(),

  // URL and hierarchy
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  parentId: z.number().int().positive().optional(),
  displayOrder: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),

  // Metadata
  seo: flexibleSeoSchema.optional(), // Now accepts both predefined and custom SEO fields
  meta: flexibleSchema.optional(),
})

// Create category schema - required fields
export const categoryCreateSchema = baseCategorySchema.required({
  name: true,
  slug: true,
})

// Update category schema - all fields optional except slug (which shouldn't change)
export const categoryUpdateSchema = baseCategorySchema.partial().omit({
  slug: true,
})

// Category hierarchy validation schema
export const categoryHierarchyValidateSchema = z
  .object({
    categoryId: z.number().int().positive().optional(),
    parentId: z.number().int().positive().optional(),
  })
  .refine((data) => data.categoryId !== data.parentId, 'Category cannot be its own parent')

// Query parameters for category filtering
export const categoryQuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 50)
    .optional(),
  active: z.enum(['true', 'false']).optional(),
  parentId: z.string().regex(/^\d+$/).transform(Number).optional(),
})

// Params validation
export const categoryParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  slug: z.string().min(2).max(100),
  parentId: z.string().regex(/^\d+$/).transform(Number),
  categoryId: z.string().regex(/^\d+$/).transform(Number),
})

export type CategorySchema = z.infer<typeof baseCategorySchema>
