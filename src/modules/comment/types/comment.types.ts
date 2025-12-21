import type { Comment } from '@prisma/client';

// Comment with pagination info
export interface PaginatedComments {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Re-export Prisma types for convenience
export type { Comment };
