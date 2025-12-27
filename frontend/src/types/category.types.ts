export interface CategoryTreeNode {
  id: number;
  name: string;
  image: string | null;
  slug: string;
  parentId: number | null;
  isActive: boolean;
  path: string | null;
  createdAt: string;
  children: CategoryTreeNode[];
}

export interface CategoryWithParent {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: number | null;
  displayOrder: number;
  isActive: boolean;
  path: string | null;
  names: Record<string, string> | null;
  descriptions: Record<string, string> | null;
  seo: Record<string, unknown> | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export interface CategoryWithArticleCount extends CategoryWithParent {
  articleCount: number;
}

// Alias for list item display
export type CategoryListItem = CategoryWithArticleCount;

// API Response types
export type TCategoryTree = {
  success: boolean;
  message: string;
  data: CategoryTreeNode[];
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TCategories = {
  success: boolean;
  message: string;
  data: {
    categories: CategoryWithArticleCount[];
    meta: PaginationMeta;
  };
};

// Query params for category filtering
export type TCategoryQueryParams = {
  q?: string | null;
  page?: number;
  limit?: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: number | null;
  displayOrder: number;
  isActive: boolean;
  path: string | null;
  names: Record<string, string> | null;
  descriptions: Record<string, string> | null;
  seo: Record<string, unknown> | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};
