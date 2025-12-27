import { fetchOnServer } from '@/action/data'
import { buildNewsMetadata } from '@/lib/seo/metaBuilders'
import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { Suspense, lazy } from 'react'
const NewsDetails = lazy(() => import('@/components/frontend/news-details'))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  'use cache'
  cacheLife('hours')
  const pageParams = await params
  const news = await fetchOnServer<News>(
    `/articles/${pageParams.slug}?includes=title,slug,excerpt,featuredImage,seo,tags`,
    3600 // 1 hour revalidation for metadata
  )

  if (!news || !news.data) {
    // handle error or missing data gracefully
    return {}
  }
  return buildNewsMetadata(news.data)
}

// Provide at least one static param for build-time validation
export async function generateStaticParams() {
  return [{ slug: 'sample-news' }] // Fallback placeholder for build validation
}

export default async function PostDetailsPage({ params }: PageProps) {
  'use cache'
  // Cache news detail pages for 1 hour - article content is relatively stable
  cacheLife('hours')

  const pageParams = await params
  const newsSlug = pageParams?.slug

  return (
    <Suspense fallback={<div className='p-4'>Loading article...</div>}>
      <NewsDetails slug={newsSlug} />
    </Suspense>
  )
}
