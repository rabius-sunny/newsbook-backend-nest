'use client';

import { CategoryFilter, Pagination, TableLoading } from '@/components/admin';
import {
  DataTable,
  type ActionItem,
  type Column,
} from '@/components/admin/data-table';
import CustomImage from '@/components/common/CustomImage';
import PageHeader from '@/components/frontend/page-layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useAsync from '@/hooks/useAsync';
import { showError } from '@/lib/errMsg';
import { defaultImg } from '@/lib/get-image-url';
import requests from '@/services/network/http';
import type {
  CategoryListItem,
  TCategories,
  TCategoryQueryParams,
} from '@/types/category.types';
import { Calendar, Edit, Eye, FolderOpen, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Suspense, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

// URL state configuration for search, filters, and pagination
// Using TCategoryQueryParams as the source of truth for parameter types
const searchParamsConfig = {
  // Search
  q: parseAsString,

  // Pagination
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
} satisfies Record<keyof TCategoryQueryParams, any>;

const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadge = (isActive: boolean | null) => {
  if (isActive === null) return <Badge variant="outline">Unknown</Badge>;

  return (
    <Badge
      className="pt-1 text-xs uppercase"
      variant={isActive ? 'default' : 'secondary'}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

const getCategoryPath = (category: CategoryListItem) => {
  if (!category.parent) return category.name;
  return `${category.parent.name} > ${category.name}`;
};

function CategoriesContent() {
  // URL state management with nuqs
  const [searchParams, setSearchParams] = useQueryStates(searchParamsConfig);
  const { q, page, limit } = searchParams;

  // Handle search change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchParams({ q: value || null, page: 1 });
    },
    [setSearchParams],
  );

  // Build API URL with search params using TCategoryQueryParams structure
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();

    // Add search query
    if (q) params.set('q', q);

    // Add pagination
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    return `/admin/categories?${params.toString()}`;
  }, [q, page, limit]);

  // Fetch categories from API using useAsync hook
  const {
    data: categoriesResponse,
    loading,
    error,
    mutate,
  } = useAsync<TCategories>(apiUrl);

  const categories = useMemo(() => {
    return categoriesResponse?.data?.categories || [];
  }, [categoriesResponse?.data?.categories]);

  const meta = categoriesResponse?.data?.meta;
  const totalItems = meta?.total || 0;
  const totalPages = meta?.totalPages || 1;

  const columns: Column<CategoryListItem>[] = [
    {
      key: 'name',
      label: 'Category',
      render: (_, item) => (
        <div className="flex items-center gap-3 max-w-xs">
          {item.image && (
            <CustomImage
              src={item.image}
              alt={item.name}
              width={40}
              height={40}
              className="rounded-lg w-12 h-12 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultImg({ width: 40, height: 40 });
              }}
            />
          )}
          <div>
            <div className="font-medium line-clamp-1">{item.name}</div>
            <div className="text-muted-foreground text-sm line-clamp-1">
              {getCategoryPath(item)}
            </div>
            <div className="text-muted-foreground text-xs">/{item.slug}</div>
          </div>
        </div>
      ),
      className: 'min-w-[280px]',
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (_, item) => getStatusBadge(item.isActive),
    },
    {
      key: 'parent',
      label: 'Parent Category',
      render: (_, item) => (
        <div className="text-sm">
          {item.parent ? (
            <div className="flex items-center gap-1">
              <span>{item.parent.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Root Category</span>
          )}
        </div>
      ),
    },
    {
      key: 'articleCount',
      label: 'Articles',
      render: (_, item) => (
        <div className="flex items-center gap-1 text-sm">
          <Eye className="w-3 h-3" />
          {item.articleCount}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (_, item) => (
        <div className="text-sm">
          {item.createdAt ? (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(item.createdAt)}
            </div>
          ) : (
            <span className="text-muted-foreground">Unknown</span>
          )}
        </div>
      ),
      className: 'min-w-[140px]',
    },
  ];

  const actions: ActionItem<CategoryListItem>[] = [
    {
      label: 'Details',
      icon: <FolderOpen className="w-4 h-4" />,
      href: (item) => `/admin/categories/${item.id}`,
    },
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      href: (item) => `/admin/categories/${item.id}/edit`,
    },
    // {
    //   label: 'View Articles',
    //   icon: <FileText className='w-4 h-4' />,
    //   onClick: (item) => {
    //     console.log('View articles for category:', item)
    //     // Navigate to articles filtered by this category
    //   }
    // },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item) => handleDelete(item.id),
      variant: 'destructive',
      divider: true,
    },
  ];

  // Calculate active filter count
  const activeFilterCount = q ? 1 : 0;

  // Handle delete category
  const handleDelete = async (categoryId: number) => {
    try {
      const response = await requests.delete(`/admin/categories/${categoryId}`);
      if (response.success) {
        mutate();
        toast.success('Category deleted successfully!');
      } else {
        showError('Deleting failed');
      }
    } catch (error) {
      showError(error);
    }
  };
  // Handler functions for URL state updates (memoized to prevent re-renders)
  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams({ page: newPage });
    },
    [setSearchParams],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setSearchParams({ limit: newPageSize, page: 1 }); // Reset to page 1 when changing page size
    },
    [setSearchParams],
  );

  const handleClearAllFilters = useCallback(() => {
    setSearchParams({ q: null, page: 1 });
  }, [setSearchParams]);

  // Simplified filter component for categories (only search)
  const filterComponent = useMemo(
    () => (
      <CategoryFilter
        searchQuery={q}
        onSearchChange={handleSearchChange}
        onClearAllFilters={handleClearAllFilters}
        activeFilterCount={activeFilterCount}
      />
    ),
    [q, handleSearchChange, handleClearAllFilters, activeFilterCount],
  );

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Categories"
          subTitle="Manage and organize content categories"
          extra={
            <Link href="/admin/categories/create">
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                Add Category
              </Button>
            </Link>
          }
        />

        {/* Filters - Always visible even on error */}
        {filterComponent}

        <div className="flex justify-center items-center h-64">
          <div className="text-destructive">
            Error loading categories: {error?.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subTitle="Manage and organize content categories"
        extra={
          <Link href="/admin/categories/create">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </Link>
        }
      />
      {/* Filters */}
      {filterComponent}

      {/* Data Table with conditional loading */}
      {loading ? (
        <TableLoading columns={6} rows={8} />
      ) : (
        <>
          <DataTable
            data={categories}
            columns={columns}
            actions={actions}
            emptyMessage="No categories found"
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
  );
}

export default function Categories() {
  return (
    <Suspense fallback={<TableLoading columns={6} rows={8} />}>
      <CategoriesContent />
    </Suspense>
  );
}
