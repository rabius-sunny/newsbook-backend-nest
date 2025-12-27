'use client'

import { Button } from '@/components/ui/button'
import { showError } from '@/lib/errMsg'
import { useUploadSessionStore } from '@/stores/upload-session-store'
import { Image as ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export function GalleryManager() {
  const { sessionImages, uploadImages, isUploading, removeSessionImage, clearSession } =
    useUploadSessionStore()
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      try {
        await uploadImages(Array.from(files))
      } catch (error) {
        showError(error)
      }
    }

    // Reset input
    event.target.value = ''
  }

  return (
    <>
      {/* Gallery Manager Controls - Compact Sidebar Version */}
      <div className='space-y-3'>
        {/* Upload Button */}
        <div>
          <input
            id='gallery-manager-upload'
            type='file'
            accept='image/*'
            multiple
            onChange={handleImageUpload}
            className='hidden'
            disabled={isUploading}
          />
          <Button
            variant='outline'
            size='sm'
            className='w-full cursor-pointer'
            disabled={isUploading}
            onClick={() => document.getElementById('gallery-manager-upload')?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                Uploading...
              </>
            ) : (
              <>
                <Upload className='mr-2 w-4 h-4' />
                Upload Images
              </>
            )}
          </Button>
        </div>

        {/* Gallery Stats and View Button */}
        <div className='flex justify-between items-center text-muted-foreground text-sm'>
          <span>
            {sessionImages.length} image{sessionImages.length !== 1 ? 's' : ''} uploaded
          </span>
          {sessionImages.length > 0 && (
            <Button variant='ghost' size='sm' onClick={() => setIsGalleryOpen(true)}>
              <ImageIcon className='mr-1 w-3 h-3' />
              View All
            </Button>
          )}
        </div>

        {/* Quick Preview of Recent Images */}
        {sessionImages.length > 0 && (
          <div className='gap-1 grid grid-cols-3'>
            {sessionImages.slice(-6).map((image: any) => (
              <div key={image.id} className='group relative'>
                <Image
                  src={image.url}
                  alt={image.name}
                  width={60}
                  height={45}
                  className='border rounded w-full h-12 object-cover'
                />
                <div className='absolute inset-0 flex justify-center items-center bg-black/0 hover:bg-black/20 opacity-0 hover:opacity-100 rounded transition-colors'>
                  <span className='bg-black/80 px-1 rounded text-white text-xs'>
                    {image.name.length > 8 ? `${image.name.substring(0, 8)}...` : image.name}
                  </span>
                </div>
              </div>
            ))}
            {sessionImages.length > 6 && (
              <div className='flex justify-center items-center border-2 border-muted-foreground/25 border-dashed rounded h-12'>
                <span className='text-muted-foreground text-xs'>+{sessionImages.length - 6}</span>
              </div>
            )}
          </div>
        )}

        {sessionImages.length === 0 && (
          <div className='py-4 border-2 border-muted-foreground/25 border-dashed rounded-lg text-muted-foreground text-center'>
            <ImageIcon className='mx-auto mb-2 w-8 h-8' />
            <p className='text-sm'>No images uploaded yet</p>
          </div>
        )}
      </div>

      {/* Full Gallery Modal */}
      {isGalleryOpen && (
        <div className='z-50 fixed inset-0 flex justify-center items-center bg-black/50'>
          <div className='bg-background mx-4 p-6 rounded-lg w-full max-w-5xl max-h-[85vh] overflow-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='font-semibold text-xl'>Article Image Gallery</h2>
              <div className='flex items-center gap-2'>
                {process.env.NODE_ENV === 'development' && sessionImages.length > 0 && (
                  <Button variant='outline' size='sm' onClick={clearSession}>
                    Clear Session
                  </Button>
                )}
                <Button variant='ghost' onClick={() => setIsGalleryOpen(false)}>
                  <X className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {sessionImages.length === 0 ? (
              <div className='py-12 text-muted-foreground text-center'>
                <ImageIcon className='mx-auto mb-4 w-16 h-16' />
                <p className='mb-2 text-lg'>No images uploaded yet</p>
                <p className='text-sm'>Upload images to use them in your article content.</p>
              </div>
            ) : (
              <div className='gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {sessionImages.map((image: any) => (
                  <div key={image.id} className='group relative border rounded-lg overflow-hidden'>
                    <div className='relative aspect-square'>
                      <Image src={image.url} alt={image.name} fill className='object-cover' />
                    </div>

                    {/* Image Actions Overlay */}
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
                    <div className='top-2 right-2 absolute opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => removeSessionImage(image.id)}
                        className='p-0 w-8 h-8'
                      >
                        <Trash2 className='w-3 h-3' />
                      </Button>
                    </div>

                    {/* Image Info */}
                    <div className='right-0 bottom-0 left-0 absolute bg-gradient-to-t from-black/80 to-transparent p-3'>
                      <p className='font-medium text-white text-sm truncate'>{image.name}</p>
                      <p className='text-white/70 text-xs'>
                        {(image.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area in Gallery */}
            <div className='mt-6 p-6 border-2 border-muted-foreground/25 border-dashed rounded-lg'>
              <div className='text-center'>
                <input
                  id='gallery-modal-upload'
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleImageUpload}
                  className='hidden'
                  disabled={isUploading}
                />
                <Button
                  variant='outline'
                  className='cursor-pointer'
                  disabled={isUploading}
                  onClick={() => document.getElementById('gallery-modal-upload')?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className='mr-2 w-4 h-4' />
                      Upload More Images
                    </>
                  )}
                </Button>
                <p className='mt-2 text-muted-foreground text-xs'>
                  Select multiple images to upload at once
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
