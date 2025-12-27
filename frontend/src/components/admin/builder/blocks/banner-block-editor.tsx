'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBlockEditorStore } from '@/stores/block-editor-store'
import { useUploadSessionStore } from '@/stores/upload-session-store'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  GripVertical,
  Image as ImageIcon,
  Megaphone,
  Trash2,
  X
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { BannerBlock } from '../types'

interface BannerBlockEditorProps {
  block: BannerBlock // This will be the initial block, but we'll get current data from store
  isFirst?: boolean
  isLast?: boolean
}

export function BannerBlockEditor({
  block: initialBlock,
  isFirst,
  isLast
}: BannerBlockEditorProps) {
  const { blocks, updateBlock, deleteBlock, moveBlockUp, moveBlockDown, duplicateBlock } =
    useBlockEditorStore()
  const { sessionImages } = useUploadSessionStore()

  // Get the current block data from the store
  const block = (blocks.find((b) => b.id === initialBlock.id) as BannerBlock) || initialBlock

  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const handleDataChange = (field: keyof BannerBlock['data'], value: string | undefined) => {
    // Get current block data from store to avoid stale data
    const currentBlock = blocks.find((b) => b.id === block.id) as BannerBlock
    const currentData = currentBlock?.data || block.data

    updateBlock(block.id, {
      data: { ...currentData, [field]: value }
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this banner block?')) {
      deleteBlock(block.id)
    }
  }

  const handleImageSelect = (imageUrl: string) => {
    // Get current block data from store to avoid stale data
    const currentBlock = blocks.find((b) => b.id === block.id) as BannerBlock
    const currentData = currentBlock?.data || block.data

    // Update imageUrl
    updateBlock(block.id, {
      data: {
        ...currentData,
        imageUrl: imageUrl
      }
    })

    setIsGalleryOpen(false)
  }

  const removeImage = () => {
    // Get current block data from store to avoid stale data
    const currentBlock = blocks.find((b) => b.id === block.id) as BannerBlock
    const currentData = currentBlock?.data || block.data

    updateBlock(block.id, {
      data: {
        ...currentData,
        imageUrl: ''
      }
    })
  }

  return (
    <div className='group relative border rounded-lg bg-card'>
      {/* Block Header */}
      <div className='flex items-center justify-between p-2 border-b bg-muted/50 rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab' />
          <Megaphone className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm font-medium'>Banner Block</span>
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
        {/* Banner Image Selection */}
        {!block.data.imageUrl ? (
          <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8'>
            <div className='text-center space-y-4'>
              <Megaphone className='mx-auto h-12 w-12 text-muted-foreground/50' />
              <div>
                <h3 className='text-lg font-medium'>Add a banner image</h3>
                <p className='text-sm text-muted-foreground'>Select an image from your gallery</p>
              </div>

              <Button variant='outline' onClick={() => setIsGalleryOpen(true)}>
                <ImageIcon className='mr-2 h-4 w-4' />
                Select from Gallery
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Banner Preview */}
            <div className='relative'>
              <div className='relative w-full h-48 rounded-lg border overflow-hidden'>
                <Image src={block.data.imageUrl} alt='Banner image' fill className='object-cover' />
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={removeImage}
                  className='absolute top-2 right-2 h-8 w-8 p-0'
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>

              {/* Banner Link Overlay */}
              {block.data.linkUrl && (
                <div className='absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1'>
                  <ExternalLink className='h-3 w-3' />
                  Link: {block.data.linkUrl}
                </div>
              )}
            </div>

            {/* Banner Settings */}
            <div className='space-y-4'>
              <div>
                <Label htmlFor={`banner-link-${block.id}`} className='text-sm font-medium'>
                  Link URL (Optional)
                </Label>
                <Input
                  id={`banner-link-${block.id}`}
                  placeholder='https://example.com'
                  defaultValue={block.data.linkUrl || ''}
                  onBlur={(e) => handleDataChange('linkUrl', e.target.value)}
                  className='mt-1'
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Banner will be clickable if URL is provided
                </p>
              </div>

              <div className='flex gap-2 pt-2'>
                <Button variant='outline' size='sm' onClick={() => setIsGalleryOpen(true)}>
                  <ImageIcon className='mr-2 h-3 w-3' />
                  Change Banner
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Session Gallery Modal */}
      {isGalleryOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-background rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Select Banner Image from Session</h2>
              <Button variant='ghost' onClick={() => setIsGalleryOpen(false)}>
                <X className='h-4 w-4' />
              </Button>
            </div>

            {sessionImages.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <ImageIcon className='mx-auto h-12 w-12 mb-4' />
                <p>No images uploaded yet</p>
                <p className='text-sm'>Upload images first to see them here.</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {sessionImages.map((image: any) => (
                  <div
                    key={image.id}
                    className='group relative border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors'
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <div className='aspect-square relative'>
                      <Image src={image.url} alt={image.name} fill className='object-cover' />
                    </div>
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2'>
                      <p className='text-white text-xs truncate'>{image.name}</p>
                      <p className='text-white/70 text-xs'>
                        {(image.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
