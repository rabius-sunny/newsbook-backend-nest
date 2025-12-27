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
import { Textarea } from '@/components/ui/textarea'
import { showError } from '@/lib/errMsg'
import { authorCreateSchema, USER_ROLES, type AuthorCreateInput } from '@/lib/validations/schemas'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { TAuthorCreated, TAuthorUpdated, UserPublic } from '../../../../../api-types'

interface AuthorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  author?: UserPublic | null
  onSuccess: () => void
}

export function AuthorFormDialog({ open, onOpenChange, author, onSuccess }: AuthorFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!author

  const form = useForm<AuthorCreateInput>({
    resolver: zodResolver(authorCreateSchema),
    defaultValues: {
      email: author?.email || '',
      password: '', // Always empty for security
      name: author?.name || '',
      bio: author?.bio || '',
      avatar: author?.avatar || '',
      role: (author?.role as any) || 'author',
      isActive: author?.isActive !== false,
      meta: {}
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = form

  const onSubmit = async (data: AuthorCreateInput) => {
    setIsSubmitting(true)

    try {
      const url = isEditing ? `/authors/${author.id}` : '/authors'

      // For updates, only send password if it's provided
      const submitData = isEditing ? { ...data, password: data.password || undefined } : data

      const result: TAuthorCreated | TAuthorUpdated = isEditing
        ? await requests.put(url, submitData)
        : await requests.post(url, submitData)

      if (result.success) {
        toast.success(isEditing ? 'Author updated successfully!' : 'Author created successfully!')
        form.reset()
        onSuccess()
      } else {
        throw new Error(result.message || 'Failed to save author')
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
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Author' : 'Add New Author'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the author information below.'
              : 'Add a new author to your system. Fill in the details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Full Name</Label>
            <Input
              id='name'
              placeholder='John Doe'
              {...register('name', { required: 'Name is required' })}
              disabled={isSubmitting}
            />
            {errors.name && <p className='text-red-600 text-sm'>{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              placeholder='john@example.com'
              {...register('email', { required: 'Email is required' })}
              disabled={isSubmitting}
            />
            {errors.email && <p className='text-red-600 text-sm'>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label htmlFor='password'>
              Password{' '}
              {isEditing && (
                <span className='text-muted-foreground text-sm'>(leave blank to keep current)</span>
              )}
            </Label>
            <Input
              id='password'
              type='password'
              placeholder={
                isEditing ? 'Leave blank to keep current password' : 'Enter a strong password'
              }
              {...register('password', { required: isEditing ? false : 'Password is required' })}
              disabled={isSubmitting}
            />
            {errors.password && <p className='text-red-600 text-sm'>{errors.password.message}</p>}
            <p className='text-muted-foreground text-sm'>
              Must contain at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          {/* Role */}
          <div className='space-y-2'>
            <Label>Role</Label>
            <Select
              onValueChange={(value: any) => setValue('role', value)}
              defaultValue={watch('role')}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role} className='capitalize'>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className='text-red-600 text-sm'>{errors.role.message}</p>}
            <p className='text-muted-foreground text-sm'>
              Determines the user&apos;s permissions and access level
            </p>
          </div>

          {/* Bio */}
          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio (Optional)</Label>
            <Textarea
              id='bio'
              placeholder='Brief description about the author...'
              rows={3}
              {...register('bio')}
              disabled={isSubmitting}
            />
            {errors.bio && <p className='text-red-600 text-sm'>{errors.bio.message}</p>}
            <p className='text-muted-foreground text-sm'>
              A short biography or description (max 500 characters)
            </p>
          </div>

          {/* Avatar URL */}
          <div className='space-y-2'>
            <Label htmlFor='avatar'>Avatar URL (Optional)</Label>
            <Input
              id='avatar'
              type='url'
              placeholder='https://example.com/avatar.jpg'
              {...register('avatar')}
              disabled={isSubmitting}
            />
            {errors.avatar && <p className='text-red-600 text-sm'>{errors.avatar.message}</p>}
            <p className='text-muted-foreground text-sm'>Profile picture URL for this author</p>
          </div>

          {/* Is Active */}
          <div className='flex flex-row justify-between items-center shadow-sm p-3 border rounded-lg'>
            <div className='space-y-0.5'>
              <Label>Active Status</Label>
              <p className='text-muted-foreground text-sm'>Enable or disable this author account</p>
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
                ? 'Update Author'
                : 'Create Author'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
