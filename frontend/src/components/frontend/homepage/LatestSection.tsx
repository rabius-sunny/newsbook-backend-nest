import { NewsCard } from '@/components/card/news-card'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { NewsGrid } from '../news-section/NewsGrid'
import FeatureLeftSidebar from './FeatureLeftSidebar'
import FeatureRightSidebar from './FeatureRightSidebar'

type TProps = {
  data: {
    main: { data: any; error: string | null }
    latest: { data: any; error: string | null }
    popular: { data: any; error: string | null }
  }
}

export default function LatestSection({ data }: TProps) {
  const mainNews = data.main
  const latestNews = data.latest
  const popular = data.popular

  // Handle cases where data might be null or error
  const hasMainNews = mainNews?.data && Array.isArray(mainNews.data) && mainNews.data.length > 0
  const hasLatestNews = latestNews?.data?.articles && Array.isArray(latestNews.data?.articles)
  const hasPopularNews = popular?.data && Array.isArray(popular.data)

  return (
    <Section>
      <Container>
        <div className='relative gap-4 grid grid-cols-1 lg:grid-cols-4 lg:divide-x'>
          {/* Sidebar */}
          <div className='space-y-6 lg:col-span-1 lg:pr-4'>
            <FeatureRightSidebar data={hasLatestNews ? latestNews.data?.articles?.slice(-4) : []} />
          </div>

          {/* Main content */}
          <div className='space-y-4 max-sm:order-first lg:col-span-2 lg:pr-4'>
            {/* Featured News */}
            <div className='divide-y'>
              {/* Featured article */}
              {hasMainNews && (
                <div className='md:col-span-full pb-4'>
                  <NewsCard variant='featured' data={mainNews.data[0]} />
                </div>
              )}

              {/* Secondary articles */}
              <div className='block relative py-3'>
                <NewsGrid
                  items={hasMainNews ? mainNews.data.slice(0, 2) : []}
                  variant={'slim-grid'}
                  itemLayout='slim'
                  gridCol={{ base: 2 }}
                />
              </div>

              {/* Secondary articles */}
              <div className='py-3'>
                <NewsGrid
                  items={hasMainNews ? mainNews.data.slice(0, 3) : []}
                  variant={'featured-grid'}
                  gridCol={{ base: 2, sm: 3, md: 3 }}
                />
              </div>
            </div>
            {/* Ad placeholder */}
            <div className='flex justify-center items-center bg-gray-200 mb-8 rounded-lg h-24 text-gray-500'>
              বিজ্ঞাপন
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6 lg:col-span-1'>
            <FeatureLeftSidebar
              data={{
                latest: hasLatestNews ? latestNews?.data?.articles?.slice(0, 8) : [],
                popular: hasPopularNews ? popular.data : []
              }}
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
