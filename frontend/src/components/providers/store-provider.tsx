'use client'
import { SiteSettings } from '@/types/siteSettings.type'
import Cookies from 'js-cookie'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import RootProviders from './root-provider'

type SiteContextType = {
  siteConfig: SiteSettings | null
  setSiteConfig: (data: SiteSettings | null) => void
}

const SiteContext = createContext<SiteContextType | null>(null)

export function useSiteConfig(): SiteContextType {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteProvider')
  }
  return context
}

export function SiteProvider({
  children,
  data
}: {
  children: ReactNode
  data: SiteSettings | null
}) {
  const [siteConfig, setSiteConfig] = useState<SiteSettings | null>(null)

  useEffect(() => {
    if (data) {
      setSiteConfig(data)
      Cookies.set('locale', data?.locale ?? 'en-US')
    }

    // Dark mode class toggle - theme colors are now set server-side
    if (data?.theme?.darkMode !== undefined) {
      document.documentElement.classList.toggle('dark', !!data?.theme?.darkMode)
    }
  }, [data])
  return (
    <SiteContext.Provider value={{ siteConfig, setSiteConfig }}>
      <RootProviders>{children}</RootProviders>
    </SiteContext.Provider>
  )
}
