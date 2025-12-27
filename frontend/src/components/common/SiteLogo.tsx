import { getSiteConfig } from '@/action/data'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function SiteLogo({ className }: { className?: string }) {
  const siteData = await getSiteConfig()

  return (
    <Link href='/' prefetch={false} className={cn('mx-auto md:mx-0', className)}>
      <Image
        src={siteData?.logo?.default || '/images/logo.svg'}
        width={160}
        height={65}
        alt={'logo'}
      />
    </Link>
  )
}
