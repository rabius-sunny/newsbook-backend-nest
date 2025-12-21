import { z } from 'zod';
import {
  languageCreateSchema,
  languageUpdateSchema,
  languageQuerySchema,
} from './language.schema';

export type CreateLanguageDto = z.infer<typeof languageCreateSchema>;
export type UpdateLanguageDto = z.infer<typeof languageUpdateSchema>;
export type LanguageQueryDto = z.infer<typeof languageQuerySchema>;
