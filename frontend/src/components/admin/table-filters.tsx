'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Filter } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface TableFiltersProps {
  // Status filter
  statusOptions: FilterOption[]
  selectedStatuses: string[]
  onStatusChange: (statuses: string[]) => void
  statusMultiSelect?: boolean // Add option for single vs multi-select
}

export function TableFilters({
  statusOptions,
  selectedStatuses,
  onStatusChange,
  statusMultiSelect = false
}: TableFiltersProps) {
  const handleStatusToggle = (status: string) => {
    if (statusMultiSelect) {
      // Multi-select behavior
      const newStatuses = selectedStatuses.includes(status)
        ? selectedStatuses.filter((s) => s !== status)
        : [...selectedStatuses, status]
      onStatusChange(newStatuses)
    } else {
      // Single-select behavior
      const newStatuses = selectedStatuses.includes(status) ? [] : [status]
      onStatusChange(newStatuses)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='h-8'>
          <Filter className='mr-2 h-3 w-3' />
          Status
          {selectedStatuses.length > 0 && (
            <Badge variant='secondary' className='ml-2 h-5 px-1 text-xs'>
              {selectedStatuses.length}
            </Badge>
          )}
          <ChevronDown className='ml-2 h-3 w-3' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-48'>
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedStatuses.includes(option.value)}
            onCheckedChange={() => handleStatusToggle(option.value)}
          >
            <div className='flex items-center justify-between w-full'>
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span className='text-xs text-muted-foreground'>({option.count})</span>
              )}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
