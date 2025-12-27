import { fetchOnServer } from '@/action/data'
import { buildCategoryMetadata } from '@/lib/seo/metaBuilders'
import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { Suspense, lazy } from 'react'
const NewsByCategory = lazy(() => import('@/components/frontend/news-by-category'))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  'use cache'
  cacheLife('hours')
  const pageParams = await params
  const news = await fetchOnServer<Category>(
    `/categories/${pageParams?.categorySlug}`,
    3600 // 1 hour revalidation for metadata
  )

  if (!news || !news.data) {
    // handle error or missing data gracefully
    return {}
  }
  return buildCategoryMetadata(news.data)
}

// Provide at least one static param for build-time validation
export async function generateStaticParams() {
  return [{ categorySlug: [] }] // Root category (no slug)
}

export default async function CategoryPage({ params }: PageProps) {
  'use cache'
  // Cache category pages for 30 minutes - category content changes moderately
  cacheLife('minutes')

  const pageParams = await params
  const categories = pageParams?.categorySlug || []

  return (
    <Suspense fallback={<div className='p-4'>Loading category...</div>}>
      <NewsByCategory categories={categories} />
    </Suspense>
  )
}
