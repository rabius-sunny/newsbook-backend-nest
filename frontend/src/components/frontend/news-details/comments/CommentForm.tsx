import CustomInput from '@/components/common/CustomInput'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { showError } from '@/lib/errMsg'
import { commentCreateSchema } from '@/lib/validations/schemas/comment.schema'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type CommentFormData = z.infer<typeof commentCreateSchema>

// Comment Form Component
export default function CommentForm({
  newsId,
  onCommentSubmitted
}: {
  newsId: number | undefined
  onCommentSubmitted?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentCreateSchema),
    defaultValues: {
      articleId: newsId || 0,
      authorName: '',
      authorEmail: '',
      content: ''
    }
  })

  const onSubmit = async (data: CommentFormData) => {
    console.log('data :>> ', data)
    if (!newsId) {
      toast.error('Article ID is required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await requests.post('/comments', {
        ...data,
        articleId: newsId
      })

      if (!response.success) {
        showError('Failed to submit comment')
      }

      toast.success('Comment submitted successfully!')
      reset()
      onCommentSubmitted?.() // Refresh comments list
    } catch (error) {
      showError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-white mb-12 p-6 border rounded-lg'>
      <Typography variant='h5' weight='medium' className='mb-4'>
        Leave a Comment
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {!newsId && (
          <div className='bg-yellow-50 p-3 border border-yellow-200 rounded-md'>
            <p className='text-yellow-800 text-sm'>
              Please wait for the article to load before submitting a comment.
            </p>
          </div>
        )}

        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
          <Controller
            name='authorName'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Name'
                placeholder='Enter your name'
                required
                error={errors.authorName?.message}
                disabled={isSubmitting}
                {...field}
              />
            )}
          />

          <Controller
            name='authorEmail'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Email'
                type='email'
                placeholder='Enter your email'
                required
                error={errors.authorEmail?.message}
                disabled={isSubmitting}
                helperText='Your email will not be published'
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name='content'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Comment'
              type='textarea'
              rows={4}
              placeholder='Write your comment here... (minimum 10 characters)'
              required
              maxLength={2000}
              showCharCount
              error={errors.content?.message}
              disabled={isSubmitting}
              helperText='Share your thoughts respectfully'
              {...field}
            />
          )}
        />

        <div className='flex flex-col sm:justify-between sm:items-start gap-4'>
          {/* <div className='text-red-400 text-xs'>
            <p>Your email address will not be published. Required fields are marked *</p>
          </div> */}
          <Button type='submit' disabled={isSubmitting || !newsId} className='min-w-[120px]'>
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </Button>
        </div>
      </form>
    </div>
  )
}
