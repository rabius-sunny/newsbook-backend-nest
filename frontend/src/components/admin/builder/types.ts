import { z } from 'zod'

// Utility function for generating random IDs
export const generateRandomString = (n: number = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, n + 2)
    .toUpperCase()
}

// Article form schema for React Hook Form (excluding content field)
// Content will be handled separately by the builder
export const articleFormSchema = z.object({
  // Primary content fields (default language)
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(150, 'Slug must be at most 150 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt must be at most 500 characters')
    .optional(),
  languageId: z.number().int().positive('Language ID must be a positive number'),

  // Media
  featuredImage: z.string('Featured image is required').min(5, 'Featured image is required'),
  imageCaption: z.string().max(200, 'Image caption must be at most 200 characters').optional(),

  // Metadata
  categoryId: z.number('Category is required'),
  authorId: z.number().int().positive('Author ID must be a positive number'),

  // Publication status
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.any().optional(),
  scheduledAt: z.any().optional(),

  // Priority and placement
  isFeatured: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
  priority: z
    .number()
    .int()
    .min(1, 'Priority must be at least 1')
    .max(10, 'Priority must be at most 10')
    .optional(),

  // Location and source
  location: z.string().max(100, 'Location must be at most 100 characters').optional(),
  source: z.string().max(100, 'Source must be at most 100 characters').optional(),

  // SEO and meta (flexible objects)
  seo: z.record(z.string(), z.any()).optional(),
  meta: z.record(z.string(), z.any()).optional(),
})

export type ArticleFormData = z.infer<typeof articleFormSchema>

// Content blocks types for the builder as per instruction requirements
export type BlockType =
  | 'text'
  | 'quote'
  | 'image'
  | 'video'
  | 'imageWithText'
  | 'banner'
  | 'relatedNews'

export interface BaseBlock {
  id: string
  type: BlockType
  order: number
}

// Text Block: For adding rich text content using TipTap
export interface TextBlock extends BaseBlock {
  type: 'text'
  data: {
    content: string // Rich text HTML content from TipTap editor
  }
}

// Quote Block: For adding blockquotes
export interface QuoteBlock extends BaseBlock {
  type: 'quote'
  data: {
    text: string
    author?: string
    designation?: string
  }
}

// Image Block: For uploading and displaying image with caption
export interface ImageBlock extends BaseBlock {
  type: 'image'
  data: {
    imageUrl: string
    caption?: string
    alt?: string
    width?: number
    height?: number
  }
}

// Video Block: For embedding videos from platforms like YouTube
export interface VideoBlock extends BaseBlock {
  type: 'video'
  data: {
    url: string // YouTube, Vimeo, etc.
  }
}

// Image with Text Block: For adding an image alongside rich text content
export interface ImageWithTextBlock extends BaseBlock {
  type: 'imageWithText'
  data: {
    imageUrl: string
    imagePosition: 'left' | 'right'
    imageCaption?: string
    content: string // Rich text HTML content from TipTap editor
    imageWidth?: number
    imageHeight?: number
  }
}

// Banner Block: For adding a full-width banner image with url
export interface BannerBlock extends BaseBlock {
  type: 'banner'
  data: {
    imageUrl: string
    linkUrl?: string
  }
}

// Related News Block: For adding links to other news articles within the platform
export interface RelatedNewsBlock extends BaseBlock {
  type: 'relatedNews'
  data: {
    articles: Array<{
      id: number
      title: string
      excerpt?: string
      imageUrl?: string
      slug: string
      publishedAt?: string
    }>
    title?: string // Custom title for the section
  }
}

export type ContentBlock =
  | TextBlock
  | QuoteBlock
  | ImageBlock
  | VideoBlock
  | ImageWithTextBlock
  | BannerBlock
  | RelatedNewsBlock

// Article content structure (what goes into the content field)
export interface ArticleContent {
  blocks: ContentBlock[]
  version: string // For future compatibility
}

// Complete article data including content
export interface CompleteArticleData extends ArticleFormData {
  content: ArticleContent
}

// Gallery modal data types for image management
export interface GalleryImage {
  id: number
  url: string
  alt?: string
  caption?: string
  width: number
  height: number
  size: number
  createdAt: string
}

// Block editor context type
export interface BlockEditorContextType {
  blocks: ContentBlock[]
  addBlock: (type: BlockType, data?: Partial<ContentBlock>) => void
  updateBlock: (id: string, data: Partial<ContentBlock>) => void
  deleteBlock: (id: string) => void
  reorderBlocks: (fromIndex: number, toIndex: number) => void
  moveBlockUp: (id: string) => void
  moveBlockDown: (id: string) => void
  duplicateBlock: (id: string) => void
}

// Preview mode type
export type PreviewMode = 'desktop' | 'tablet' | 'mobile'

// Validation error type for blocks
export interface BlockValidationError {
  blockId: string
  field?: string
  message: string
}
