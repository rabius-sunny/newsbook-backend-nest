export interface TablePaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export interface UseTablePaginationOptions {
  totalItems: number
  initialPageSize?: number
  initialPage?: number
}

export interface UseTablePaginationReturn {
  currentPage: number
  pageSize: number
  totalPages: number
  startIndex: number
  endIndex: number
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  setPageSize: (size: number) => void
  canGoNext: boolean
  canGoPrev: boolean
}
