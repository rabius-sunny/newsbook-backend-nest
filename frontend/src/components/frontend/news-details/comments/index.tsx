'use client'
import { Typography } from '@/components/common/typography'
import Icon from '@/components/icons'
import { Button } from '@/components/ui/button'
import useAsync from '@/hooks/useAsync'
import { formatTime } from '@/lib/formatDateTime'
import { useCallback, useEffect, useState } from 'react'
import CommentForm from './CommentForm'

type TProps = {
  newsId: number | undefined
}

export default function CommentsByNews({ newsId }: TProps) {
  const [page, setPage] = useState(1)
  const [allComments, setAllComments] = useState<NewsComment[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const limit = 5

  const { data, loading, mutate, error } = useAsync<{
    data: NewsComment[]
    meta: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }>(() =>
    newsId ? `/comments?articleId=${newsId}&page=${page}&limit=${limit}&sortOrder=desc` : null
  )

  // Update allComments when new data is fetched
  const updateComments = useCallback(() => {
    if (data?.data) {
      if (page === 1) {
        // First page - replace all comments
        setAllComments(data.data)
      } else {
        // Subsequent pages - append new comments
        setAllComments((prev) => [...prev, ...data.data])
      }

      // Check if there are more comments to load
      setHasMore(page < (data?.meta.totalPages || 1))
      setLoadingMore(false)
    }
  }, [data, page])

  // Call updateComments when data changes
  useEffect(() => {
    updateComments()
  }, [updateComments])

  const loadMoreComments = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      setPage((prev) => prev + 1)
    }
  }

  const refreshComments = () => {
    setPage(1)
    setAllComments([])
    setHasMore(true)
    mutate()
  }
  return (
    <div className='bg-red-50/80 mt-10 p-8 rounded-lg'>
      {loading && page === 1 ? (
        <div className='space-y-4'>
          <div className='bg-gray-200 rounded w-32 h-4 animate-pulse'></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-start gap-3 animate-pulse'>
              <div className='bg-gray-200 rounded-full w-8 lg:w-12 h-8 lg:h-12'></div>
              <div className='flex-1 space-y-2'>
                <div className='bg-gray-200 rounded w-1/4 h-4'></div>
                <div className='bg-gray-200 rounded w-3/4 h-3'></div>
                <div className='bg-gray-200 rounded w-1/2 h-3'></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className='py-8 text-center'>
          <Typography variant='body2' className='mb-4 text-red-600'>
            Failed to load comments. Please try again.
          </Typography>
          <Button variant='outline' onClick={() => mutate()} size='sm'>
            Retry
          </Button>
        </div>
      ) : (
        <div>
          {!!allComments.length && (
            <Typography variant='body1' className='mb-4'>
              {data?.meta?.total || allComments.length} Comments
            </Typography>
          )}

          {/* Comment Form */}
          <CommentForm newsId={newsId} onCommentSubmitted={refreshComments} />

          {allComments.length > 0 ? (
            <div className='space-y-10'>
              <ul className='space-y-6 lg:space-y-8'>
                {allComments.map((comment) => (
                  <li key={comment.id} className='flex items-start gap-2 lg:gap-3.5'>
                    <div className='flex justify-center items-center rounded-full size-8 lg:size-12 overflow-hidden'>
                      <Icon
                        name='user-circle'
                        strokeWidth={1}
                        className='size-8 lg:size-12 text-gray-400'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <Typography variant='body2' className='font-semibold'>
                          {comment.authorName}
                        </Typography>
                        <Typography
                          variant='caption'
                          weight='light'
                          className='text-gray-600 text-wrap'
                        >
                          {formatTime(comment.updatedAt, 'bn-BD')}
                        </Typography>
                      </div>
                      <Typography variant='subtitle2' className='text-gray-700' weight='normal'>
                        {comment.content}
                      </Typography>
                    </div>
                    <Button size='sm' variant='link'>
                      <Icon name='ellipsis-vertical' />
                    </Button>
                  </li>
                ))}
              </ul>

              {/* Loading more comments skeleton */}
              {loadingMore && (
                <div className='space-y-6'>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className='flex items-start gap-3 animate-pulse'>
                      <div className='bg-gray-200 rounded-full w-8 lg:w-12 h-8 lg:h-12'></div>
                      <div className='flex-1 space-y-2'>
                        <div className='bg-gray-200 rounded w-1/4 h-4'></div>
                        <div className='bg-gray-200 rounded w-3/4 h-3'></div>
                        <div className='bg-gray-200 rounded w-1/2 h-3'></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className='flex justify-center'>
                  <Button
                    variant='outline'
                    onClick={loadMoreComments}
                    disabled={loadingMore}
                    className='min-w-[120px]'
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}

              {!hasMore && allComments.length > limit && (
                <div className='text-gray-500 text-sm text-center'>All comments loaded</div>
              )}
            </div>
          ) : (
            <div className='py-8 text-center'>
              <Icon name='message-circle' className='mx-auto mb-4 w-12 h-12 text-gray-400' />
              <Typography variant='body2' className='mb-2 text-gray-600'>
                No comments yet
              </Typography>
              <Typography variant='caption' className='text-gray-500'>
                Be the first to share your thoughts!
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
