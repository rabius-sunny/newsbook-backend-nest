'use client'

import PageForm from '@/components/admin/form/PageForm'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { DYNAMIC_PAGES } from '@/types/cache-keys'

export default function DynamicDataPage() {
  // Fetch existing settings
  const { data, mutate, loading } = useAsync<{ data: any }>(() => DYNAMIC_PAGES, true)
  const pageData = (data?.data as any)?.key === 'pages' ? (data?.data as any).value : { pages: [] }

  const onClose = () => {
    mutate()
  }

  return (
    <>
      {/* <PageHeader
        title='Page Content'
        subTitle='Manage static page content like About, Terms, Privacy Policy'
      /> */}

      {loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : (
        <div className='pt-6'>
          <PageForm initialValues={pageData} refetch={onClose} pageKey={'pages'} />
        </div>
      )}
    </>
  )
}
