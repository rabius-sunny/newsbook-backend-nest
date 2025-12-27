import { getDynamicPages } from '@/action/data'
import { Container } from '@/components/common/container'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'

type TPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: TPageProps): Promise<Metadata> {
  'use cache'
  cacheLife('hours')
  const pageParams = await params
  const pagesData = await getDynamicPages()
  const page = pagesData?.pages?.find((p) => p.slug === pageParams.slug && p.isActive)

  if (!page) {
    return {
      title: 'Page Not Found'
    }
  }

  return {
    // title: page.metaTitle || page.title,
    // description:
    //   page.metaDescription || `${page.title} - Read more about our services and policies.`,
    // keywords: [page.title, 'information', 'policy'].join(', ')
  }
}

export default async function DynamicPage({ params }: TPageProps) {
  'use cache'
  // Cache static pages for 1 day - page content rarely changes
  cacheLife('days')

  const pageParams = await params
  const pagesData = await getDynamicPages()
  const page = pagesData?.pages?.find((p) => p.slug === pageParams.slug && p.isActive)

  if (!page) {
    notFound()
  }

  return (
    <Container>
      <div className='py-8 md:py-12'>
        <div className='mx-auto max-w-4xl'>
          <header className='mb-8 text-center'>
            <h1 className='mb-4 font-bold text-3xl md:text-4xl lg:text-5xl'>{page.title}</h1>
            <div className='bg-primary mx-auto rounded w-24 h-1'></div>
          </header>

          <article className='dark:prose-invert max-w-none prose prose-lg'>
            <div
              dangerouslySetInnerHTML={{ __html: page.title }}
              className='[&>*:first-child]:mt-0 [&>*:last-child]:mb-0'
            />
          </article>
        </div>
      </div>
    </Container>
  )
}

export async function generateStaticParams() {
  const pagesData = await getDynamicPages()

  // Cache Components requires at least one result from generateStaticParams
  // for build-time validation. Return placeholder if API unavailable.
  if (!pagesData?.pages || pagesData.pages.length === 0) {
    return [{ slug: 'about' }] // Fallback placeholder for build validation
  }

  return pagesData.pages
    .filter((page) => page.isActive)
    .map((page) => ({
      slug: page.slug
    }))
}
