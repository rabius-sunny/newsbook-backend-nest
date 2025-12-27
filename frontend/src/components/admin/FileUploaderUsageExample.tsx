'use client'

import FileUploader from '@/components/admin/FileUploader'
import { useState } from 'react'

export default function FileUploaderExampleUsage() {
  const [singleImage, setSingleImage] = useState<string>('')
  const [multipleImages, setMultipleImages] = useState<string>('')

  return (
    <div className='space-y-8 mx-auto p-6 max-w-4xl'>
      <div>
        <h2 className='mb-4 font-semibold text-xl'>Single Image Upload</h2>
        <FileUploader value={singleImage} onChange={setSingleImage} multiple={false} maxAllow={1} />
        <div className='mt-2 text-muted-foreground text-sm'>
          Current value: {singleImage || 'None selected'}
        </div>
      </div>

      <div>
        <h2 className='mb-4 font-semibold text-xl'>Multiple Images Upload</h2>
        <FileUploader
          value={multipleImages}
          onChange={setMultipleImages}
          multiple={true}
          maxAllow={5}
        />
        <div className='mt-2 text-muted-foreground text-sm'>
          Current value: {multipleImages || 'None selected'}
        </div>
      </div>

      <div>
        <h2 className='mb-4 font-semibold text-xl'>Customer Upload (with auth)</h2>
        <FileUploader
          value={singleImage}
          onChange={setSingleImage}
          multiple={false}
          maxAllow={1}
          isCustomer={true}
        />
      </div>
    </div>
  )
}
