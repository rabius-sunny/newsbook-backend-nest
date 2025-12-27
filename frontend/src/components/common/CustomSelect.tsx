import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Option = {
  title: string
  value: string
  label?: string
  children?: Option[]
}

type CustomSelectProps = {
  name?: string
  placeholder?: string
  multiple?: boolean
  tree?: boolean
  value?: string | string[]
  onChange?: (val: any) => void
  defaultLabel?: string
  defaultValue?: Option[]
  returnFullData?: boolean
  searchMode?: 'server' | 'client' // 👈 NEW
  className?: string
  disabled?: boolean
}

export function CustomSelect({
  placeholder,
  multiple = false,
  tree = false,
  value,
  onChange,
  defaultLabel,
  returnFullData,
  defaultValue,
  searchMode = 'server',
  className,
  disabled
}: CustomSelectProps) {
  const [options, setOptions] = useState<Option[]>([])
  const [loading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // --- API Fetcher (server search) ---
  // const fetchOptions = debounce((_search: string) => {
  //   if (searchMode !== 'server') return
  //   setLoading(true)
  //   // TODO: use useAsync to get data and handle data and loading/error states
  //   // Implementation will be added when API integration is needed
  // }, 300)

  // --- Default label/value handling ---
  useEffect(() => {
    if (defaultLabel && value && !options.some((opt) => opt.value === value)) {
      setOptions((prev) => [
        { label: defaultLabel, title: defaultLabel, value: value as string },
        ...prev
      ])
    }
  }, [defaultLabel, value, options])

  useEffect(() => {
    if (defaultValue?.length) {
      setOptions(defaultValue)
    }
  }, [defaultValue])

  // Filter options for client-side search
  const filteredOptions =
    searchMode === 'client' && searchValue
      ? options.filter(
          (opt) =>
            opt.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
            opt.label?.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options

  const handleValueChange = (selectedValue: string) => {
    if (!onChange) return

    const selectedOption = options.find((opt) => opt.value === selectedValue)

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue]

      const selectedOptions = options.filter((opt) => newValues.includes(opt.value))
      onChange(returnFullData ? selectedOptions : newValues)
    } else {
      onChange(returnFullData ? selectedOption : selectedValue)
    }

    if (!multiple) {
      setIsOpen(false)
    }
  }

  // For tree select, we'll create a simple hierarchical display
  if (tree) {
    return (
      <TreeSelectComponent
        options={filteredOptions}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        loading={loading}
        onSearch={searchMode === 'server' ? undefined : setSearchValue}
        multiple={multiple}
        disabled={disabled}
        className={className}
      />
    )
  }

  // Regular select with multiple support
  if (multiple) {
    return (
      <MultiSelectComponent
        options={filteredOptions}
        value={Array.isArray(value) ? value : []}
        onChange={handleValueChange}
        placeholder={placeholder}
        loading={loading}
        onSearch={searchMode === 'server' ? undefined : setSearchValue}
        disabled={disabled}
        className={className}
      />
    )
  }

  // Single select
  return (
    <Select
      value={Array.isArray(value) ? value[0] : value}
      onValueChange={handleValueChange}
      disabled={disabled}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {searchMode === 'client' && (
          <div className='p-2'>
            <Input
              placeholder='Search...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className='h-8'
            />
          </div>
        )}
        {loading ? (
          <div className='p-4'>
            <Skeleton className='w-full h-4' />
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className='p-4 text-muted-foreground text-sm text-center'>No options found</div>
        ) : (
          filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label || option.title}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

// Multi-select component with badges
function MultiSelectComponent({
  options,
  value,
  onChange,
  placeholder,
  loading,
  onSearch,
  disabled,
  className
}: {
  options: Option[]
  value: string[]
  onChange: (val: string) => void
  placeholder?: string
  loading: boolean
  onSearch?: (search: string) => void
  disabled?: boolean
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  const handleRemove = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(valueToRemove)
  }

  return (
    <div className={cn('relative', className)}>
      <Select open={isOpen} onOpenChange={setIsOpen} disabled={disabled}>
        <SelectTrigger className='flex flex-wrap gap-1 p-1 min-h-9'>
          <div className='flex flex-wrap flex-1 gap-1'>
            {selectedOptions.map((option) => (
              <Badge key={option.value} variant='secondary' className='text-xs'>
                {option.label || option.title}
                <button
                  type='button'
                  onClick={(e) => handleRemove(option.value, e)}
                  className='hover:bg-muted ml-1 p-0.5 rounded-full'
                >
                  <X className='w-3 h-3' />
                </button>
              </Badge>
            ))}
            {selectedOptions.length === 0 && (
              <span className='pl-2 text-muted-foreground text-sm'>{placeholder}</span>
            )}
          </div>
          <ChevronDown className='opacity-50 w-4 h-4 shrink-0' />
        </SelectTrigger>
        <SelectContent>
          {onSearch && (
            <div className='p-2'>
              <Input
                placeholder='Search...'
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                  onSearch(e.target.value)
                }}
                className='h-8'
              />
            </div>
          )}
          {loading ? (
            <div className='p-4'>
              <Skeleton className='w-full h-4' />
            </div>
          ) : options.length === 0 ? (
            <div className='p-4 text-muted-foreground text-sm text-center'>No options found</div>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                onSelect={() => onChange(option.value)}
                className='cursor-pointer'
              >
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={value.includes(option.value)}
                    onChange={() => {}}
                    className='rounded'
                  />
                  <span>{option.label || option.title}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

// Tree select component
function TreeSelectComponent({
  options,
  value,
  onChange,
  placeholder,
  loading,
  onSearch,
  multiple,
  disabled,
  className
}: {
  options: Option[]
  value: string | string[] | undefined
  onChange?: (val: any) => void
  placeholder?: string
  loading: boolean
  onSearch?: (search: string) => void
  multiple?: boolean
  disabled?: boolean
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const renderTreeNode = (option: Option, level = 0) => {
    const hasChildren = option.children && option.children.length > 0
    const isExpanded = expandedNodes.has(option.value)
    const isSelected = multiple
      ? Array.isArray(value) && value.includes(option.value)
      : value === option.value

    return (
      <div key={option.value}>
        <div
          className={cn(
            'flex items-center gap-2 hover:bg-accent px-2 py-1 cursor-pointer',
            isSelected && 'bg-accent'
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              const newExpanded = new Set(expandedNodes)
              if (isExpanded) {
                newExpanded.delete(option.value)
              } else {
                newExpanded.add(option.value)
              }
              setExpandedNodes(newExpanded)
            }
            onChange?.(option.value)
          }}
        >
          {hasChildren && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                const newExpanded = new Set(expandedNodes)
                if (isExpanded) {
                  newExpanded.delete(option.value)
                } else {
                  newExpanded.add(option.value)
                }
                setExpandedNodes(newExpanded)
              }}
            >
              {isExpanded ? (
                <ChevronDown className='w-4 h-4' />
              ) : (
                <ChevronRight className='w-4 h-4' />
              )}
            </button>
          )}
          {multiple && (
            <input type='checkbox' checked={isSelected} onChange={() => {}} className='rounded' />
          )}
          <span className='text-sm'>{option.label || option.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>{option.children!.map((child) => renderTreeNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <Select open={isOpen} onOpenChange={setIsOpen} disabled={disabled}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className='p-0'>
        {onSearch && (
          <div className='p-2 border-b'>
            <Input
              placeholder='Search...'
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                onSearch(e.target.value)
              }}
              className='h-8'
            />
          </div>
        )}
        <div className='max-h-64 overflow-auto'>
          {loading ? (
            <div className='p-4'>
              <Skeleton className='w-full h-4' />
            </div>
          ) : options.length === 0 ? (
            <div className='p-4 text-muted-foreground text-sm text-center'>No options found</div>
          ) : (
            options.map((option) => renderTreeNode(option))
          )}
        </div>
      </SelectContent>
    </Select>
  )
}
