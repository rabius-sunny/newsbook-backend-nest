import CustomImage from '@/components/common/CustomImage'
import SiteLogo from '@/components/common/SiteLogo'
import { containerVariants } from '@/components/common/container'
import { Menu } from 'lucide-react'

export default function MainHeader() {
  return (
    <div className={containerVariants()}>
      <div className='flex md:flex-row flex-col justify-between lg:items-center gap-2 py-1.5 md:py-4'>
        {/* Logo */}
        <div className='flex justify-between items-center'>
          <SiteLogo />

          {/* Right side */}
          <div className='md:hidden flex items-center gap-4'>
            <Menu className='w-6 h-6' />
          </div>
        </div>

        {/* Ads */}
        <div className='flex flex-1 justify-end'>
          <CustomImage src='/images/ads/01.gif' unoptimized alt='Image' width={580} height={65} />
        </div>
      </div>
    </div>
  )
}
