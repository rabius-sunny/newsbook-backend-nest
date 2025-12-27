'use client'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { scriptTemplates } from '@/config/scriptTemplates'
import { showError } from '@/lib/errMsg'
import {
  ScriptSettings,
  scriptSettingsSchema
} from '@/lib/validations/schemas/scriptSettingsSchema'
import requests from '@/services/network/http'
import { HEADER_SCRIPTS } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Code, Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  initialValues?: ScriptSettings
  refetch?: () => void
}

const HeaderScripts = ({ initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ScriptSettings>({
    resolver: zodResolver(scriptSettingsSchema),
    defaultValues: {
      scripts: initialValues?.scripts || [
        {
          id: crypto.randomUUID(),
          name: 'Google Analytics',
          content: '',
          enabled: true
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'scripts'
  })

  const addNewScript = () => {
    append({
      id: crypto.randomUUID(),
      name: '',
      content: '',
      enabled: true
    })
  }

  const addTemplate = (template: { name: string; content: string }) => {
    append({
      id: crypto.randomUUID(),
      name: template.name,
      content: template.content,
      enabled: true
    })
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      const key = 'header_scripts'
      const res = await requests[initialValues ? 'put' : 'post'](
        `/settings${initialValues ? `/${key}` : ''}`,
        {
          key,
          value: data
        }
      )
      if (res?.success) {
        await revalidateTags(HEADER_SCRIPTS)
        toast.success('Settings updated successfully!')
        refetch?.()
      }
    } catch (error) {
      showError(error)
    }
  })

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <Card title='Header Scripts'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Code className='w-5 h-5' />
            Header Scripts
          </CardTitle>
          <p className='text-muted-foreground text-sm'>
            Add custom scripts to be inserted in the {'<head>'} tag of your website. Common uses
            include analytics, tracking pixels, and third-party integrations.
          </p>
          <div className='bg-blue-50 mt-2 p-3 border border-blue-200 rounded-md'>
            <h5 className='mb-1 font-medium text-blue-900 text-sm'>💡 Pro Tips:</h5>
            <ul className='space-y-1 text-blue-800 text-xs'>
              <li>• Use templates for popular services like Google Analytics</li>
              <li>• Remember to replace placeholder IDs with your actual values</li>
              <li>• Disabled scripts won&apos;t be loaded on your site</li>
              <li>• Test scripts on staging before enabling in production</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {fields.map((field, index) => (
              <div key={field.id} className='bg-gray-50/50 p-4 border rounded-lg'>
                <div className='flex justify-between items-center mb-3'>
                  <h4 className='font-medium text-gray-900 text-sm'>Script #{index + 1}</h4>
                  <div className='flex items-center gap-2'>
                    <Controller
                      control={control}
                      name={`scripts.${index}.enabled`}
                      render={({ field }) => (
                        <label className='flex items-center gap-2 text-sm cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={field.value}
                            onChange={field.onChange}
                            className='rounded'
                          />
                          Enabled
                        </label>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => remove(index)}
                        className='hover:bg-red-50 text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    )}
                  </div>
                </div>

                <div className='space-y-3'>
                  <Controller
                    control={control}
                    name={`scripts.${index}.name`}
                    render={({ field }) => (
                      <CustomInput
                        label='Script Name'
                        placeholder='e.g., Google Analytics, Facebook Pixel'
                        error={errors.scripts?.[index]?.name?.message}
                        {...field}
                        value={field.value ?? ''}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`scripts.${index}.content`}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <CustomInput
                          label='Script Content'
                          type='textarea'
                          rows={6}
                          placeholder='<script>
                            // Your script here
                            console.log("Hello World");
                            </script>

                            <!-- Or any HTML/meta tags -->
                            <meta name="description" content="Your description">'
                          error={errors.scripts?.[index]?.content?.message}
                          helperText='Include complete HTML tags like <script>, <meta>, <link>, etc.'
                          maxLength={10000}
                          showCharCount
                          {...field}
                          value={field.value ?? ''}
                        />

                        {field.value && field.value.length > 50 && (
                          <details className='mt-2'>
                            <summary className='text-gray-600 hover:text-gray-800 text-xs cursor-pointer'>
                              📄 Preview Code
                            </summary>
                            <div className='bg-gray-900 mt-2 p-3 rounded max-h-32 overflow-auto font-mono text-gray-100 text-xs'>
                              <pre>{field.value}</pre>
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}

            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={addNewScript}
                className='flex items-center gap-2'
              >
                <Plus className='w-4 h-4' />
                Add Custom Script
              </Button>

              <div className='relative'>
                <select
                  onChange={(e) => {
                    const template = scriptTemplates.find((t) => t.name === e.target.value)
                    if (template) {
                      addTemplate(template)
                      e.target.value = '' // Reset selection
                    }
                  }}
                  className='bg-background px-3 py-2 border rounded-md h-9 text-sm'
                  defaultValue=''
                >
                  <option value='' disabled>
                    Add from template...
                  </option>
                  {scriptTemplates.map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='bottom-0 z-10 sticky bg-white py-5'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialValues ? 'Update Scripts' : 'Save Scripts'}
        </Button>
      </div>
    </form>
  )
}

export default HeaderScripts
