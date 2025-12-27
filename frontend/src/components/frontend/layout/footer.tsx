'use client'
import CustomLink from '@/components/common/CustomLink'
import SocialLinks from '@/components/common/SocialLinks'
import { Container } from '@/components/common/container'
import { sectionVariants } from '@/components/common/section'
import { useSiteConfig } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function Footer() {
  const { siteConfig } = useSiteConfig()
  return (
    <footer
      className={cn(
        sectionVariants({
          variant: 'lg',
          bg: 'mid'
        })
      )}
    >
      <Container>
        <div className='gap-6 grid grid-cols-1 md:grid-cols-4'>
          {siteConfig?.shortDescription ? (
            <div>
              <h3 className='mb-4 font-bold text-lg'>{siteConfig?.name}</h3>
              <p className='text-gray-700'>{siteConfig?.shortDescription}</p>
            </div>
          ) : (
            <div>
              <Image
                src={
                  (siteConfig?.logo?.dark || siteConfig?.logo?.default) ?? '/placeholder-logo.png'
                }
                height={65}
                width={160}
                alt={siteConfig?.name || 'Logo'}
              />
            </div>
          )}
          <div>
            <h4 className='mb-3 font-semibold'>বিভাগসমূহ</h4>
            <ul className='space-y-2 text-gray-300'>
              <li>
                <CustomLink href='#' className='hover:text-white'>
                  জাতীয়
                </CustomLink>
              </li>
              <li>
                <CustomLink href='#' className='hover:text-white'>
                  আন্তর্জাতিক
                </CustomLink>
              </li>
              <li>
                <CustomLink href='#' className='hover:text-white'>
                  খেলা
                </CustomLink>
              </li>
              <li>
                <CustomLink href='#' className='hover:text-white'>
                  বিনোদন
                </CustomLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='mb-3 font-semibold'>যোগাযোগ</h4>
            <ul className='space-y-2 text-gray-700'>
              <li>ফোন: {siteConfig?.phone}</li>
              <li>ইমেইল: {siteConfig?.email}</li>
              <li>ঠিকানা: {siteConfig?.address}</li>
            </ul>
          </div>
          <div>
            <h4 className='mb-3 font-semibold'>সামাজিক মাধ্যম</h4>
            <SocialLinks variant='footer' />
          </div>
        </div>
        <div className='mt-6 pt-6 border-gray-200 border-t text-gray-700 text-center'>
          {siteConfig?.footer?.copyright || '© 2024 NewsBook. All rights reserved.'}
        </div>
      </Container>
    </footer>
  )
}
