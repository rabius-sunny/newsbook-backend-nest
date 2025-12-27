'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBlockEditorStore } from '@/stores/block-editor-store'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  GripVertical,
  Trash2,
  Video
} from 'lucide-react'
import { useState } from 'react'
import type { VideoBlock } from '../types'

interface VideoBlockEditorProps {
  block: VideoBlock // This will be the initial block, but we'll get current data from store
  isFirst?: boolean
  isLast?: boolean
}

export function VideoBlockEditor({ block: initialBlock, isFirst, isLast }: VideoBlockEditorProps) {
  const { blocks, updateBlock, deleteBlock, moveBlockUp, moveBlockDown, duplicateBlock } =
    useBlockEditorStore()

  // Get the current block data from the store
  const block = (blocks.find((b) => b.id === initialBlock.id) as VideoBlock) || initialBlock

  const [previewError, setPreviewError] = useState<string | null>(null)

  const handleDataChange = (value: string) => {
    // Get current block data from store to avoid stale data
    const currentBlock = blocks.find((b) => b.id === block.id) as VideoBlock
    const currentData = currentBlock?.data || block.data

    updateBlock(block.id, {
      data: { ...currentData, url: value }
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this video block?')) {
      deleteBlock(block.id)
    }
  }

  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    if (!url) return null

    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(youtubeRegex)
    return match ? match[1] : null
  }

  // Handle URL change
  const handleUrlChange = (url: string) => {
    handleDataChange(url)
    setPreviewError(null)
  }

  const videoId = getVideoId(block.data.url)

  return (
    <div className='group relative border rounded-lg bg-card'>
      {/* Block Header */}
      <div className='flex items-center justify-between p-2 border-b bg-muted/50 rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab' />
          <Video className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm font-medium'>Video Block</span>
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
        {/* Video URL Input */}
        <div>
          <Label htmlFor={`video-url-${block.id}`} className='text-sm font-medium'>
            Video URL *
          </Label>
          <Input
            id={`video-url-${block.id}`}
            placeholder='https://www.youtube.com/watch?v=...'
            defaultValue={block.data.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className='mt-1'
          />
          <p className='text-xs text-muted-foreground mt-1'>Supports YouTube URLs</p>
          {previewError && <p className='text-xs text-destructive mt-1'>{previewError}</p>}
        </div>

        {/* Video Preview */}
        {block.data.url && videoId ? (
          <div className='space-y-4'>
            {/* Real YouTube Iframe */}
            <div className='relative border rounded-lg overflow-hidden bg-muted/50'>
              <div className='aspect-video'>
                <iframe
                  width='100%'
                  height='100%'
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title='YouTube video player'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                  className='w-full h-full'
                />
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-2 pt-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  if (block.data.url) {
                    window.open(block.data.url, '_blank')
                  }
                }}
                disabled={!block.data.url}
              >
                <ExternalLink className='mr-2 h-3 w-3' />
                View Original
              </Button>
            </div>
          </div>
        ) : (
          /* Show empty state only when no URL */
          block.data.url && (
            <div className='p-4 text-center text-red-500'>
              <p className='text-sm'>Invalid YouTube URL</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
