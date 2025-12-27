'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useCallback } from 'react'
import { DebouncedInput } from '../common/debounced-input'

interface CategoryFilterProps {
  // Search
  searchQuery: string | null
  onSearchChange: (value: string) => void

  // Clear all filters
  onClearAllFilters: () => void

  // Active filter count for display
  activeFilterCount: number
}

export function CategoryFilter({
  searchQuery,
  onSearchChange,
  onClearAllFilters,
  activeFilterCount
}: CategoryFilterProps) {
  // Clear individual search filter
  const handleClearSearch = useCallback(() => {
    onSearchChange('')
  }, [onSearchChange])

  return (
    <div className='space-y-4'>
      {/* Filter Controls */}
      <div className='flex flex-wrap justify-between items-center gap-2'>
        {/* Search Input */}
        <div className='relative min-w-[300px]'>
          <Search className='top-1/2 left-2 absolute w-4 h-4 text-muted-foreground -translate-y-1/2' />
          <DebouncedInput
            placeholder='Search categories...'
            value={searchQuery || ''}
            onChange={onSearchChange}
            className='pl-8 h-8'
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          {/* Search Filter */}
          {searchQuery && (
            <Badge variant='outline' className='text-xs'>
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={handleClearSearch} className='hover:bg-muted ml-1 rounded-full'>
                <X className='w-2 h-2' />
              </button>
            </Badge>
          )}

          {/* Clear All Button */}
          <Button
            variant='ghost'
            size='sm'
            onClick={onClearAllFilters}
            className='px-2 h-6 text-xs'
          >
            <X className='mr-1 w-3 h-3' />
            Clear All ({activeFilterCount})
          </Button>
        </div>
      )}
    </div>
  )
}
