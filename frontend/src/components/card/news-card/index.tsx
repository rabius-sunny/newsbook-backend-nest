'use client'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { formatTime } from '@/lib/formatDateTime'
import { cn } from '@/lib/utils'
import { newsCardVariants, newsDetailsVariants, newsImageWrapperVariants } from './variants'

type NewsCardProps = {
  data: News
  variant?: NewsCardVariant
  className?: string
}

export const NewsCard = ({ data, variant = 'default', className }: NewsCardProps) => {
  const href = `/news/${data?.slug}`

  return (
    <article className={cn(newsCardVariants({ variant }), className)}>
      {/* Thumbnail */}
      {!variant.startsWith('slim') && variant !== 'compactSlim' && (
        <NewsThumbnail href={href} variant={variant} data={data} />
      )}

      {/* news Details */}
      <div className={newsDetailsVariants({ variant })}>
        <div className='clear-left' />
        {variant === 'compactSlim' && <NewsThumbnail href={href} variant={variant} data={data} />}
        <Typography
          href={href}
          weight='medium'
          variant={variant === 'banner' ? 'h5' : variant.includes('compact') ? 'body2' : 'body1'}
          className={cn('text-gray-900 line-clamp-2', {
            'text-white hover:text-gray-50': variant === 'banner',
            'line-clamp-none': variant === 'compactSlim'
          })}
        >
          {data?.title}
        </Typography>
        {/* <div className='clear-both' /> */}

        {variant !== 'banner' && (
          <Typography
            href={href}
            variant='body2'
            className={cn('text-gray-700 line-clamp-3', {
              // 'line-clamp-none text-xs': variant === 'compactSlim'
            })}
          >
            {data?.excerpt}
          </Typography>
        )}
        {data.createdAt && (
          <Typography
            className={cn('text-gray-500 text-sm!', { 'text-gray-400': variant === 'banner' })}
            weight='normal'
          >
            {formatTime(data.createdAt, 'bn-BD')}
          </Typography>
        )}
        <div className='clear-both' />
      </div>
    </article>
  )
}

const NewsThumbnail = ({ data, variant = 'default', href }: NewsCardProps & { href: string }) => {
  return (
    <CustomLink href={href} className={newsImageWrapperVariants({ variant })}>
      <CustomImage
        src={data?.featuredImage}
        alt={data?.title}
        fill
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        className='size-full object-cover group-hover:scale-105 transition-transform duration-500'
      />
    </CustomLink>
  )
}
