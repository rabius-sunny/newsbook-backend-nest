import { getHeaderScripts, getSiteConfig } from '@/action/data'
import { SiteProvider } from '@/components/providers/store-provider'
import { buildSiteMetadata } from '@/lib/seo/metaBuilders'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteConfig()
  return buildSiteMetadata(data)
}

export async function generateViewport(): Promise<Viewport> {
  const siteConfig = await getSiteConfig()

  return {
    themeColor: [
      {
        media: '(prefers-color-scheme: light)',
        color: siteConfig?.theme?.color?.primary || '#ffffff'
      },
      {
        media: '(prefers-color-scheme: dark)',
        color: siteConfig?.theme?.color?.secondary || '#000000'
      }
    ],
    colorScheme: siteConfig?.theme?.darkMode ? 'dark light' : 'light'
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  'use cache'
  // Data fetching uses centralized caching in getSiteConfig/getHeaderScripts
  const siteConfig: any = await getSiteConfig()
  const siteHeaderScripts: any = await getHeaderScripts()

  const isDarkMode = siteConfig?.theme?.darkMode

  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={isDarkMode ? 'dark' : ''}
      style={{
        colorScheme: isDarkMode ? 'dark' : 'light'
      }}
    >
      {/* Header Scripts */}
      {siteHeaderScripts?.scripts?.map((script: any, index: number) => {
        if (!script.enabled || !script.content?.trim()) return null

        return (
          <Script
            key={script.id || index}
            id={script.id || `header-script-${index}`}
            strategy='beforeInteractive'
            dangerouslySetInnerHTML={{ __html: script.content }}
          />
        )
      })}
      <body className={`${geistSans.variable} antialiased`}>
        <SiteProvider data={siteConfig}>{children}</SiteProvider>
      </body>
    </html>
  )
}
