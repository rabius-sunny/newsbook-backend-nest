import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subTitle?: string
  caption?: {
    text: string
    url?: string
  }
  children?: React.ReactNode
  extra?: React.ReactNode
  className?: string
}

export default function PageHeader({
  title,
  subTitle,
  caption,
  children,
  extra,
  className = ''
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 ${className} mb-4`}>
      <div className='flex md:flex-row flex-col md:justify-between md:items-center gap-2'>
        <div className={cn('flex flex-col', { 'gap-2': !subTitle })}>
          {caption && (
            <Typography
              href={caption?.url ?? '#'}
              variant='body1'
              weight='semibold'
              className={cn('text-blue-500 hover:text-primary __text-secondary', {
                'underline underline-offset-6': caption?.url
              })}
            >
              {caption?.text}
            </Typography>
          )}
          {title && (
            <Typography variant='h5' weight='bold' className={cn({ 'text-primary': !caption })}>
              {title}
            </Typography>
          )}
          {subTitle && (
            <Typography weight='light' className={cn('text-gray-500 text-base!')}>
              {subTitle}
            </Typography>
          )}
        </div>
        <div className=''>{extra}</div>
      </div>
      {children}
    </div>
  )
}
