'use client'
import CustomImage from '@/components/common/CustomImage'
import MotionLoader from '@/components/common/MotionLoader'
import NotFoundMessage from '@/components/common/NotFoundMessage'
import { Typography } from '@/components/common/typography'
import useAsync from '@/hooks/useAsync'
import { useNewsDate } from '@/hooks/useNewsDate'
import { cn } from '@/lib/utils'
import { NewsGrid } from '../news-section/NewsGrid'
import PageLayout from '../page-layout'
import PageHeader from '../page-layout/page-header'
import { BlockRenderer } from './blocks'
import CommentsByNews from './comments'

type TProps = {
  slug: string
}

export default function NewsDetails({ slug }: TProps) {
  const { data, loading } = useAsync<{ data: News; loading: boolean }>(() => `/articles/${slug}`)
  const newsData = data?.data

  const { data: relatedData, loading: relatedLoading } = useAsync<{
    data: { articles: News[] }
    loading: boolean
  }>(() =>
    newsData?.category?.slug
      ? `/articles?page=1&limit=8&category=${newsData?.category?.id}&sortBy=publishedAt&sortOrder=asc`
      : null
  )
  const relatedNews = relatedData?.data?.articles?.filter((item) => item?.id !== newsData?.id)

  const { isToggle, dateState, toggleDate } = useNewsDate(newsData)

  if (loading)
    return (
      <div className='flex justify-center items-center w-full min-h-[65vh]'>
        <MotionLoader size='lg' variant='dots' />
      </div>
    )

  if (!newsData)
    return (
      <div className='flex justify-center items-center px-4 w-full min-h-[65vh]'>
        <NotFoundMessage />
      </div>
    )

  return (
    <PageLayout
      header={
        dateState?.text && (
          <PageHeader
            title={newsData?.title ?? ''}
            caption={{
              text: newsData?.category?.name ?? '',
              url: `/categories/${newsData?.category?.slug}`
            }}
          >
            <Typography
              variant='subtitle2'
              className={cn('text-gray-500', { 'cursor-pointer': isToggle })}
              onClick={toggleDate}
            >
              <span className='capitalize'>{dateState?.mode}</span>: {dateState?.text}
              {isToggle && <span>⥯</span>}
            </Typography>
          </PageHeader>
        )
      }
      sidebar={
        <NewsGrid
          items={relatedNews?.slice(0, 4) || []}
          variant='compact-list'
          itemLayout='compactSlim'
          spacing='loose'
          loading={relatedLoading ? 5 : false}
        />
      }
      footer={
        relatedNews &&
        relatedNews.length > 4 && (
          <div className='space-y-4 py-10'>
            <Typography variant='body1' weight='bold'>
              {newsData?.category?.name} নিয়ে আরও পড়ুন
            </Typography>
            <NewsGrid
              items={relatedNews?.slice(-4) || []}
              variant='asymmetric'
              itemLayout='default'
              spacing='loose'
              loading={relatedLoading ? 5 : false}
              gridCol={{ base: 2, sm: 2, md: 2, lg: 4, xl: 6 }}
            />
          </div>
        )
      }
    >
      <div className='space-y-8 lg:space-y-12 mx-auto max-w-2xl'>
        {/* News Details */}
        <article className='space-y-6'>
          {/* Image */}
          <div className='space-y-2 pb-1.5 border-gray-200 border-b'>
            <div className='relative aspect-[1.5]'>
              <CustomImage src={newsData?.featuredImage} alt='' fill className='object-cover' />
            </div>
            <Typography variant={'subtitle2'} weight={'medium'} className='text-gray-500'>
              {newsData?.imageCaption}
            </Typography>
          </div>

          {/* News Block here  */}
          <div className='space-y-6 text-lg'>
            {newsData?.content?.blocks?.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            )) || (
              <div className='py-8 text-gray-500 text-center'>
                <Typography variant='body1'>
                  {newsData?.excerpt ?? 'No content available'}
                </Typography>
              </div>
            )}
          </div>
        </article>

        {/* Comment Section */}
        <CommentsByNews newsId={newsData?.id} />
      </div>
    </PageLayout>
  )
}
