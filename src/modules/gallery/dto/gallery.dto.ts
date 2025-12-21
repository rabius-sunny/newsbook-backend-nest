import type { z } from 'zod';
import type { galleryCreateSchema, galleryQuerySchema } from './gallery.schema';

export type CreateGalleryDto = z.infer<typeof galleryCreateSchema>;
export type GalleryQueryDto = z.infer<typeof galleryQuerySchema>;
