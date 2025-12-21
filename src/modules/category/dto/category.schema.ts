import { z } from 'zod';

// Flexible schema for translations
const flexibleSchema = z.record(z.string(), z.any());

// SEO metadata schema
const seoSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  keywords: z.string().max(500).optional(),
  image: z.string().url('Invalid image URL').optional(),
});

// Flexible SEO schema that accepts predefined keys plus any additional
export const flexibleSeoSchema = seoSchema.catchall(z.any());

// Base category schema
const baseCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  image: z.string().url('Invalid image URL').optional(),
  names: flexibleSchema.optional(),
  descriptions: flexibleSchema.optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    ),
  parentId: z.number().int().positive().optional().nullable(),
  displayOrder: z.number().int().min(0).max(1000).default(0),
  isActive: z.boolean().default(true),
  seo: flexibleSeoSchema.optional(),
  meta: flexibleSchema.optional(),
});

// Create category schema - required fields
export const categoryCreateSchema = baseCategorySchema;

// Update category schema - all fields optional except slug (which shouldn't change)
export const categoryUpdateSchema = baseCategorySchema.partial().omit({
  slug: true,
});

// Category hierarchy validation schema
export const categoryHierarchyValidateSchema = z
  .object({
    categoryId: z.number().int().positive().optional(),
    parentId: z.number().int().positive().optional().nullable(),
  })
  .refine(
    (data) => data.categoryId !== data.parentId,
    'Category cannot be its own parent',
  );

// Query parameters for category filtering
export const categoryQuerySchema = z.object({
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
    .refine((n) => n > 0 && n <= 50)
    .optional(),
  active: z.enum(['true', 'false']).optional(),
  parentId: z.string().regex(/^\d+$/).transform(Number).optional(),
});

// Params validation
export const categoryParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  slug: z.string().min(2).max(100),
});
