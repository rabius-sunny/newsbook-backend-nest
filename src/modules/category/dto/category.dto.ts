import { z } from 'zod';
import {
  categoryCreateSchema,
  categoryQuerySchema,
  categoryUpdateSchema,
} from './category.schema';

export type CreateCategoryDto = z.infer<typeof categoryCreateSchema>;
export type UpdateCategoryDto = z.infer<typeof categoryUpdateSchema>;
export type CategoryQueryDto = z.infer<typeof categoryQuerySchema>;
