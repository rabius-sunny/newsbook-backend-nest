import type { Newsletter } from '@prisma/client';

export interface PaginatedNewsletters {
  newsletters: Newsletter[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type { Newsletter };
