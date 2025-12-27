'use client'

import { Button } from '@/components/ui/button'
import { useImageUploader } from '@/hooks/useFileUpload'
import { Eye, Loader2, Plus, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import CustomImage from '../common/CustomImage'

type TProps = {
  value: string
  onChange: (url: string) => void
  multiple?: boolean
  maxAllow?: number
  isCustomer?: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function FileUploader({
  value,
  onChange,
  multiple = false,
  maxAllow = 5,
  isCustomer = false,
  size = 'medium'
}: TProps) {
  const { fileLists, uploadState, handleChange, onPreview, closePreview } = useImageUploader({
    value,
    onChange: (url) => onChange(Array.isArray(url) ? url[0] || '' : url),
    multiple,
    maxAllow,
    isCustomer
  })

  // Size-based classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-16 h-16',
          icon: 'w-4 h-4',
          text: 'text-xs'
        }
      case 'large':
        return {
          container: 'w-32 h-32',
          icon: 'w-8 h-8',
          text: 'text-base'
        }
      default: // medium
        return {
          container: 'w-20 h-20',
          icon: 'w-6 h-6',
          text: 'text-sm'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // Convert FileList to the format expected by handleChange
      const fileList = Array.from(files).map((file, index) => ({
        uid: `${Date.now()}-${index}`,
        name: file.name,
        status: 'uploading' as const,
        originFileObj: file,
        preview: URL.createObjectURL(file)
      }))

      handleChange({ fileList })
    }
    event.target.value = ''
  }

  return (
    <div className='space-y-4'>
      {/* File Grid */}
      <AnimatePresence>
        <div className='flex flex-wrap gap-4 w-auto'>
          {fileLists.map((file, index) => (
            <motion.div
              key={file.uid}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div
                className={`group relative border rounded-lg ${sizeClasses.container} overflow-hidden`}
              >
                <CustomImage
                  src={file.url || file.preview}
                  alt={file.name}
                  fill
                  className='p-1 rounded-md object-contain'
                />

                {/* Overlay with actions */}
                <div className='absolute inset-0 flex justify-center items-center gap-0 bg-black/50 opacity-0 group-hover:opacity-100 p-1 transition-opacity duration-200'>
                  <Button
                    type='button'
                    size='sm'
                    variant='ghost'
                    className='hover:bg-white/20 text-white hover:text-white'
                    onClick={() => onPreview(file)}
                  >
                    <Eye className={sizeClasses.icon} />
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='ghost'
                    className='hover:bg-white/20 text-white hover:text-white'
                    onClick={() => {
                      const newFileList = fileLists.filter((f) => f.uid !== file.uid)
                      handleChange({ fileList: newFileList })
                    }}
                  >
                    <Trash2 className={sizeClasses.icon} />
                  </Button>
                </div>

                {/* Loading overlay */}
                {file.status === 'uploading' && (
                  <div className='absolute inset-0 flex justify-center items-center bg-white/80'>
                    <Loader2 className={`${sizeClasses.icon} text-primary animate-spin`} />
                  </div>
                )}

                {/* Error overlay */}
                {file.status === 'error' && (
                  <div className='absolute inset-0 flex justify-center items-center bg-red-500/80'>
                    <X className={`${sizeClasses.icon} text-white`} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Upload button */}
          {fileLists.length < (multiple ? maxAllow : 1) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`group bg-gray-50 border hover:border-primary border-dashed rounded-lg ${sizeClasses.container} transition-colors cursor-pointer`}
              >
                <label className='flex flex-col justify-center items-center w-full h-full cursor-pointer'>
                  <input
                    type='file'
                    multiple={multiple}
                    accept='image/*'
                    onChange={handleFileSelect}
                    className='hidden'
                    disabled={uploadState.isUploading}
                  />
                  <div className='flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors'>
                    {uploadState.isUploading ? (
                      <>
                        <Loader2 className={`${sizeClasses.icon} animate-spin`} />
                        <span className={sizeClasses.text}>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Plus className={sizeClasses.icon} />
                        <span className={sizeClasses.text}>Upload</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {uploadState.previewOpen && uploadState.previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='z-50 fixed inset-0 flex justify-center items-center bg-black/80'
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='relative max-w-4xl max-h-full'
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='-top-12 right-0 z-10 absolute text-white'
                onClick={closePreview}
              >
                <X className='w-6 h-6' />
              </Button>
              <CustomImage
                src={uploadState.previewImage}
                alt='Preview'
                width={800}
                height={600}
                className='rounded-lg max-w-full max-h-full size-auto object-contain'
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
