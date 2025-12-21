import type { z } from 'zod';
import type {
  articleCreateSchema,
  articleQuerySchema,
  articleTranslationCreateSchema,
  articleTranslationUpdateSchema,
  articleUpdateSchema,
} from './article.schema';

export type CreateArticleDto = z.infer<typeof articleCreateSchema>;
export type UpdateArticleDto = z.infer<typeof articleUpdateSchema>;
export type ArticleQueryDto = z.infer<typeof articleQuerySchema>;
export type CreateArticleTranslationDto = z.infer<
  typeof articleTranslationCreateSchema
>;
export type UpdateArticleTranslationDto = z.infer<
  typeof articleTranslationUpdateSchema
>;
