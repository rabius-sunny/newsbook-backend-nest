'use client'
import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import { Section } from '@/components/common/section'
import useAsync from '@/hooks/useAsync'
import { NewsGrid, NewsGridProps } from './NewsGrid'

type TProps = {
  data?: Category
  title?: string
  sectionIndex?: number
  isLoading?: boolean
}

const sectionVariantMap: Record<number, NewsGridProps['variant']> = {
  1: 'hero-sidebar',
  2: 'mixed-lifestyle',
  3: 'asymmetric',
  4: 'hero-sidebar',
  5: 'slim-grid',
  6: 'mixed-photo',
  7: 'mixed-entertainment',
  8: 'featured-grid'
}

const itemLayoutMap: Record<number, NewsCardVariant> = {
  1: 'default', // for hero-sidebar
  2: 'compactSlim', // for mixed-lifestyle
  3: 'default' // for asymmetric
  // 4: 'default' // for magazine
  // 5: 'compact-vertical', // for slim-grid
  // 6: 'featured-small', // for mixed-photo
  // 7: 'video-large', // for mixed-entertainment
  // 8: 'default' // for featured-grid
}

export default function NewsSection({ data, sectionIndex = 1, isLoading }: TProps) {
  const { data: newsData, loading } = useAsync<{ data: any; loading: boolean }>(() =>
    data?.slug
      ? `/categories/${data?.slug}/articles?page=1&limit=10&sortBy=publishedAt&sortOrder=desc`
      : null
  )

  // if (!newsData?.data?.articles?.length) return null

  const gridVariant = sectionVariantMap[sectionIndex] ?? 'card-grid' // fallback
  const itemLayout = itemLayoutMap[sectionIndex] ?? 'default'
  return (
    <Section>
      <Container>
        <NewsGrid
          title={
            <CustomLink
              href={data ? `/categories/${data.slug}` : '#'}
              className='text-white hover:text-gray-50'
            >
              {data?.name}
            </CustomLink>
          }
          items={newsData?.data?.articles?.slice(0, 8) as any}
          variant={gridVariant}
          spacing='loose'
          itemLayout={itemLayout}
          gridCol={{ base: itemLayout === 'compactSlim' ? 1 : 2, sm: 2, md: 2, lg: 4, xl: 6 }}
          loading={isLoading || loading ? 7 : false}
        />
      </Container>
    </Section>
  )
}
