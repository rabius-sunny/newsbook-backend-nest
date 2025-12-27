import type { QuoteBlock } from '@/components/admin/builder/types'
import { Typography } from '@/components/common/typography'

interface QuoteBlockProps {
  block: QuoteBlock
}

export function QuoteBlockComponent({ block }: QuoteBlockProps) {
  return (
    <div className='my-8'>
      <blockquote className='border-l-4 border-primary/20 bg-gray-50 p-6 rounded-r-lg'>
        <Typography variant='body1' className='text-gray-700 italic text-lg leading-relaxed mb-4'>
          &ldquo;{block.data.text}&rdquo;
        </Typography>

        {(block.data.author || block.data.designation) && (
          <footer className='text-sm text-gray-600'>
            {block.data.author && (
              <Typography variant='subtitle2' weight='medium' className='text-gray-800'>
                — {block.data.author}
              </Typography>
            )}
            {block.data.designation && (
              <Typography variant='caption' className='text-gray-500 ml-2'>
                {block.data.designation}
              </Typography>
            )}
          </footer>
        )}
      </blockquote>
    </div>
  )
}
