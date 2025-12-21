export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<StructuredError>;
  meta?: PaginationMeta;
}

export type StructuredError = { field: string; message: string } | string;

export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<StructuredError>;
  meta?: PaginationMeta;
}
