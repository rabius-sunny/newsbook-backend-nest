'use client'

import * as React from 'react'

import { NavMain } from '@/components/admin/dashboard/nav-main'
import { NavSecondary } from '@/components/admin/dashboard/nav-secondary'
import { NavUser } from '@/components/admin/dashboard/nav-user'
import { useSiteConfig } from '@/components/providers/store-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { navData } from '@/config/site-config'
import { LayoutDashboard } from 'lucide-react'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { siteConfig } = useSiteConfig()
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <a href='#'>
                <LayoutDashboard className='!size-5' />
                <span className='font-semibold text-base'>{siteConfig?.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
