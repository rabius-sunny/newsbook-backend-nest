'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Filter, Folder, FolderOpen, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CategoryTreeNode } from '../../../api-types'

interface CategoryTreeDropdownProps {
  selectedCategoryId?: number | null
  onCategoryChange: (
    categoryId: number | null,
    categoryData?: { name: string; parentPath: string[] }
  ) => void
  categories: CategoryTreeNode[] // Pass categories as props instead of fetching internally
  loading?: boolean // Pass loading state
  className?: string
}

interface FlatCategory extends CategoryTreeNode {
  level: number
  parentPath: string[]
}

export function CategoryTreeDropdown({
  selectedCategoryId,
  onCategoryChange,
  categories,
  loading = false,
  className
}: CategoryTreeDropdownProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Use a small delay to ensure the dropdown is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Flatten categories for easier searching and display
  const flatCategories = useMemo(() => {
    const flatten = (
      cats: CategoryTreeNode[],
      level = 0,
      parentPath: string[] = []
    ): FlatCategory[] => {
      return cats.reduce<FlatCategory[]>((acc, cat) => {
        const currentPath = [...parentPath, cat.name]
        acc.push({
          ...cat,
          level,
          parentPath
        })
        if (cat.children && cat.children.length > 0) {
          acc.push(...flatten(cat.children, level + 1, currentPath))
        }
        return acc
      }, [])
    }
    return flatten(categories)
  }, [categories])

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return flatCategories
    }

    const term = searchTerm.toLowerCase()
    return flatCategories.filter((cat) => {
      // Search in category name
      if (cat.name.toLowerCase().includes(term)) {
        return true
      }
      // Search in parent path
      return cat.parentPath.some((parent) => parent.toLowerCase().includes(term))
    })
  }, [flatCategories, searchTerm])

  // Auto-expand parent categories when searching
  useMemo(() => {
    if (searchTerm.trim()) {
      const expandedIds = new Set<number>()
      filteredCategories.forEach((cat) => {
        if (cat.level > 0) {
          // Find and expand all parent categories
          let currentLevel = cat.level - 1
          let parentId = cat.parentId
          while (parentId && currentLevel >= 0) {
            expandedIds.add(parentId)
            const parent = flatCategories.find((c) => c.id === parentId)
            parentId = parent?.parentId || null
            currentLevel--
          }
        }
      })
      setExpandedCategories(expandedIds)
    }
  }, [searchTerm, filteredCategories, flatCategories])

  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategoryId === categoryId) {
      // Deselecting
      onCategoryChange(null)
    } else {
      // Selecting - find category data and pass it
      const selectedCategory = flatCategories.find((cat) => cat.id === categoryId)
      const categoryData = selectedCategory
        ? {
            name: selectedCategory.name,
            parentPath: selectedCategory.parentPath
          }
        : undefined
      onCategoryChange(categoryId, categoryData)
    }
    setIsOpen(false)
    setSearchTerm('')
  }

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // Group categories by their visibility (parent-child relationships)
  const displayCategories = useMemo(() => {
    if (searchTerm.trim()) {
      // When searching, show all matching categories
      return filteredCategories
    }

    // When not searching, respect the expanded state
    return flatCategories.filter((cat) => {
      if (cat.level === 0) return true // Always show root categories

      // Check if all parent categories are expanded
      let currentParentId = cat.parentId
      while (currentParentId) {
        if (!expandedCategories.has(currentParentId)) {
          return false
        }
        const parent = flatCategories.find((c) => c.id === currentParentId)
        currentParentId = parent?.parentId || null
      }
      return true
    })
  }, [filteredCategories, flatCategories, searchTerm, expandedCategories])

  const renderCategoryItem = (category: FlatCategory) => {
    const isSelected = selectedCategoryId === category.id
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const indentLevel = searchTerm.trim() ? 0 : category.level

    return (
      <div key={category.id} className='w-full'>
        <div
          className={cn(
            'flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm',
            isSelected && 'bg-accent text-accent-foreground',
            'group'
          )}
          style={{ paddingLeft: `${8 + indentLevel * 16}px` }}
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            {hasChildren && !searchTerm.trim() && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpanded(category.id)
                }}
                className='p-0.5 hover:bg-muted rounded-sm flex-shrink-0'
              >
                {isExpanded ? (
                  <ChevronDown className='h-3 w-3' />
                ) : (
                  <ChevronRight className='h-3 w-3' />
                )}
              </button>
            )}

            {!hasChildren && !searchTerm.trim() && <div className='w-4 flex-shrink-0' />}

            <div className='flex items-center gap-1.5 flex-1 min-w-0'>
              {hasChildren ? (
                isExpanded && !searchTerm.trim() ? (
                  <FolderOpen className='h-3.5 w-3.5 text-blue-500 flex-shrink-0' />
                ) : (
                  <Folder className='h-3.5 w-3.5 text-blue-600 flex-shrink-0' />
                )
              ) : (
                <div className='h-3.5 w-3.5 rounded-sm bg-muted flex-shrink-0' />
              )}

              <div className='flex-1 min-w-0'>
                <div className='truncate font-medium'>{category.name}</div>
                {searchTerm.trim() && category.parentPath.length > 0 && (
                  <div className='text-xs text-muted-foreground truncate'>
                    {category.parentPath.join(' > ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isSelected && (
            <div className='ml-2 p-1 flex-shrink-0'>
              <X className='h-3 w-3 text-muted-foreground' />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='h-8'>
            <Filter className='mr-2 h-3 w-3' />
            Category
            {selectedCategoryId && (
              <Badge variant='secondary' className='ml-2 h-5 px-1 text-xs'>
                1
              </Badge>
            )}
            <ChevronDown className='ml-2 h-3 w-3' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-80'>
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Search Input */}
          <div className='p-2'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                ref={searchInputRef}
                placeholder='Search categories...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8 h-8'
              />
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Categories List */}
          <div className='max-h-64 overflow-y-auto'>
            {loading ? (
              <div className='p-4 text-center text-sm text-muted-foreground'>
                Loading categories...
              </div>
            ) : displayCategories.length === 0 ? (
              <div className='p-4 text-center text-sm text-muted-foreground'>
                {searchTerm.trim() ? 'No categories found' : 'No categories available'}
              </div>
            ) : (
              displayCategories.map(renderCategoryItem)
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
