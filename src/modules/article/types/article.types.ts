import type {
  Article,
  ArticleTag,
  ArticleTranslation,
  Category,
  Tag,
  User,
} from '@prisma/client';

// Simplified category for article list
export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
}

// Simplified author for article list
export interface ArticleAuthor {
  id: number;
  name: string;
  avatar: string | null;
}

// Simplified author for article detail
export interface ArticleAuthorDetail {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  role: string;
  createdAt: Date;
}

// Simplified tag for article list
export interface ArticleTagItem {
  id: number;
  name: string;
  slug: string;
}

// Simplified tag for article detail
export interface ArticleTagDetail {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date | null;
}

// Article list item (simplified for performance)
export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  imageCaption: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  isFeatured: boolean;
  isBreaking: boolean;
  priority: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: ArticleCategory | null;
  author: ArticleAuthor | null;
  tags: ArticleTagItem[];
}

// Available language info for translations
export interface AvailableLanguage {
  code: string;
  isOriginal: boolean;
}

// Article with all relations (full detail)
export interface ArticleWithRelations extends Article {
  category: Category | null;
  author: ArticleAuthorDetail | null;
  tags: ArticleTagDetail[];
  _count: {
    comments: number;
    views: number;
  };
}

// Article with translation info
export interface ArticleWithTranslations extends ArticleWithRelations {
  requestedLanguage?: string;
  availableLanguages?: AvailableLanguage[];
  isTranslation?: boolean;
}

// Article filters for querying
export interface ArticleFilters {
  query?: string;
  categoryId?: number;
  authorId?: number;
  status?: 'draft' | 'review' | 'published' | 'archived';
  isPublished?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  dateFrom?: string;
  dateTo?: string;
  tags?: number[];
  sortBy?:
    | 'publishedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'title'
    | 'viewCount'
    | 'priority';
  sortOrder?: 'asc' | 'desc';
}

// Paginated article list response
export interface PaginatedArticles {
  articles: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Re-export Prisma types for convenience
export type { Article, ArticleTag, ArticleTranslation, Category, Tag, User };
