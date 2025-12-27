'use client'

import { Button } from '@/components/ui/button'
import { useBlockEditorStore } from '@/stores/block-editor-store'
import { ChevronDown, ChevronUp, Copy, GripVertical, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { TextBlock } from '../types'

const RichTextEditor = dynamic(
  () => import('../rich-text-editor').then((mod) => ({ default: mod.RichTextEditor })),
  {
    ssr: false
  }
)

interface TextBlockEditorProps {
  block: TextBlock
  isFirst?: boolean
  isLast?: boolean
}

export function TextBlockEditor({ block: initialBlock, isFirst, isLast }: TextBlockEditorProps) {
  const { blocks, updateBlock, deleteBlock, moveBlockUp, moveBlockDown, duplicateBlock } =
    useBlockEditorStore()

  // Get the current block data from the store
  const block = (blocks.find((b) => b.id === initialBlock.id) as TextBlock) || initialBlock

  const handleContentChange = (content: string) => {
    updateBlock(block.id, {
      data: { ...block.data, content }
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this text block?')) {
      deleteBlock(block.id)
    }
  }

  return (
    <div className='group relative border rounded-lg bg-card'>
      {/* Block Header */}
      <div className='flex items-center justify-between p-2 border-b bg-muted/50 rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab' />
          <span className='text-sm font-medium'>Text Block</span>
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
      <div className='p-4'>
        <RichTextEditor
          content={block.data.content}
          onChange={handleContentChange}
          placeholder='Start writing your content...'
          className='border-0'
        />
      </div>
    </div>
  )
}
