'use client'

import { revalidateTags } from '@/action/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import { PageItem, pageSchema, PageSettings } from '@/lib/validations/schemas/pageSchema'
import requests from '@/services/network/http'
import { DYNAMIC_PAGES } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import PageEditorModal from './PageEditorModal'
import PageTreeManager from './PageTreeManager'

type TProps = {
  initialValues?: PageSettings
  refetch?: () => void
  pageKey?: string
}

const PageForm = ({ initialValues, refetch, pageKey }: TProps) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<PageItem | null>(null)
  const [parentSlugForNew, setParentSlugForNew] = useState<string>()

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<PageSettings>({
    resolver: zodResolver(pageSchema),
    defaultValues: initialValues || { pages: [] }
  })

  const pages = watch('pages') || []

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await requests[initialValues?.pages?.length ? 'put' : 'post'](
        `/settings${initialValues?.pages?.length ? `/${pageKey}` : ''}`,
        {
          key: pageKey,
          value: data
        }
      )
      if (res?.success) {
        await revalidateTags(DYNAMIC_PAGES)
        toast.success('Pages updated successfully!')
        refetch?.()
      }
    } catch (error) {
      showError(error)
    }
  })

  const handlePagesChange = (newPages: PageItem[]) => {
    setValue('pages', newPages, { shouldDirty: true })
  }

  const handleEditContent = (slug: string) => {
    // Navigate to content editor
    router.push(`/admin/settings/pages/${slug}`)
  }

  const handleAddPage = (parentSlug?: string) => {
    setParentSlugForNew(parentSlug)
    setEditingPage(null)
    setIsModalOpen(true)
  }

  const handleSavePage = (pageData: Omit<PageItem, 'id'>) => {
    const newPage: PageItem = {
      ...pageData,
      id: editingPage?.id || crypto.randomUUID()
    }

    if (editingPage) {
      // Update existing page
      const newPages = pages.map((p) => (p.slug === editingPage.slug ? newPage : p))
      handlePagesChange(newPages)
    } else {
      // Add new page
      handlePagesChange([...pages, newPage])
    }

    setIsModalOpen(false)
    setEditingPage(null)
    setParentSlugForNew(undefined)
  }

  return (
    <>
      <form onSubmit={onSubmit} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='w-5 h-5' />
              Page Management
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Create and organize your website pages in a hierarchical structure. Drag and drop to
              reorder, create parent-child relationships, and manage navigation menus.
            </p>
            <div className='bg-blue-50 mt-2 p-3 border border-blue-200 rounded-md'>
              <h5 className='mb-1 font-medium text-blue-900 text-sm'>💡 Features:</h5>
              <ul className='space-y-1 text-blue-800 text-xs'>
                <li>• Create hierarchical page structures (parent-child relationships)</li>
                <li>• Drag and drop to reorder pages and change hierarchy</li>
                <li>• Toggle page visibility and menu display</li>
                <li>• Support for external links and internal content pages</li>
                <li>• Click the content icon to edit page content</li>
              </ul>
            </div>
          </CardHeader>
          <CardContent>
            <PageTreeManager
              pages={pages}
              onPagesChange={handlePagesChange}
              onEditContent={handleEditContent}
              onAddPage={handleAddPage}
            />
          </CardContent>
        </Card>

        <div className='bottom-0 z-10 sticky bg-white py-5'>
          <Button type='submit' disabled={isSubmitting} className='w-full md:w-auto'>
            {isSubmitting ? 'Saving...' : 'Save Page Structure'}
          </Button>
        </div>
      </form>

      <PageEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPage(null)
          setParentSlugForNew(undefined)
        }}
        onSave={handleSavePage}
        allPages={pages}
        parentSlug={parentSlugForNew}
        editingPage={editingPage}
      />
    </>
  )
}

export default PageForm
