import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export interface TableLoadingProps {
  columns: number
  rows?: number
  className?: string
}

export function TableLoading({ columns, rows = 5, className = '' }: TableLoadingProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Skeleton */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className='h-4 w-20' />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className='h-4 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results Count Skeleton */}
      <Skeleton className='h-4 w-40' />
    </div>
  )
}

export interface PageLoadingProps {
  title: string
  description: string
  tableColumns: number
  tableRows?: number
  className?: string
}

export function PageLoading({
  title,
  description,
  tableColumns,
  tableRows = 5,
  className = ''
}: PageLoadingProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
      </div>

      {/* Table Loading */}
      <TableLoading columns={tableColumns} rows={tableRows} />
    </div>
  )
}
