import CustomLink from '@/components/common/CustomLink'
import { formatTime } from '@/lib/formatDateTime'
import { Clock } from 'lucide-react'

interface SidebarNewsProps {
  news: News[]
}

export default function SidebarNews({ news }: SidebarNewsProps) {
  return (
    <div className='bg-white'>
      <h3 className='mb-4 pb-2 border-b font-bold text-gray-900'>সর্বশেষ সংবাদ</h3>
      <div className='space-y-4'>
        {news?.map((item: News, idx: number) => (
          <article key={idx} className='group space-y-1 cursor-pointer'>
            <CustomLink
              href={`/news/${item?.slug}`}
              className='font-medium text-gray-900 group-hover:text-primary text-base line-clamp-1 transition-colors'
            >
              {item?.title}
            </CustomLink>
            <div className='flex justify-between items-center text-gray-500 text-xs'>
              <span className='font-medium text-primary'>{item.category?.name}</span>
              <div className='flex items-center gap-1'>
                <Clock className='w-3 h-3' />
                <span>{formatTime(item?.updatedAt, 'bn-BD')}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
