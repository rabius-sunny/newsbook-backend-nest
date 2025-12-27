import { containerVariants } from '@/components/common/container'
import Icon from '@/components/icons'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const today = new Date()

  const formattedDate = new Intl.DateTimeFormat('bn-BD', {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(today)

  const formattedDay = new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long'
  }).format(today)

  return (
    <div className='bg-gray-100 py-1 text-gray-800'>
      <div className={cn(containerVariants(), 'flex flex-col md:flex-row gap-1 justify-between items-center text-sm')}>
        <div className='flex items-center gap-2'>
          <span>{`আজ ${formattedDate}`}</span>
          <span>|</span>
          <span>{formattedDay}</span>
        </div>
        <div className='flex items-center gap-4 max-sm:text-xs'>
          <span>English</span>
          <span>|</span>
          <span>Login</span>
          <Icon name='user' className='w-4 h-4' />
        </div>
      </div>
    </div>
  )
}
