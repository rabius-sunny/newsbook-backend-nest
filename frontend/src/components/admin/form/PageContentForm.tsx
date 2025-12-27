'use client'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import TextEditor from '@/components/common/TextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { showError } from '@/lib/errMsg'
import { PageContent, pageContentSchema } from '@/lib/validations/schemas/pageSchema'
import requests from '@/services/network/http'
import { DYNAMIC_PAGES } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  initialValues?: PageContent
  refetch?: () => void
  pageKey?: string
}

const PageContentForm = ({ initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PageContent>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: initialValues || {}
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const key = data?.pageSlug
      const res = await requests[initialValues ? 'put' : 'post'](
        `/settings${initialValues ? `/${key}` : ''}`,
        {
          key,
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

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='w-5 h-5' />
            Dynamic Pages
          </CardTitle>
          <p className='text-muted-foreground text-sm'>
            Manage static pages like About Us, Terms & Conditions, Privacy Policy, etc. These pages
            can be displayed in your site&apos;s header, footer, or accessed via direct links.
          </p>
          <div className='bg-green-50 mt-2 p-3 border border-green-200 rounded-md'>
            <h5 className='mb-1 font-medium text-green-900 text-sm'>💡 Usage Tips:</h5>
            <ul className='space-y-1 text-green-800 text-xs'>
              <li>• Use clear, descriptive titles for better SEO</li>
              <li>• Slugs are auto-generated but can be customized</li>
              <li>• Enable &quot;Show in Footer/Header&quot; for easy navigation</li>
              <li>• Use rich text editor for professional formatting</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent>
          <div className='bg-gray-50/50 p-6 border rounded-lg'>
            <div className='gap-4 grid grid-cols-1 md:grid-cols-2 mb-4'>
              <Controller
                control={control}
                name={`title`}
                render={({ field }) => (
                  <CustomInput
                    label='Page Title'
                    placeholder='e.g., About Us, Privacy Policy'
                    error={errors.title?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name='pageSlug'
                render={({ field }) => (
                  <CustomSelect
                    // label='Page Slug'
                    placeholder='e.g., about-us, privacy-policy'
                    // error={errors.pages?.[index]?.slug?.message}
                    // helperText='Will be used in URL: /pages/your-slug'
                    {...field}
                  />
                )}
              />
            </div>

            <div className='gap-4 grid grid-cols-1 md:grid-cols-2 mb-4'>
              <Controller
                control={control}
                name={`metaTitle`}
                render={({ field }) => (
                  <CustomInput
                    label='Meta Title (SEO)'
                    placeholder='SEO optimized title'
                    error={errors.metaTitle?.message}
                    maxLength={60}
                    showCharCount
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />

              <Controller
                control={control}
                name={`metaDescription`}
                render={({ field }) => (
                  <CustomInput
                    label='Meta Description (SEO)'
                    type='textarea'
                    rows={3}
                    placeholder='Brief description for search engines'
                    error={errors.metaDescription?.message}
                    maxLength={160}
                    showCharCount
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>

            <Separator className='my-4' />

            <Controller
              control={control}
              name={`content`}
              render={({ field }) => (
                <div className='space-y-2'>
                  <label className='font-medium text-sm'>Page Content</label>
                  <TextEditor
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder='Write your page content here...'
                  />
                  {errors.content && (
                    <p className='text-red-500 text-sm'>{errors.content?.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className='bottom-0 z-10 sticky bg-white py-5'>
        <Button type='submit' disabled={isSubmitting} className='w-full md:w-auto'>
          {isSubmitting ? 'Saving...' : initialValues ? 'Update Pages' : 'Save Pages'}
        </Button>
      </div>
    </form>
  )
}

export default PageContentForm
