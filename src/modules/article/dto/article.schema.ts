import { z } from 'zod';

// Base article schema with dynamic multilingual support
const baseArticleSchema = z.object({
  // Primary content fields (default language)
  title: z.string().min(5).max(200),
  slug: z
    .string()
    .min(3)
    .max(150)
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    ),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.any(),
  languageId: z
    .number()
    .int()
    .positive('Language ID must be a positive number'),

  // Media
  featuredImage: z.string().url('Invalid image URL').optional(),
  imageCaption: z.string().max(200).optional(),
  gallery: z.array(z.string().url('Invalid image URL')).max(10).optional(),

  // Metadata
  categoryId: z
    .number()
    .int()
    .positive('Category ID must be a positive number'),
  authorId: z.number().int().positive('Author ID must be a positive number'),

  // Publication status
  status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
  isPublished: z.boolean().default(false),

  publishedAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  scheduledAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),

  // Priority and placement
  isFeatured: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
  priority: z.number().int().min(1).max(10).default(5),

  // Location and source (dynamic multilingual)
  location: z.string().max(100).optional(),
  source: z.string().max(100).optional(),

  // SEO
  seo: z.record(z.string(), z.any()).optional(),
  meta: z.record(z.string(), z.any()).optional(),

  // Tag IDs for article-tag relations
  tagIds: z.array(z.number().int().positive()).optional(),
});

// Create article schema - all required fields must be present
export const articleCreateSchema = baseArticleSchema
  .required({
    title: true,
    slug: true,
    content: true,
    categoryId: true,
    authorId: true,
    languageId: true,
  })
  .partial({
    status: true,
    isPublished: true,
    isFeatured: true,
    isBreaking: true,
    priority: true,
  });

// Update article schema - all fields are optional except those that shouldn't change
export const articleUpdateSchema = baseArticleSchema.partial().omit({
  slug: true, // Don't allow slug updates
});

// Query parameters for filtering articles
export const articleQuerySchema = z.object({
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
  q: z.string().max(200).optional(),
  category: z.string().regex(/^\d+$/).transform(Number).optional(),
  author: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
  published: z.enum(['true', 'false']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  breaking: z.enum(['true', 'false']).optional(),
  sortBy: z
    .enum([
      'publishedAt',
      'createdAt',
      'updatedAt',
      'title',
      'viewCount',
      'priority',
    ])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  tags: z.string().optional(), // comma-separated tag ids
});

// Translation schema for adding/updating article translations
export const articleTranslationCreateSchema = z.object({
  languageId: z
    .number()
    .int()
    .positive('Language ID must be a positive number'),
  title: z.string().min(5).max(200),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.any(),
  location: z.string().max(100).optional(),
  seo: z.record(z.string(), z.any()).optional(),
});

export const articleTranslationUpdateSchema =
  articleTranslationCreateSchema.partial();
