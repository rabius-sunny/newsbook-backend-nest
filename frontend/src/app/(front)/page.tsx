import { fetchOnServer } from '@/action/data'
import CategorySections from '@/components/frontend/homepage/CategorySections'
import LatestSection from '@/components/frontend/homepage/LatestSection'
import { cacheLife, cacheTag } from 'next/cache'
import { Suspense } from 'react'

// Skeleton only for below-the-fold content
function CategorySectionsSkeleton() {
  return (
    <div className='animate-pulse p-4'>
      <div className='bg-gray-200 rounded h-8 w-48 mb-4' />
      <div className='gap-4 grid grid-cols-4'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='bg-gray-200 rounded h-48' />
        ))}
      </div>
    </div>
  )
}

export default async function HomePage() {
  'use cache'
  cacheTag('homepage') // Tag for on-demand invalidation
  cacheLife('minutes') // stale=5min, revalidate=1min, expire=1hour

  // ABOVE THE FOLD - Await these so they're in static shell (no skeleton)
  const [breakingNews, latestNews, popularNews] = await Promise.all([
    fetchOnServer('/articles/breaking?limit=10'),
    fetchOnServer('/articles?sortBy=publishedAt&sortOrder=desc&limit=12'),
    fetchOnServer('/articles/featured?limit=5')
  ])

  // BELOW THE FOLD - Don't await, stream with Suspense
  const categories = fetchOnServer('/categories/popular?limit=5')

  return (
    <>
      {/* Above the fold - Pre-rendered, SEO optimized, no skeleton */}
      <LatestSection data={{ main: breakingNews, latest: latestNews, popular: popularNews }} />

      {/* Below the fold - Streams in as user scrolls */}
      <Suspense fallback={<CategorySectionsSkeleton />}>
        <CategorySections categoriesPromise={categories} />
      </Suspense>
    </>
  )
}
