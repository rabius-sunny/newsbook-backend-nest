import type { RelatedNewsBlock } from '@/components/admin/builder/types'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'

interface RelatedNewsBlockProps {
  block: RelatedNewsBlock
}

export function RelatedNewsBlockComponent({ block }: RelatedNewsBlockProps) {
  return (
    <div className='my-8 p-6 bg-gray-50 rounded-lg'>
      <Typography variant='h3' weight='semibold' className='text-gray-900 mb-6'>
        {block.data.title || 'Related News'}
      </Typography>

      <div className='grid gap-4 md:gap-6'>
        {block.data.articles.map((article) => (
          <RelatedArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

interface RelatedArticleCardProps {
  article: {
    id: number
    title: string
    excerpt?: string
    imageUrl?: string
    slug: string
    publishedAt?: string
  }
}

function RelatedArticleCard({ article }: RelatedArticleCardProps) {
  return (
    <CustomLink href={`/news/${article.slug}`}>
      <div className='flex gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer'>
        {/* Image */}
        {article.imageUrl && (
          <div className='flex-shrink-0 w-24 h-24 md:w-32 md:h-24'>
            <div className='relative w-full h-full rounded-md overflow-hidden bg-gray-100'>
              <CustomImage src={article.imageUrl} alt='' fill className='object-cover' />
            </div>
          </div>
        )}

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <Typography
            variant='subtitle1'
            weight='medium'
            className='text-gray-900 line-clamp-2 mb-2'
          >
            {article.title}
          </Typography>

          {article.excerpt && (
            <Typography variant='body2' className='text-gray-600 line-clamp-2 mb-2'>
              {article.excerpt}
            </Typography>
          )}

          {article.publishedAt && (
            <Typography variant='caption' className='text-gray-500'>
              {new Date(article.publishedAt).toLocaleDateString()}
            </Typography>
          )}
        </div>
      </div>
    </CustomLink>
  )
}
