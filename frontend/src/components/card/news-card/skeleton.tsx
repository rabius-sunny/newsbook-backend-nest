import { cn } from '@/lib/utils'
import { newsCardVariants, newsDetailsVariants, newsImageWrapperVariants } from './variants'

export const NewsCardSkeleton = ({
  variant = 'default',
  className
}: {
  variant?: NewsCardVariant
  className?: string
}) => {
  return (
    <article className={cn(newsCardVariants({ variant }), className)}>
      {/* Thumbnail */}
      {!variant.startsWith('slim') && variant !== 'compactSlim' && (
        <div className={cn(newsImageWrapperVariants({ variant }), 'relative overflow-hidden')}>
          <div className='absolute inset-0 bg-gray-200 rounded-md animate-pulse' />
        </div>
      )}

      {/* news Details */}
      <div className={newsDetailsVariants({ variant })}>
        {variant === 'compactSlim' && (
          <div className={cn(newsImageWrapperVariants({ variant }), 'relative overflow-hidden')}>
            <div className='absolute inset-0 bg-gray-200 rounded-md animate-pulse' />
          </div>
        )}

        <div className={cn('w-full', { 'w-1/2': variant === 'compactSlim' })}>
          {/* Title Placeholder */}
          <div
            className={cn(
              'bg-gray-200 rounded h-4 animate-pulse',
              variant === 'banner'
                ? 'w-3/4 mb-2'
                : variant.includes('compact')
                ? 'w-2/3 mb-1'
                : 'w-full mb-2'
            )}
          />

          {/* Excerpt Placeholder */}
          {variant !== 'banner' && (
            <div className='space-y-1 mb-2'>
              <div className='bg-gray-200 rounded w-full h-3 animate-pulse' />
              <div className='bg-gray-200 rounded w-5/6 h-3 animate-pulse' />
              {variant !== 'compactSlim' && (
                <div className='bg-gray-200 rounded w-4/6 h-3 animate-pulse' />
              )}
            </div>
          )}

          {/* Date Placeholder */}
          <div className='bg-gray-200 rounded w-1/3 h-3 animate-pulse' />
        </div>
        <div className='clear-both' />
        {variant === 'compactSlim' && (
          <div className='bg-gray-200 rounded w-full h-3 animate-pulse' />
        )}
      </div>
    </article>
  )
}
