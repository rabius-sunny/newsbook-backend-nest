import type { Gallery } from '@prisma/client';

export interface PaginatedGallery {
  items: Gallery[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type { Gallery };
