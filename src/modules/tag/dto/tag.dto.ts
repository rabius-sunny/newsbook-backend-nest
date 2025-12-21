import { z } from 'zod';
import { tagCreateSchema, tagQuerySchema, tagUpdateSchema } from './tag.schema';

export type CreateTagDto = z.infer<typeof tagCreateSchema>;
export type UpdateTagDto = z.infer<typeof tagUpdateSchema>;
export type TagQueryDto = z.infer<typeof tagQuerySchema>;
