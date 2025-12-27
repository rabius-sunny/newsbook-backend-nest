'use client'

import CategoryForm from '@/components/admin/form/Category'
import useAsync from '@/hooks/useAsync'
import { useParams } from 'next/navigation'

export default function EditCategoryPage() {
  const params = useParams()
  const categorySlug = params.categorySlug as string

  // Fetch category data for editing
  const { data: categoryResponse, loading } = useAsync<{ data: Category }>(() =>
    categorySlug ? `/categories/${categorySlug}` : null
  )

  const categoryData = categoryResponse?.data

  if (loading) {
    return (
      <div className='mx-auto py-6 container'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg'>Loading category...</div>
        </div>
      </div>
    )
  }

  if (!categoryData) {
    return (
      <div className='mx-auto py-6 container'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-destructive text-lg'>Category not found</div>
        </div>
      </div>
    )
  }

  return <CategoryForm initialData={categoryData} />
}
