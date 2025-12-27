'use client'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettingsSchema'
import requests from '@/services/network/http'
import { SITE_CONFIG } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import FileUploader from '../FileUploader'

type TProps = {
  initialValues?: SiteSettings
  refetch?: () => void
}

const SiteConfiguration = ({ initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      ...initialValues,
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      address: initialValues?.address || '',
      website: initialValues?.website || '',
      shortDescription: initialValues?.shortDescription || '',
      theme: {
        darkMode: initialValues?.theme?.darkMode ?? false,
        color: initialValues?.theme?.color || {},
        fontFamily: initialValues?.theme?.fontFamily || ''
      },
      logo: {
        default: initialValues?.logo?.default || '',
        dark: initialValues?.logo?.dark || ''
      },
      socialLinks: initialValues?.socialLinks || {},
      seo: initialValues?.seo || {},
      header: initialValues?.header || {},
      footer: initialValues?.footer || {},
      favicon: initialValues?.favicon || '',
      maintenanceMode: initialValues?.maintenanceMode ?? false,
      locale: initialValues?.locale || '',
      languages: initialValues?.languages || [],
      analytics: initialValues?.analytics || {}
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const key = 'site_settings'
      const res = await requests[initialValues ? 'put' : 'post'](
        `/settings${initialValues ? `/${key}` : ''}`,
        {
          key,
          value: data
        }
      )
      if (res?.success) {
        await revalidateTags(SITE_CONFIG)
        toast.success('Settings updated successfully!')
        refetch?.()
      }
    } catch (error) {
      showError(error)
    }
  })

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <Card title='Basic Information'>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <CustomInput
                  label='Site Name'
                  placeholder='Enter site name'
                  error={errors.name?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='email'
              render={({ field }) => (
                <CustomInput
                  label='Email'
                  type='email'
                  placeholder='contact@example.com'
                  error={errors.email?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='phone'
              render={({ field }) => (
                <CustomInput
                  label='Phone'
                  type='tel'
                  placeholder='+1 (555) 123-4567'
                  error={errors.phone?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='website'
              render={({ field }) => (
                <CustomInput
                  label='Website'
                  type='url'
                  placeholder='https://example.com'
                  error={errors.website?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <div className='lg:col-span-2'>
              <Controller
                control={control}
                name='address'
                render={({ field }) => (
                  <CustomInput
                    label='Address'
                    type='textarea'
                    rows={2}
                    placeholder='Enter full address'
                    error={errors.address?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>

            <div className='lg:col-span-2'>
              <Controller
                control={control}
                name='shortDescription'
                render={({ field }) => (
                  <CustomInput
                    label='Short Description'
                    type='textarea'
                    rows={3}
                    placeholder='Brief description of the site'
                    error={errors.shortDescription?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card title='Site Identities'>
        <CardHeader>
          <CardTitle>Site Identities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-6'>
            <div className='flex flex-col gap-2'>
              <label>
                Logo <span className='text-xs'>(Default)</span>
              </label>
              <Controller
                control={control}
                name='logo.default'
                render={({ field }) => (
                  <FileUploader
                    value={field.value || ''}
                    onChange={field.onChange}
                    multiple={false}
                    maxAllow={1}
                  />
                )}
              />
              <span className='text-xs'>Max height 120px</span>
              {errors.logo?.default && (
                <span className='text-red-500 text-xs'>{errors.logo.default.message}</span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label>
                Logo <span className='text-xs'>(Dark)</span>
              </label>
              <Controller
                control={control}
                name='logo.dark'
                render={({ field }) => (
                  <FileUploader
                    value={field.value || ''}
                    onChange={field.onChange}
                    multiple={false}
                    maxAllow={1}
                  />
                )}
              />
              <span className='text-xs'>Max height 120px</span>
              {errors.logo?.dark && (
                <span className='text-red-500 text-xs'>{errors.logo.dark.message}</span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label>Favicon</label>
              <Controller
                control={control}
                name='favicon'
                render={({ field }) => (
                  <FileUploader
                    value={field.value || ''}
                    onChange={field.onChange}
                    multiple={false}
                    maxAllow={1}
                  />
                )}
              />
              <span className='text-xs'>48x48 px</span>
              {errors.favicon && (
                <span className='text-red-500 text-xs'>{errors.favicon.message}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card title='Theme Color'>
        <CardHeader>
          <CardTitle>Theme Color</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4 [&>*]:bg-gray-50 [&>*]:p-2 [&>*]:min-w-24'>
            {[
              { label: 'Primary', key: 'primary' as const, default: '#000000' },
              { label: 'Secondary', key: 'secondary' as const, default: '#ffffff' },
              { label: 'Accent', key: 'accent' as const, default: '#ffffff' },
              { label: 'Text', key: 'text' as const, default: '#ffffff' },
              { label: 'Header BG', key: 'header_bg' as const, default: '#ffffff' },
              { label: 'Header Text', key: 'header_text' as const, default: '#ffffff' },
              { label: 'Footer BG', key: 'footer_bg' as const, default: '#ffffff' },
              { label: 'Footer Text', key: 'footer_text' as const, default: '#ffffff' }
            ].map(({ label, key, default: fallback }) => (
              <Controller
                key={key}
                control={control}
                name={`theme.color.${key}`}
                render={({ field }) => (
                  <ThemeColorPicker
                    label={label}
                    value={field.value || fallback}
                    onChange={field.onChange}
                  />
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card title='Social Links'>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
            {(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'] as const).map(
              (platform) => (
                <Controller
                  key={platform}
                  control={control}
                  name={`socialLinks.${platform}`}
                  render={({ field }) => (
                    <CustomInput
                      label={platform[0].toUpperCase() + platform.slice(1)}
                      placeholder='#'
                      error={errors.socialLinks?.[platform]?.message}
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card title='Header'>
        <CardHeader>
          <CardTitle>Header</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='gap-4 grid grid-cols-1'>
            <div className='space-y-4'>
              <h4 className='font-medium text-sm'>Header Navigation</h4>
              <p className='text-muted-foreground text-sm'>Configure header navigation items</p>
              {/* Header navigation fields will be added here */}
            </div>

            <div className='space-y-4'>
              <h4 className='font-medium text-sm'>Breaking News</h4>
              <p className='text-muted-foreground text-sm'>Configure breaking news items</p>
              {/* Breaking news fields will be added here */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card title='Footer'>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
            <div className='lg:col-span-2'>
              <Controller
                control={control}
                name='footer.copyright'
                render={({ field }) => (
                  <CustomInput
                    label='Copyright Text'
                    type='textarea'
                    placeholder='Enter copyright text'
                    error={errors.footer?.copyright?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name='footer.credit.companyName'
              render={({ field }) => (
                <CustomInput
                  label='Credit Company Name'
                  placeholder='Enter company name'
                  error={errors.footer?.credit?.companyName?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='footer.credit.url'
              render={({ field }) => (
                <CustomInput
                  label='Credit Company URL'
                  type='url'
                  placeholder='https://example.com'
                  error={errors.footer?.credit?.url?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card title='SEO'>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='flex flex-col gap-4'>
            <Controller
              control={control}
              name='seo.metaTitle'
              render={({ field }) => (
                <CustomInput
                  label='Meta Title'
                  error={
                    typeof errors.seo?.metaTitle?.message === 'string'
                      ? errors.seo.metaTitle.message
                      : undefined
                  }
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='seo.metaDescription'
              render={({ field }) => (
                <CustomInput
                  label='Meta Description'
                  type='textarea'
                  rows={4}
                  placeholder='Meta description...'
                  maxLength={160}
                  showCharCount={true}
                  helperText='Max 160 characters allowed'
                  error={
                    typeof errors.seo?.metaDescription?.message === 'string'
                      ? errors.seo.metaDescription.message
                      : undefined
                  }
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='seo.metaKeywords'
              render={({ field }) => (
                <CustomInput
                  label='Meta Keywords'
                  type='textarea'
                  rows={3}
                  placeholder='Enter keywords separated by commas'
                  helperText='Separate keywords with commas'
                  error={
                    typeof errors.seo?.metaKeywords?.message === 'string'
                      ? errors.seo.metaKeywords.message
                      : undefined
                  }
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    const keywords = e.target.value
                      .split(',')
                      .map((k) => k.trim())
                      .filter(Boolean)
                    field.onChange(keywords)
                  }}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card title='Languages'>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='gap-4 grid grid-cols-1'>
            <div className='space-y-4'>
              <h4 className='font-medium text-sm'>Supported Languages</h4>
              <p className='text-muted-foreground text-sm'>
                Configure supported languages for the site
              </p>
              {/* Language fields will be added here */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card title='Analytics'>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
            <Controller
              control={control}
              name='analytics.googleAnalyticsId'
              render={({ field }) => (
                <CustomInput
                  label='Google Analytics ID'
                  placeholder='GA-XXXXXXXXX-X or G-XXXXXXXXXX'
                  error={errors.analytics?.googleAnalyticsId?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='analytics.facebookPixelId'
              render={({ field }) => (
                <CustomInput
                  label='Facebook Pixel ID'
                  placeholder='1234567890123456'
                  error={errors.analytics?.facebookPixelId?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card title='Maintenance'>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='gap-4 grid grid-cols-1'>
            <Controller
              control={control}
              name='maintenanceMode'
              render={({ field }) => (
                <label className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={field.value || false}
                    onChange={field.onChange}
                    className='rounded'
                  />
                  <span className='font-medium text-sm'>Enable Maintenance Mode</span>
                </label>
              )}
            />
            <p className='text-muted-foreground text-sm'>
              When enabled, the site will display a maintenance page to visitors
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='bottom-0 z-10 sticky bg-white py-5'>
        <Button type='submit'>
          {isSubmitting ? 'Submitting...' : initialValues ? 'Update Settings' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}

export default SiteConfiguration

// Custom Theme Color Picker
const ThemeColorPicker = ({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) => {
  return (
    <div className='flex flex-col items-center gap-2'>
      <input
        type='color'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='bg-transparent p-0 border-none w-10 h-10 cursor-pointer'
      />
      <label className='text-sm'>{label}</label>
    </div>
  )
}
