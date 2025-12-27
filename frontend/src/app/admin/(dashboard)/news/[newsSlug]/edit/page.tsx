'use client'

import { ArticleEditor } from '@/components/admin/builder/article-editor'
import type { CompleteArticleData } from '@/components/admin/builder/types'
import useAsync from '@/hooks/useAsync'
import { useParams } from 'next/navigation'

export default function EditNewsPage() {
  const params = useParams()
  const newsSlug = params.newsSlug as string

  // Fetch article data for editing
  const { data: articleResponse, loading } = useAsync<{
    data: CompleteArticleData & { id: number }
  }>(newsSlug ? `/articles/${newsSlug}` : null)

  const articleData = articleResponse?.data

  if (loading) {
    return (
      <div className='mx-auto py-6 container'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg'>Loading article...</div>
        </div>
      </div>
    )
  }

  if (!articleData) {
    return (
      <div className='mx-auto py-6 container'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-destructive text-lg'>Article not found</div>
        </div>
      </div>
    )
  }

  return <ArticleEditor initialData={articleData} />
}
