import { Tag } from '@prisma/client';

export interface TagWithArticleCount extends Tag {
  articleCount: number;
}
