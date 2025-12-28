// Author/User model type
export type Author = {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  role: 'admin' | 'editor' | 'reporter' | 'contributor' | 'author';
  isActive: boolean;
  meta: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

// Alias for User
export type User = Author;

// API Response types
export type TAuthorList = {
  success: boolean;
  message: string;
  data: Author[];
};

// Alias for backwards compatibility
export type Authors = TAuthorList;

export type TAuthorSingle = {
  success: boolean;
  message: string;
  data: Author;
};

export type TAuthorCreated = {
  success: boolean;
  message: string;
  data: Author;
};

export type TAuthorUpdated = {
  success: boolean;
  message: string;
  data: Author;
};

export type TAuthorDeleted = {
  success: boolean;
  message: string;
};

// Form input types
export type AuthorCreateInput = {
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'reporter' | 'contributor' | 'author';
  isActive?: boolean;
  meta?: Record<string, unknown>;
};

export type AuthorUpdateInput = Partial<Omit<AuthorCreateInput, 'email'>> & {
  password?: string; // Optional for updates
};
