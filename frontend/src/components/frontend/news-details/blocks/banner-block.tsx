import type { BannerBlock } from '@/components/admin/builder/types'
import CustomImage from '@/components/common/CustomImage'
import Link from 'next/link'

interface BannerBlockProps {
  block: BannerBlock
}

export function BannerBlockComponent({ block }: BannerBlockProps) {
  const BannerContent = () => (
    <div className='relative w-full h-32 md:h-48 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity'>
      <CustomImage src={block.data.imageUrl} alt='Banner' fill className='object-cover' />
    </div>
  )

  return (
    <div className='my-8'>
      {block.data.linkUrl ? (
        <Link href={block.data.linkUrl} target='_blank' rel='noopener noreferrer' className='block'>
          <BannerContent />
        </Link>
      ) : (
        <BannerContent />
      )}
    </div>
  )
}
