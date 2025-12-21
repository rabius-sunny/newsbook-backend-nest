import type { z } from 'zod';
import type {
  advertisementCreateSchema,
  advertisementQuerySchema,
  advertisementUpdateSchema,
} from './advertisement.schema';

export type CreateAdvertisementDto = z.infer<typeof advertisementCreateSchema>;
export type UpdateAdvertisementDto = z.infer<typeof advertisementUpdateSchema>;
export type AdvertisementQueryDto = z.infer<typeof advertisementQuerySchema>;
