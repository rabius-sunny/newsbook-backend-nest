import type { ImageWithTextBlock } from '@/components/admin/builder/types'
import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'

interface ImageWithTextBlockProps {
  block: ImageWithTextBlock
}

export function ImageWithTextBlockComponent({ block }: ImageWithTextBlockProps) {
  const isImageLeft = block.data.imagePosition === 'left'

  return (
    <div className='my-8'>
      <div className={cn('grid gap-6 items-start', 'grid-cols-1 md:grid-cols-2')}>
        {/* Image */}
        <div className={cn('space-y-2', !isImageLeft && 'md:order-2')}>
          <div className='relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100'>
            <CustomImage src={block.data.imageUrl} alt='' fill className='object-cover' />
          </div>

          {block.data.imageCaption && (
            <Typography variant='caption' className='text-gray-500 text-center block'>
              {block.data.imageCaption}
            </Typography>
          )}
        </div>

        {/* Text Content */}
        <div className={cn('prose prose-gray max-w-none', !isImageLeft && 'md:order-1')}>
          <div
            dangerouslySetInnerHTML={{ __html: block.data.content }}
            className='text-gray-800 leading-relaxed'
          />
        </div>
      </div>
    </div>
  )
}
