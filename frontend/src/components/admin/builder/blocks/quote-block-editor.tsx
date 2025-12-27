'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useBlockEditorStore } from '@/stores/block-editor-store'
import { ChevronDown, ChevronUp, Copy, GripVertical, Quote, Trash2 } from 'lucide-react'
import type { QuoteBlock } from '../types'

interface QuoteBlockEditorProps {
  block: QuoteBlock
  isFirst?: boolean
  isLast?: boolean
}

export function QuoteBlockEditor({ block: initialBlock, isFirst, isLast }: QuoteBlockEditorProps) {
  const { blocks, updateBlock, deleteBlock, moveBlockUp, moveBlockDown, duplicateBlock } =
    useBlockEditorStore()

  // Get the current block data from the store
  const block = (blocks.find((b) => b.id === initialBlock.id) as QuoteBlock) || initialBlock

  const handleDataChange = (field: keyof QuoteBlock['data'], value: string) => {
    updateBlock(block.id, {
      data: { ...block.data, [field]: value }
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quote block?')) {
      deleteBlock(block.id)
    }
  }

  return (
    <div className='group relative border rounded-lg bg-card'>
      {/* Block Header */}
      <div className='flex items-center justify-between p-2 border-b bg-muted/50 rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab' />
          <Quote className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm font-medium'>Quote Block</span>
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          {!isFirst && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => moveBlockUp(block.id)}
              className='h-7 w-7 p-0'
            >
              <ChevronUp className='h-3 w-3' />
            </Button>
          )}

          {!isLast && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => moveBlockDown(block.id)}
              className='h-7 w-7 p-0'
            >
              <ChevronDown className='h-3 w-3' />
            </Button>
          )}

          <Button
            variant='ghost'
            size='sm'
            onClick={() => duplicateBlock(block.id)}
            className='h-7 w-7 p-0'
          >
            <Copy className='h-3 w-3' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={handleDelete}
            className='h-7 w-7 p-0 text-destructive hover:text-destructive'
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </div>

      {/* Block Content */}
      <div className='p-4 space-y-4'>
        <div>
          <Label htmlFor={`quote-text-${block.id}`} className='text-sm font-medium'>
            Quote Text *
          </Label>
          <Textarea
            id={`quote-text-${block.id}`}
            placeholder='Enter the quote text...'
            defaultValue={block.data.text}
            onBlur={(e) => handleDataChange('text', e.target.value)}
            className='min-h-[100px] mt-1'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor={`quote-author-${block.id}`} className='text-sm font-medium'>
              Author
            </Label>
            <Input
              id={`quote-author-${block.id}`}
              placeholder='Author name'
              defaultValue={block.data.author || ''}
              onBlur={(e) => handleDataChange('author', e.target.value)}
              className='mt-1'
            />
          </div>

          <div>
            <Label htmlFor={`quote-designation-${block.id}`} className='text-sm font-medium'>
              Designation
            </Label>
            <Input
              id={`quote-designation-${block.id}`}
              placeholder='Author designation'
              defaultValue={block.data.designation || ''}
              onBlur={(e) => handleDataChange('designation', e.target.value)}
              className='mt-1'
            />
          </div>
        </div>

        {/* Preview */}
        {block.data.text && (
          <div className='mt-4 p-4 border-l-4 border-blue-500 bg-muted/50'>
            <blockquote className='text-lg italic text-muted-foreground'>
              &ldquo;{block.data.text}&rdquo;
            </blockquote>
            {(block.data.author || block.data.designation) && (
              <footer className='mt-2 text-sm'>
                — {block.data.author && <span className='font-medium'>{block.data.author}</span>}
                {block.data.author && block.data.designation && ', '}
                {block.data.designation && (
                  <span className='text-muted-foreground'>{block.data.designation}</span>
                )}
              </footer>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
