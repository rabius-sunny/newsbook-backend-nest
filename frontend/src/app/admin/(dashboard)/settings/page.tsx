'use client'

import { useState } from 'react'

import SiteConfiguration from '@/components/admin/form/SiteConfiguration'
import CustomImage from '@/components/common/CustomImage'
import { EmptyState } from '@/components/common/EmptyState'
import RenderData from '@/components/common/RenderData'
import PageHeader from '@/components/frontend/page-layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { SiteSettings } from '@/lib/validations/schemas/siteSettingsSchema'
import { SITE_CONFIG } from '@/types/cache-keys'

// Types
interface SettingsData {
  data: { siteConfig: SiteSettings }
}

// ImageCard component
const ImageCard = ({ value, name }: { value: string; name: string }) => (
  <div className='group flex flex-col gap-y-2 bg-white p-2 rounded-md w-28 overflow-hidden'>
    <span className='text-muted-foreground text-xs text-center uppercase'>{name}</span>
    <div className='relative aspect-square overflow-hidden'>
      <CustomImage src={value} alt={name} fill className='size-auto object-contain' />
    </div>
  </div>
)

// MediaBlock for logo and favicon rendering
const MediaBlock = ({ siteConfig }: { siteConfig: SiteSettings }) => (
  <Card title='Media'>
    <CardHeader className='border-b'>
      <CardTitle>Logo & Favicon</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='flex gap-4'>
        {(['logo', 'favicon'] as const).flatMap((key) => {
          const value = siteConfig[key]

          if (key === 'logo' && typeof value === 'object' && value !== null) {
            return Object.entries(value).map(([variant, url], idx) => (
              <ImageCard
                key={`${key}-${variant}-${idx}`}
                value={url as string}
                name={`${key} ${variant}`}
              />
            ))
          }

          if (key === 'favicon' && typeof value === 'string') {
            return <ImageCard key={key} value={value} name={key} />
          }

          return []
        })}
      </div>
    </CardContent>
  </Card>
)

type KeyValueListProps = {
  data: Record<string, any>
}

// Color Component
const KeyValueList = ({ data }: KeyValueListProps) => {
  return (
    <Card title='Color Codes'>
      <CardHeader className='border-b'>
        <CardTitle>Color Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='gap-y-3 lg:gap-x-10 grid grid-cols-none xl:grid-cols-2 w-full xl:min-w-lg'>
          {Object.entries(data).map(([key, value]) => {
            const isColor = typeof value === 'string' // && /^#([0-9a-f]{3}){1,2}$/i.test(value)

            return (
              <div key={key} className='flex items-center gap-2'>
                <div className='min-w-20 font-medium text-xs capitalize'>
                  {key?.replace('_', ' ').toUpperCase()}
                </div>
                <span>:</span>

                {isColor ? (
                  <>
                    <div
                      className='rounded ring-1 ring-gray-300 min-w-6 size-6'
                      style={{ backgroundColor: value }}
                    />
                    <Badge variant='secondary'>{value}</Badge>
                  </>
                ) : (
                  <div>{String(value)}</div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Main component
export default function SiteConfigPage() {
  const [edit, setEdit] = useState(false)
  const { data, mutate, loading } = useAsync<SettingsData>(() => SITE_CONFIG, true)
  const siteConfig = (data?.data as any)?.key === 'site_settings' ? (data?.data as any).value : null

  const onClose = () => {
    mutate()
    setEdit(false)
  }

  return (
    <>
      <PageHeader
        title='Site Configuration'
        subTitle='Manage your site settings'
        extra={
          <Button
            variant={edit ? 'destructive' : 'default'}
            size='sm'
            onClick={() => setEdit(!edit)}
          >
            {edit ? 'Cancel' : 'Edit'}
          </Button>
        }
      />

      {edit ? (
        <div className='pt-6'>
          <SiteConfiguration initialValues={siteConfig} refetch={onClose} />
        </div>
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : siteConfig ? (
        <div className='space-y-10!'>
          <div className='flex lg:flex-row flex-col gap-3 lg:gap-6'>
            <MediaBlock siteConfig={siteConfig} />

            {(siteConfig?.theme as any)?.color && (
              <KeyValueList data={(siteConfig?.theme as any).color} />
            )}
          </div>

          <RenderData
            title='Site Info'
            data={siteConfig}
            excludedFields={['logo', 'favicon', 'seo', 'theme', 'header', 'footer', 'socialLinks']}
          />

          <RenderData title='Social Links' data={siteConfig.socialLinks ?? {}} />
          <RenderData title='SEO' data={siteConfig.seo ?? {}} />
          <RenderData title='Header Info' data={siteConfig.header ?? {}} />
          <RenderData title='Footer Info' data={siteConfig.footer ?? {}} />
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  )
}
