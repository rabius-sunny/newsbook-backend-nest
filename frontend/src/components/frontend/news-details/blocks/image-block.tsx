import type { ImageBlock } from '@/components/admin/builder/types'
import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'

interface ImageBlockProps {
  block: ImageBlock
}

export function ImageBlockComponent({ block }: ImageBlockProps) {
  return (
    <div className='my-8'>
      <div className='relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100'>
        <CustomImage
          src={block.data.imageUrl}
          alt={block.data.alt || ''}
          fill
          className='object-cover'
        />
      </div>

      {block.data.caption && (
        <Typography variant='caption' className='text-gray-500 text-center mt-2 block'>
          {block.data.caption}
        </Typography>
      )}
    </div>
  )
}
