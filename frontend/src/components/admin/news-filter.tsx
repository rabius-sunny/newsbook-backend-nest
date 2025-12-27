'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import type { CategoryTreeNode } from '../../../api-types'
import { DebouncedInput } from '../common/debounced-input'
import { CategoryTreeDropdown } from './category-tree-dropdown'
import { TableFilters } from './table-filters'

// Filter options for the filter dropdowns (moved outside to prevent re-creation)
const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Under Review' },
  { value: 'archived', label: 'Archived' }
]

interface NewsFilterProps {
  // Search
  searchQuery?: string | null
  onSearchChange: (value: string) => void

  // Status filter
  selectedStatus?: string | null
  onStatusChange: (statuses: string[]) => void

  // Category filter
  selectedCategoryId?: number | null
  selectedCategoryData?: { name: string; parentPath: string[] } | null
  onCategoryChange: (
    categoryId: number | null,
    categoryData?: { name: string; parentPath: string[] }
  ) => void

  // Categories data
  categories: CategoryTreeNode[]
  categoriesLoading: boolean

  // Clear all
  onClearAll: () => void
  activeFilterCount: number
}

export function NewsFilter({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategoryId,
  selectedCategoryData,
  onCategoryChange,
  categories,
  categoriesLoading,
  onClearAll,
  activeFilterCount
}: NewsFilterProps) {
  // Memoized filter components to prevent unnecessary re-renders
  const statusFilterComponent = useMemo(
    () => (
      <TableFilters
        statusOptions={statusOptions}
        selectedStatuses={selectedStatus ? [selectedStatus] : []}
        onStatusChange={onStatusChange}
        statusMultiSelect={false}
      />
    ),
    [selectedStatus, onStatusChange]
  )

  const categoryFilterComponent = useMemo(
    () => (
      <CategoryTreeDropdown
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={onCategoryChange}
        categories={categories}
        loading={categoriesLoading}
      />
    ),
    [selectedCategoryId, onCategoryChange, categories, categoriesLoading]
  )

  // Individual filter clear handlers
  const handleClearSearch = useCallback(() => {
    onSearchChange('')
  }, [onSearchChange])

  const handleClearStatus = useCallback(() => {
    onStatusChange([])
  }, [onStatusChange])

  const handleClearCategory = useCallback(() => {
    onCategoryChange(null)
  }, [onCategoryChange])

  return (
    <div className='space-y-4'>
      {/* Filter Controls */}
      <div className='flex items-center gap-2 flex-wrap'>
        {/* Search Input */}
        <div className='relative min-w-[300px]'>
          <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <DebouncedInput
            placeholder='Search news...'
            value={searchQuery || ''}
            onChange={onSearchChange}
            delay={300}
            className='pl-8 h-8'
          />
        </div>

        {/* Status Filter */}
        {statusFilterComponent}

        {/* Category Filter */}
        {categoryFilterComponent}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Search Filter */}
          {searchQuery && (
            <Badge variant='outline' className='text-xs'>
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={handleClearSearch} className='ml-1 hover:bg-muted rounded-full'>
                <X className='h-2 w-2' />
              </button>
            </Badge>
          )}

          {/* Status Filter */}
          {selectedStatus && (
            <Badge variant='secondary' className='text-xs'>
              Status:{' '}
              {statusOptions.find((opt) => opt.value === selectedStatus)?.label || selectedStatus}
              <button
                onClick={handleClearStatus}
                className='ml-1 hover:bg-secondary-foreground/10 rounded-full'
              >
                <X className='h-2 w-2' />
              </button>
            </Badge>
          )}

          {/* Category Filter */}
          {selectedCategoryId && (
            <Badge variant='outline' className='text-xs'>
              Category:{' '}
              {selectedCategoryData
                ? selectedCategoryData.parentPath.length > 0
                  ? `${selectedCategoryData.parentPath.join(' > ')} > ${selectedCategoryData.name}`
                  : selectedCategoryData.name
                : `Category ${selectedCategoryId}`}
              <button onClick={handleClearCategory} className='ml-1 hover:bg-muted rounded-full'>
                <X className='h-2 w-2' />
              </button>
            </Badge>
          )}

          {/* Clear All Button */}
          <Button variant='ghost' size='sm' onClick={onClearAll} className='h-6 px-2 text-xs'>
            <X className='mr-1 h-3 w-3' />
            Clear All ({activeFilterCount})
          </Button>
        </div>
      )}
    </div>
  )
}
