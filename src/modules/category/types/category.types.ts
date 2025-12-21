import { Category } from '@prisma/client';

export interface CategoryWithParent extends Category {
  parent?: Pick<Category, 'id' | 'name' | 'slug'> | null;
}

export interface CategoryWithArticleCount extends CategoryWithParent {
  articleCount: number;
}

export interface CategoryTreeNode {
  id: number;
  name: string;
  image: string | null;
  slug: string;
  parentId: number | null;
  isActive: boolean;
  path: string | null;
  createdAt: Date;
  children: CategoryTreeNode[];
}
