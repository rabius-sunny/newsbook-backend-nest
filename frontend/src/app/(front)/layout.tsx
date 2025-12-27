import { getSiteConfig } from '@/action/data'
import Footer from '@/components/frontend/layout/footer'
import Header from '@/components/frontend/layout/header'
import { cacheLife } from 'next/cache'
import { Noto_Serif_Bengali } from 'next/font/google'

const notoSerif = Noto_Serif_Bengali({
  variable: '--font-noto-serif',
  subsets: ['bengali', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export default async function FrontLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  'use cache'
  // Cache frontend layout for 1 hour - theme is same for all users
  // ⚠️ CACHING STRATEGY: Time-based revalidation (cacheLife('hours'))
  cacheLife('hours')

  const siteConfig: any = await getSiteConfig()

  // Generate theme CSS variables from database
  const generateThemeStyles = () => {
    if (!siteConfig?.theme?.color) return null

    const themeVars = Object.entries(siteConfig.theme.color)
      .filter(([, value]) => value)
      .map(([key, value]) => `--${key}: ${value};`)
      .join(' ')

    return themeVars ? `:root { ${themeVars} }` : null
  }

  const themeStyles = generateThemeStyles()
  return (
    <>
      <head>{themeStyles && <style>{themeStyles}</style>}</head>

      <div className={`${notoSerif.variable} font-noto antialiased`}>
        <Header />
        <main className='min-h-125'>{children}</main>
        <Footer />
      </div>
    </>
  )
}
