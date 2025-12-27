'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { MoreHorizontal, Search } from 'lucide-react'
import Link from 'next/link'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

export interface ActionItem<T> {
  label: string
  icon?: React.ReactNode
  onClick?: (item: T) => void
  href?: (item: T) => string // For Next.js Link
  variant?: 'default' | 'destructive'
  divider?: boolean
  target?: '_blank' | '_self' // For external links
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: ActionItem<T>[]
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  // External search control
  searchValue?: string
  onSearchChange?: (value: string) => void
  // Pagination controls
  currentPage?: number
  totalPages?: number
  pageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  // Show additional controls
  showSearch?: boolean
  showPagination?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  className = '',
  searchValue = '',
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  showSearch = true,
  showPagination = false
}: DataTableProps<T>) {
  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item[column.key as keyof T], item)
    }
    return item[column.key as keyof T]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {showSearch && (
        <div className='relative max-w-sm'>
          <Search className='top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2' />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className='pl-10'
          />
        </div>
      )}

      {/* Table */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className='text-right'>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className='h-24 text-center'
                >
                  {searchValue ? 'No results found' : emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {getCellValue(item, column)}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='p-0 w-8 h-8' aria-label='Open menu'>
                            <MoreHorizontal className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {actions.map((action, actionIndex) => (
                            <div key={actionIndex}>
                              {action.divider && actionIndex > 0 && <DropdownMenuSeparator />}
                              {action.href ? (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={action.href(item)}
                                    target={action.target}
                                    className={
                                      action.variant === 'destructive' ? 'text-destructive' : ''
                                    }
                                  >
                                    <div className='flex items-center gap-2'>
                                      {action.icon && (
                                        <span className='w-4 h-4'>{action.icon}</span>
                                      )}
                                      {action.label}
                                    </div>
                                  </Link>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => action.onClick?.(item)}
                                  variant={action.variant}
                                >
                                  <div className='flex items-center gap-2'>
                                    {action.icon && <span className='w-4 h-4'>{action.icon}</span>}
                                    {action.label}
                                  </div>
                                </DropdownMenuItem>
                              )}
                            </div>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      {data.length > 0 && (
        <div className='text-muted-foreground text-sm'>
          {showPagination ? (
            <>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} result(s)
              {searchValue && ` for "${searchValue}"`}
            </>
          ) : (
            <>
              Showing {data.length} result(s)
              {searchValue && ` for "${searchValue}"`}
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className='flex justify-between items-center'>
          <div className='text-muted-foreground text-sm'>
            Page {currentPage} of {totalPages}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
