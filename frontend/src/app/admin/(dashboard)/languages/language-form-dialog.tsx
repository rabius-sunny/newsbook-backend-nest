'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { showError } from '@/lib/errMsg'
import { languageCreateSchema, type LanguageCreateInput } from '@/lib/validations/schemas'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { Language, TLanguageCreated, TLanguageUpdated } from '../../../../../api-types'

interface LanguageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  language?: Language | null
  onSuccess: () => void
}

export function LanguageFormDialog({
  open,
  onOpenChange,
  language,
  onSuccess
}: LanguageFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!language

  const form = useForm<LanguageCreateInput>({
    resolver: zodResolver(languageCreateSchema),
    defaultValues: {
      code: language?.code || '',
      name: language?.name || '',
      direction: (language?.direction as 'ltr' | 'rtl') || 'ltr',
      isDefault: language?.isDefault || false,
      isActive: language?.isActive !== false, // Default to true if not specified
      meta: language?.meta || {}
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = form

  const onSubmit = async (data: LanguageCreateInput) => {
    setIsSubmitting(true)

    try {
      const url = isEditing ? `/languages/${language.id}` : '/languages'

      const result: TLanguageCreated | TLanguageUpdated = isEditing
        ? await requests.put(url, data)
        : await requests.post(url, data)

      if (result.success) {
        toast.success(
          isEditing ? 'Language updated successfully!' : 'Language created successfully!'
        )
        form.reset()
        onSuccess()
      } else {
        throw new Error(result.message || 'Failed to save language')
      }
    } catch (error) {
      showError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Language' : 'Add New Language'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the language information below.'
              : 'Add a new language to your application. Fill in the details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Language Code */}
          <div className='space-y-2'>
            <Label htmlFor='code'>Language Code</Label>
            <Input
              id='code'
              placeholder='en, bn, en-US'
              {...register('code', { required: 'Language code is required' })}
              disabled={isEditing || isSubmitting}
            />
            {errors.code && <p className='text-red-600 text-sm'>{errors.code.message}</p>}
            <p className='text-muted-foreground text-sm'>
              ISO 639-1 language code (e.g., &quot;en&quot; for English, &quot;bn&quot; for Bengali)
            </p>
          </div>

          {/* Language Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Language Name</Label>
            <Input
              id='name'
              placeholder='English, বাংলা, العربية'
              {...register('name', { required: 'Language name is required' })}
              disabled={isSubmitting}
            />
            {errors.name && <p className='text-red-600 text-sm'>{errors.name.message}</p>}
            <p className='text-muted-foreground text-sm'>
              Display name of the language in its native script
            </p>
          </div>

          {/* Text Direction */}
          <div className='space-y-2'>
            <Label>Text Direction</Label>
            <Select
              onValueChange={(value: 'ltr' | 'rtl') => setValue('direction', value)}
              defaultValue={watch('direction')}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select text direction' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ltr'>Left-to-Right (LTR)</SelectItem>
                <SelectItem value='rtl'>Right-to-Left (RTL)</SelectItem>
              </SelectContent>
            </Select>
            {errors.direction && <p className='text-red-600 text-sm'>{errors.direction.message}</p>}
            <p className='text-muted-foreground text-sm'>
              Text reading direction for this language
            </p>
          </div>

          {/* Is Default */}
          <div className='flex flex-row justify-between items-center shadow-sm p-3 border rounded-lg'>
            <div className='space-y-0.5'>
              <Label>Default Language</Label>
              <p className='text-muted-foreground text-sm'>
                Set this as the default language for your application
              </p>
            </div>
            <Switch
              checked={watch('isDefault')}
              onCheckedChange={(checked) => setValue('isDefault', checked)}
              disabled={isSubmitting}
            />
          </div>

          {/* Is Active */}
          <div className='flex flex-row justify-between items-center shadow-sm p-3 border rounded-lg'>
            <div className='space-y-0.5'>
              <Label>Active</Label>
              <p className='text-muted-foreground text-sm'>Enable or disable this language</p>
            </div>
            <Switch
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                ? 'Update Language'
                : 'Create Language'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
