'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Linkedin,
  TikTok,
  TwitterX,
  WhatsApp,
  YouTube
} from '../icons/social-icons'
import { useSiteConfig } from '../providers/store-provider'

type TProps = {
  variant?: 'header' | 'footer'
}

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: TwitterX,
  twitterx: TwitterX,
  whatsapp: WhatsApp,
  youtube: YouTube,
  tiktok: TikTok
} as const

const SocialLinks = ({ variant = 'header' }: TProps) => {
  const { siteConfig } = useSiteConfig()

  return (
    <div className='flex flex-wrap items-center gap-1.5 lg:gap-2.5'>
      {Object.entries(siteConfig?.socialLinks ?? {}).map(([key, value]) => {
        const IconComponent = iconMap[key.toLowerCase() as keyof typeof iconMap]
        if (!IconComponent || !value) return null
        return (
          <div
            key={key}
            className={cn({
              'bg-background rounded-lg size-8 lg:size-10 flex items-center justify-center hover:shadow-lg':
                variant === 'footer'
            })}
          >
            <Link href={value || '/'} passHref prefetch={false} target='_blank'>
              <IconComponent className={cn('size-4', { 'lg:size-5': variant === 'footer' })} />
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default SocialLinks
