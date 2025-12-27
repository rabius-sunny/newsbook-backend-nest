import { AppSidebar } from '@/components/admin/dashboard/app-sidebar'
import { SiteHeader } from '@/components/admin/dashboard/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Suspense } from 'react'

function AdminLayoutSkeleton() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex gap-2'>
        <span className='bg-primary rounded-full w-3 h-3 animate-bounce [animation-delay:-0.3s]' />
        <span className='bg-primary rounded-full w-3 h-3 animate-bounce [animation-delay:-0.15s]' />
        <span className='bg-primary rounded-full w-3 h-3 animate-bounce' />
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminLayoutSkeleton />}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)'
          } as React.CSSProperties
        }
      >
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <div className='md:p-6 px-3 py-5'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  )
}
