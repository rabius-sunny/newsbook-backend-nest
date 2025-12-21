import type { Advertisement } from '@prisma/client';

export interface PaginatedAdvertisements {
  advertisements: Advertisement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type { Advertisement };
