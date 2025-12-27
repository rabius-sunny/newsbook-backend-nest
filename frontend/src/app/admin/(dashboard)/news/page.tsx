'use client'

import { NewsFilter, Pagination, TableLoading } from '@/components/admin'
import { DataTable, type ActionItem, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import useAsync from '@/hooks/useAsync'
import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { Calendar, Edit, ExternalLink, Eye, FileText, Trash2, User } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type {
  ArticleListItem,
  TArticleQueryParams,
  TArticles,
  TCategoryTree
} from '../../../../../api-types'

// URL state configuration for search, filters, and pagination
// Using TArticleQueryParams as the source of truth for parameter types
const searchParamsConfig = {
  // Search
  q: parseAsString,

  // Filters - matching TArticleQueryParams exactly (using nullable parsers)
  status: parseAsString, // 'draft' | 'review' | 'published' | 'archived'
  published: parseAsString, // 'true' | 'false'
  featured: parseAsString, // 'true' | 'false'
  breaking: parseAsString, // 'true' | 'false'
  category: parseAsInteger, // Category ID filter
  author: parseAsInteger, // Author ID filter
  tags: parseAsString, // Comma-separated tag names

  // Date filters
  dateFrom: parseAsString, // Date format: YYYY-MM-DD
  dateTo: parseAsString, // Date format: YYYY-MM-DD

  // Pagination
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),

  // Sorting - matching TArticleQueryParams options exactly
  sortBy: parseAsString.withDefault('createdAt'), // 'publishedAt' | 'createdAt' | 'updatedAt' | 'title' | 'viewCount' | 'priority'
  sortOrder: parseAsString.withDefault('desc') // 'asc' | 'desc'
} satisfies Record<keyof Omit<TArticleQueryParams, 'q'>, any> & { q: any }

const getStatusBadge = (status: string) => {
  const variants = {
    published: 'default',
    draft: 'secondary',
    review: 'outline',
    archived: 'destructive'
  } as const

  const labels = {
    published: 'Published',
    draft: 'Draft',
    review: 'Under Review',
    archived: 'Archived'
  }

  return (
    <Badge
      className='pt-1 text-xs uppercase'
      variant={variants[status as keyof typeof variants] || 'secondary'}
    >
      {labels[status as keyof typeof labels] || status}
    </Badge>
  )
}

const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AllNews() {
  return (
    <Suspense fallback={<TableLoading columns={8} rows={8} />}>
      <AllNewsContent />
    </Suspense>
  )
}

function AllNewsContent() {
  // URL state management with nuqs
  const [searchParams, setSearchParams] = useQueryStates(searchParamsConfig)
  const { q, status, category, page, limit, sortBy, sortOrder } = searchParams

  // Local state for debounced search
  // Store selected category data for display purposes
  const [selectedCategoryData, setSelectedCategoryData] = useState<{
    name: string
    parentPath: string[]
  } | null>(null)

  // Handle search change with DebouncedInput
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchParams({ q: value || null, page: 1 })
    },
    [setSearchParams]
  )

  // Build API URL with search params using TArticleQueryParams structure
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams()

    // Add search query
    if (q) params.set('q', q)

    // Add pagination
    params.set('page', page.toString())
    params.set('limit', limit.toString())

    // Add sorting
    params.set('sortBy', sortBy)
    params.set('sortOrder', sortOrder)

    // Add status filter (single value)
    if (status) {
      params.set('status', status)
    }

    // Add category filter (single ID)
    if (category && category > 0) {
      params.set('category', category.toString())
    }

    // Add other filters from TArticleQueryParams if they exist
    if (searchParams.published) {
      params.set('published', searchParams.published)
    }
    if (searchParams.featured) {
      params.set('featured', searchParams.featured)
    }
    if (searchParams.breaking) {
      params.set('breaking', searchParams.breaking)
    }
    if (searchParams.author && searchParams.author > 0) {
      params.set('author', searchParams.author.toString())
    }
    if (searchParams.tags) {
      params.set('tags', searchParams.tags)
    }
    if (searchParams.dateFrom) {
      params.set('dateFrom', searchParams.dateFrom)
    }
    if (searchParams.dateTo) {
      params.set('dateTo', searchParams.dateTo)
    }

    return `/articles?${params.toString()}`
  }, [q, status, category, page, limit, sortBy, sortOrder, searchParams])

  // Fetch articles from API using useAsync hook
  const { data: articlesResponse, loading, error, mutate } = useAsync<TArticles>(apiUrl)

  // Fetch category tree (cached, won't refetch unnecessarily)
  const { data: categoryResponse, loading: categoriesLoading } = useAsync<TCategoryTree>(
    '/categories/hierarchy/tree'
  )

  const articles = useMemo(() => {
    return articlesResponse?.data?.articles || []
  }, [articlesResponse?.data?.articles])

  const categories = useMemo(() => {
    return categoryResponse?.data || []
  }, [categoryResponse?.data])

  const totalItems = articlesResponse?.data?.total || 0
  const totalPages = articlesResponse?.data?.totalPages || 1

  const columns: Column<ArticleListItem>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (_, item) => (
        <div className='max-w-xs'>
          <div className='font-medium line-clamp-2'>{item.title}</div>
          {item.excerpt && (
            <div className='mt-1 text-muted-foreground text-sm line-clamp-1'>{item.excerpt}</div>
          )}
          <div className='flex gap-2 mt-2'>
            {item.isFeatured && (
              <Badge variant='outline' className='text-xs'>
                Featured
              </Badge>
            )}
            {item.isBreaking && (
              <Badge variant='destructive' className='text-xs'>
                Breaking
              </Badge>
            )}
          </div>
        </div>
      ),
      className: 'min-w-[300px]'
    },
    {
      key: 'isPublished',
      label: 'Status',
      render: (_, item) => {
        let status = 'draft'
        if (item.isPublished) {
          status = 'published'
        }
        return getStatusBadge(status)
      }
    },
    {
      key: 'author',
      label: 'Author',
      render: (_, item) => (
        <div className='flex items-center gap-2'>
          <span className='font-medium text-xs uppercase'>
            {item.author?.name || 'Unknown Author'}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (_, item) => <Badge variant='outline'>{item.category?.name || 'No Category'}</Badge>
    },
    {
      key: 'stats',
      label: 'Statistics',
      render: (_, item) => (
        <div className='space-y-1 text-sm'>
          <div className='flex items-center gap-1'>
            <Eye className='w-3 h-3' />
            {item.viewCount || 0}
          </div>
          <div className='flex items-center gap-1'>
            <User className='w-3 h-3' />
            {item.commentCount || 0}
          </div>
        </div>
      )
    },
    {
      key: 'publishedAt',
      label: 'Published At',
      render: (_, item) => (
        <div className='space-y-1 text-sm'>
          {item.publishedAt ? (
            <div className='flex items-center gap-1'>
              <Calendar className='w-3 h-3' />
              {formatDate(item.publishedAt)}
            </div>
          ) : (
            <span className='text-muted-foreground'>Not published</span>
          )}
          {item.createdAt && (
            <div className='text-muted-foreground text-xs'>
              Created: {formatDate(item.createdAt)}
            </div>
          )}
        </div>
      ),
      className: 'min-w-[140px]'
    }
  ]

  const actions: ActionItem<ArticleListItem>[] = [
    {
      label: 'Preview',
      icon: <ExternalLink className='w-4 h-4' />,
      href: (item) => `/news/${item.slug}`,
      target: '_blank'
    },
    {
      label: 'Details',
      icon: <FileText className='w-4 h-4' />,
      href: (item) => `/admin/news/${item.slug}`
    },
    {
      label: 'Edit',
      icon: <Edit className='w-4 h-4' />,
      href: (item) => `/admin/news/${item.slug}/edit`
    },
    {
      label: 'Delete',
      icon: <Trash2 className='w-4 h-4' />,
      onClick: (item) => handleDelete(item?.id),
      variant: 'destructive',
      divider: true
    }
  ]

  // Calculate active filter count
  const activeFilterCount = (status ? 1 : 0) + (category ? 1 : 0) + (q ? 1 : 0)

  const handleDelete = async (newsId: number) => {
    try {
      const response = await requests.delete(`/articles/${newsId}`)
      if (response.success) {
        mutate()
        toast.success('Article deleted successfully!')
      } else {
        showError('Deleting failed')
      }
    } catch (error) {
      showError(error)
    }
  }

  // Handler functions for URL state updates (memoized to prevent re-renders)
  const handleStatusChange = useCallback(
    (statuses: string[]) => {
      // Handle toggle behavior: if no statuses selected, clear the filter
      // if one status selected, set it. The TableFilter component handles the toggle logic
      const selectedStatus = statuses.length > 0 ? statuses[0] : null
      setSearchParams({ status: selectedStatus, page: 1 }) // Reset to page 1 on filter change
    },
    [setSearchParams]
  )

  const handleCategoryChange = useCallback(
    (categoryId: number | null, categoryData?: { name: string; parentPath: string[] }) => {
      setSearchParams({ category: categoryId, page: 1 }) // Reset to page 1 on filter change
      setSelectedCategoryData(categoryData || null)
    },
    [setSearchParams]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams({ page: newPage })
    },
    [setSearchParams]
  )

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setSearchParams({ limit: newPageSize, page: 1 }) // Reset to page 1 when changing page size
    },
    [setSearchParams]
  )

  const handleClearAllFilters = useCallback(() => {
    setSearchParams({ q: null, status: null, category: null, page: 1 })
    setSelectedCategoryData(null)
  }, [setSearchParams])

  // Memoized filter component
  const filterComponent = useMemo(
    () => (
      <NewsFilter
        searchQuery={q}
        onSearchChange={handleSearchChange}
        selectedStatus={status}
        onStatusChange={handleStatusChange}
        selectedCategoryId={category}
        selectedCategoryData={selectedCategoryData}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onClearAll={handleClearAllFilters}
        activeFilterCount={activeFilterCount}
      />
    ),
    [
      q,
      handleSearchChange,
      status,
      handleStatusChange,
      category,
      selectedCategoryData,
      handleCategoryChange,
      categories,
      categoriesLoading,
      handleClearAllFilters,
      activeFilterCount
    ]
  )

  // Note: Removed loading state check here to keep filters always visible

  // Show error state
  if (error) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='font-bold text-2xl'>All News</h1>
          <p className='text-muted-foreground'>Manage and review all news articles</p>
        </div>

        {/* Filters - Always visible even on error */}
        {filterComponent}

        <div className='flex justify-center items-center h-64'>
          <div className='text-destructive'>
            Error loading articles: {error?.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-bold text-2xl'>All News</h1>
        <p className='text-muted-foreground'>Manage and review all news articles</p>
      </div>
      {/* Filters */}
      {filterComponent} {/* Data Table with conditional loading */}
      {loading ? (
        <TableLoading columns={6} rows={8} />
      ) : (
        <>
          <DataTable
            data={articles}
            columns={columns}
            actions={actions}
            emptyMessage='No news found'
            showSearch={false}
            showPagination={false}
          />
          {totalItems > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={limit}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              showFirstLast={true}
              showPageInfo={true}
            />
          )}
        </>
      )}
    </div>
  )
}
