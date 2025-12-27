'use client'
import CustomImage from '@/components/common/CustomImage'
import RenderData from '@/components/common/RenderData'
import { Typography } from '@/components/common/typography'
import { BlockRenderer } from '@/components/frontend/news-details/blocks'
import PageHeader from '@/components/frontend/page-layout/page-header'
import useAsync from '@/hooks/useAsync'
import { useParams } from 'next/navigation'

export default function NewsDetailsPage() {
  const params = useParams()
  const newsSlug = params.newsSlug
  // Fetch news details based on the slug
  const { data, loading } = useAsync<{ data: News }>(() =>
    newsSlug ? `/articles/${newsSlug}` : null
  )
  if (!data) return null
  // Fetch categories (example endpoint, replace with actual if needed)
  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && !data && <div>No data found.</div>}

      <div className='space-y-6'>
        <PageHeader title='News Details' subTitle={`Details of news: ${data?.data?.title}`} />
        <RenderData
          title='Basic Details'
          data={data?.data as any}
          excludedFields={[
            'id',
            'languageId',
            'categoryId',
            'priority',
            'content',
            'seo',
            'meta',
            'category',
            'author',
            'authorId',
            'count',
            'tags',
            'publishedAt',
            'createdAt',
            'updatedAt'
          ]}
        />
        <RenderData
          title='Category Details'
          data={data?.data?.category as any}
          excludedFields={['id', 'displayOrder', 'depth', 'publishedAt', 'createdAt', 'updatedAt']}
        />
        <div className='my-8 px-4 max-w-4xl'>
          <article className='space-y-6'>
            <Typography variant={'h5'} weight={'semibold'}>
              News Content
            </Typography>
            {/* Image */}
            <div className='space-y-2 pb-1.5 border-gray-200 border-b'>
              <div className='relative aspect-[1.5]'>
                <CustomImage src={data?.data?.featuredImage} alt='' fill className='object-cover' />
              </div>
              <Typography variant={'subtitle2'} weight={'medium'} className='text-gray-500'>
                {data?.data?.imageCaption}
              </Typography>
            </div>

            {/* News Block here  */}
            <div className='space-y-6 text-lg'>
              {data?.data?.content?.blocks?.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              )) || (
                <div className='py-8 text-gray-500 text-center'>
                  <Typography variant='body1'>
                    {data?.data?.excerpt ?? 'No content available'}
                  </Typography>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
