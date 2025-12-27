'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useMemo } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showFirstLast?: boolean
  showPageInfo?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  showFirstLast = true,
  showPageInfo = true
}: PaginationProps) {
  // Calculate page numbers to display
  const pageNumbers = useMemo(() => {
    const delta = 2 // Number of pages to show on each side of current page
    const rangeWithDots = []

    // Always include first page
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    for (let i = start; i <= end; i++) {
      rangeWithDots.push(i)
    }

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((page, index, array) => {
      // Remove duplicates
      return array.indexOf(page) === index
    })
  }, [currentPage, totalPages])

  // Calculate display info
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const canGoToPrevious = currentPage > 1
  const canGoToNext = currentPage < totalPages

  return (
    <div className='flex items-center justify-between space-x-6 lg:space-x-8'>
      {/* Per Page Selector */}
      <div className='flex items-center space-x-2'>
        <p className='text-sm font-medium'>Rows per page</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent side='top'>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page Info */}
      {showPageInfo && (
        <div className='flex items-center space-x-2'>
          <p className='text-sm text-muted-foreground'>
            {totalItems === 0 ? 'No items' : `${startItem}-${endItem} of ${totalItems} items`}
          </p>
        </div>
      )}

      {/* Page Navigation */}
      <div className='flex items-center space-x-2'>
        {/* First Page */}
        {showFirstLast && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(1)}
            disabled={!canGoToPrevious}
            className='h-8 w-8 p-0'
          >
            <ChevronsLeft className='h-4 w-4' />
            <span className='sr-only'>Go to first page</span>
          </Button>
        )}

        {/* Previous Page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoToPrevious}
          className='h-8 w-8 p-0'
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Go to previous page</span>
        </Button>

        {/* Page Numbers */}
        <div className='flex items-center space-x-1'>
          {pageNumbers.map((pageNumber, index) => {
            if (pageNumber === '...') {
              return (
                <span key={`dots-${index}`} className='px-2 py-1 text-sm text-muted-foreground'>
                  ...
                </span>
              )
            }

            const isCurrentPage = pageNumber === currentPage

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? 'default' : 'outline'}
                size='sm'
                onClick={() => onPageChange(pageNumber as number)}
                className='h-8 w-8 p-0'
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        {/* Next Page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoToNext}
          className='h-8 w-8 p-0'
        >
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Go to next page</span>
        </Button>

        {/* Last Page */}
        {showFirstLast && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoToNext}
            className='h-8 w-8 p-0'
          >
            <ChevronsRight className='h-4 w-4' />
            <span className='sr-only'>Go to last page</span>
          </Button>
        )}
      </div>
    </div>
  )
}
