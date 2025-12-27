'use client'

import HeaderScripts from '@/components/admin/form/HeaderScripts'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { ScriptSettings } from '@/lib/validations/schemas/scriptSettingsSchema'
import { HEADER_SCRIPTS } from '@/types/cache-keys'

// Main component
export default function HeaderScriptPage() {
  const { data, mutate, loading } = useAsync<{ data: ScriptSettings }>(() => HEADER_SCRIPTS, true)
  const headerScript =
    (data?.data as any)?.key === 'header_scripts' ? (data?.data as any).value : null

  const onClose = () => {
    mutate()
  }

  return (
    <>
      {/* <PageHeader title='Header & Scripts Settings' subTitle='Manage custom scripts' /> */}

      {loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : (
        <div className='pt-6'>
          <HeaderScripts initialValues={headerScript} refetch={onClose} />
        </div>
      )}
    </>
  )
}
