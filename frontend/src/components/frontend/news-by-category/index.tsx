'use client'
import { NewsCard } from '@/components/card/news-card'
import CustomLink from '@/components/common/CustomLink'
import MotionLoader from '@/components/common/MotionLoader'
import NotFoundMessage from '@/components/common/NotFoundMessage'
import useAsync from '@/hooks/useAsync'
import { NewsGrid } from '../news-section/NewsGrid'
import PageLayout from '../page-layout'
import PageHeader from '../page-layout/page-header'

type TProps = {
  categories: string[]
}

export default function NewsByCategory({ categories }: TProps) {
  const categorySlug = categories.at(-1)

  const { data } = useAsync<{ data: Category; loading: boolean }>(() =>
    categorySlug ? `/categories/${categorySlug}` : null
  )

  const { data: newsData, loading: newsLoading } = useAsync<{ data: any; loading: boolean }>(() =>
    categorySlug
      ? `/categories/${categorySlug}/articles?page=1&limit=8&sortBy=publishedAt&sortOrder=desc`
      : null
  )

  if (newsLoading)
    return (
      <div className='flex justify-center items-center w-full min-h-[65vh]'>
        <MotionLoader size='lg' variant='dots' />
      </div>
    )

  if (!newsData?.data?.articles?.length)
    return (
      <div className='flex flex-col justify-center items-center px-4 w-full min-h-[65vh]'>
        <NotFoundMessage />
      </div>
    )

  return (
    <PageLayout
      header={
        <PageHeader title={data?.data?.name ?? ''}>
          {data?.data?.children && (
            <ul className='flex flex-wrap gap-8 pl-4 list-disc'>
              {data?.data?.children?.map((category, idx) => (
                <li key={idx} className=''>
                  <CustomLink
                    key={idx}
                    href={`/categories/${categorySlug}/${category?.slug}`}
                    className='text-gray-900'
                  >
                    {category?.name}
                  </CustomLink>
                </li>
              ))}
            </ul>
          )}
        </PageHeader>
      }
      sidebar={
        <div className='flex flex-col gap-4'>
          {newsData?.data?.articles?.slice(-4)?.map((item: News, idx: number) => (
            <NewsCard variant='compactSlim' key={idx} data={item} />
          ))}
        </div>
      }
    >
      <NewsGrid
        items={newsData?.data?.articles?.slice(0, 5) as any}
        variant='hero-sidebar'
        spacing='loose'
        itemLayout='default'
        gridCol={{ base: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
      />
    </PageLayout>
  )
}
