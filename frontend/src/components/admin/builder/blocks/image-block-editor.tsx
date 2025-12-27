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
  GripVertical,
  Image as ImageIcon,
  Trash2,
  X
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { ImageBlock } from '../types'

interface ImageBlockEditorProps {
  block: ImageBlock // This will be the initial block, but we'll get current data from store
  isFirst?: boolean
  isLast?: boolean
}

export function ImageBlockEditor({ block: initialBlock, isFirst, isLast }: ImageBlockEditorProps) {
  const { blocks, updateBlock, deleteBlock, moveBlockUp, moveBlockDown, duplicateBlock } =
    useBlockEditorStore()
  const { sessionImages } = useUploadSessionStore()

  // Get the current block data from the store
  const block = (blocks.find((b) => b.id === initialBlock.id) as ImageBlock) || initialBlock

  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const handleDataChange = (
    field: keyof ImageBlock['data'],
    value: string | number | undefined
  ) => {
    console.log('🔄 handleDataChange called:', {
      blockId: block.id,
      field,
      value,
      currentData: block.data
    })

    // Get current block data from store to avoid stale data
    const currentBlock = blocks.find((b) => b.id === block.id) as ImageBlock
    const currentData = currentBlock?.data || block.data

    updateBlock(block.id, {
      data: { ...currentData, [field]: value }
    })

    console.log('🔄 After updateBlock called')
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this image block?')) {
      deleteBlock(block.id)
    }
  }

  const handleImageSelect = (imageUrl: string, imageName: string) => {
    console.log('🖼️ handleImageSelect called:', {
      blockId: block.id,
      imageUrl,
      imageName,
      currentImageUrl: block.data.imageUrl
    })

    // Get current block data from store to avoid stale data
    const currentBlock = blocks.find((b) => b.id === block.id) as ImageBlock
    const currentData = currentBlock?.data || block.data

    // Update both imageUrl and alt in a single operation to avoid race conditions
    updateBlock(block.id, {
      data: {
        ...currentData,
        imageUrl: imageUrl,
        alt: imageName.replace(/\.[^/.]+$/, '') // Remove file extension for alt text
      }
    })

    setIsGalleryOpen(false)

    console.log('🖼️ Gallery closed, imageUrl should be:', imageUrl)
  }

  const removeImage = () => {
    // Get current block data from store to avoid stale data
    const currentBlock = blocks.find((b) => b.id === block.id) as ImageBlock
    const currentData = currentBlock?.data || block.data

    updateBlock(block.id, {
      data: {
        ...currentData,
        imageUrl: '',
        alt: '',
        caption: '',
        width: undefined,
        height: undefined
      }
    })
  }

  return (
    <div className='group relative border rounded-lg bg-card'>
      {/* Block Header */}
      <div className='flex items-center justify-between p-2 border-b bg-muted/50 rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab' />
          <ImageIcon className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm font-medium'>Image Block</span>
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
        {/* Image Selection */}
        {!block.data.imageUrl ? (
          <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8'>
            <div className='text-center space-y-4'>
              <ImageIcon className='mx-auto h-12 w-12 text-muted-foreground/50' />
              <div>
                <h3 className='text-lg font-medium'>Add an image</h3>
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
            {/* Image Preview */}
            <div className='relative inline-block'>
              <Image
                src={block.data.imageUrl}
                alt={block.data.alt || 'Uploaded image'}
                width={block.data.width || 400}
                height={block.data.height || 300}
                className='rounded-lg border max-w-full h-auto'
              />
              <Button
                variant='destructive'
                size='sm'
                onClick={removeImage}
                className='absolute top-2 right-2 h-8 w-8 p-0'
              >
                <X className='h-3 w-3' />
              </Button>
            </div>

            {/* Image Details */}
            <div className='space-y-4'>
              <div>
                <Label htmlFor={`image-caption-${block.id}`} className='text-sm font-medium'>
                  Caption
                </Label>
                <Input
                  id={`image-caption-${block.id}`}
                  placeholder='Enter image caption...'
                  defaultValue={block.data.caption || ''}
                  onBlur={(e) => handleDataChange('caption', e.target.value)}
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor={`image-alt-${block.id}`} className='text-sm font-medium'>
                  Alt Text
                </Label>
                <Input
                  id={`image-alt-${block.id}`}
                  placeholder='Describe the image for accessibility...'
                  defaultValue={block.data.alt || ''}
                  onBlur={(e) => handleDataChange('alt', e.target.value)}
                  className='mt-1'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor={`image-width-${block.id}`} className='text-sm font-medium'>
                    Width (px)
                  </Label>
                  <Input
                    id={`image-width-${block.id}`}
                    type='number'
                    placeholder='Auto'
                    defaultValue={block.data.width || ''}
                    onBlur={(e) => handleDataChange('width', parseInt(e.target.value) || undefined)}
                    className='mt-1'
                  />
                </div>

                <div>
                  <Label htmlFor={`image-height-${block.id}`} className='text-sm font-medium'>
                    Height (px)
                  </Label>
                  <Input
                    id={`image-height-${block.id}`}
                    type='number'
                    placeholder='Auto'
                    defaultValue={block.data.height || ''}
                    onBlur={(e) =>
                      handleDataChange('height', parseInt(e.target.value) || undefined)
                    }
                    className='mt-1'
                  />
                </div>
              </div>

              <div className='flex gap-2 pt-2'>
                <Button variant='outline' size='sm' onClick={() => setIsGalleryOpen(true)}>
                  <ImageIcon className='mr-2 h-3 w-3' />
                  Change Image
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
              <h2 className='text-xl font-semibold'>Select Image from Session</h2>
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
                    onClick={() => handleImageSelect(image.url, image.name)}
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
