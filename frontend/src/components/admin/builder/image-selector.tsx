'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useUploadSessionStore } from '@/stores/upload-session-store'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ImageSelectorProps {
  selectedImage?: string
  onImageSelect: (imageUrl: string) => void
  triggerText?: string
}

export function ImageSelector({
  selectedImage,
  onImageSelect,
  triggerText = 'Select Image'
}: ImageSelectorProps) {
  const { sessionImages } = useUploadSessionStore()
  const [open, setOpen] = useState(false)

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl)
    setOpen(false)
  }

  return (
    <div className='space-y-2'>
      {/* Preview of selected image */}
      {selectedImage && (
        <div className='relative w-full h-32 border rounded-lg overflow-hidden bg-muted'>
          <Image src={selectedImage} alt='Selected image' fill className='object-cover' />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='w-full'>
            <ImageIcon className='mr-2 h-4 w-4' />
            {selectedImage ? 'Change Image' : triggerText}
          </Button>
        </DialogTrigger>

        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Select Image from Gallery</DialogTitle>
          </DialogHeader>

          {sessionImages.length === 0 ? (
            <div className='text-center py-12 text-muted-foreground'>
              <ImageIcon className='mx-auto h-16 w-16 mb-4' />
              <p className='text-lg mb-2'>No images available</p>
              <p className='text-sm'>Upload images in the gallery first to select them here.</p>
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
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform'
                    />
                  </div>

                  {/* Selected indicator */}
                  {selectedImage === image.url && (
                    <div className='absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg' />
                  )}

                  {/* Image Info */}
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2'>
                    <p className='text-white text-xs truncate font-medium'>{image.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedImage && (
            <div className='flex justify-end pt-4 border-t'>
              <Button
                variant='outline'
                onClick={() => {
                  onImageSelect('')
                  setOpen(false)
                }}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
