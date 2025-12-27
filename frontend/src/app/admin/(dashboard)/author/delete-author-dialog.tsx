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
import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { TAuthorDeleted, UserPublic } from '../../../../../api-types'

interface DeleteAuthorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  author: UserPublic | null
  onSuccess: () => void
}

export function DeleteAuthorDialog({
  open,
  onOpenChange,
  author,
  onSuccess
}: DeleteAuthorDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!author) return

    // Safety check for admin users
    if (author.role === 'admin') {
      toast.error('Cannot delete admin users for security reasons')
      return
    }

    setIsDeleting(true)

    try {
      const result: TAuthorDeleted = await requests.delete(`/authors/${author.id}`)

      if (result.success) {
        toast.success('Author deleted successfully!')
        onSuccess()
        onOpenChange(false)
      } else {
        throw new Error(result.message || 'Failed to delete author')
      }
    } catch (error) {
      showError(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const isAdminUser = author?.role === 'admin'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-red-500' />
            Delete Author
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delete this author?
          </DialogDescription>
        </DialogHeader>

        {author && (
          <div className='bg-muted/50 p-4 border rounded-lg'>
            <div className='space-y-2'>
              <p className='font-medium'>{author.name}</p>
              <p className='text-muted-foreground text-sm'>{author.email}</p>
              <div className='flex items-center gap-2'>
                <span className='text-sm'>Role:</span>
                <span className='bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full font-medium text-blue-800 dark:text-blue-100 text-xs capitalize'>
                  {author.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {isAdminUser && (
          <div className='bg-yellow-50 dark:bg-yellow-950 p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <div className='flex items-start gap-2'>
              <AlertTriangle className='mt-0.5 w-4 h-4 text-yellow-600 dark:text-yellow-400' />
              <div className='text-sm'>
                <p className='font-medium text-yellow-800 dark:text-yellow-200'>Admin Protection</p>
                <p className='text-yellow-700 dark:text-yellow-300'>
                  Admin users cannot be deleted for security reasons. Please change their role first
                  if you need to remove their admin privileges.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isAdminUser && (
          <div className='bg-red-50 dark:bg-red-950 p-4 border border-red-200 dark:border-red-800 rounded-lg'>
            <div className='flex items-start gap-2'>
              <AlertTriangle className='mt-0.5 w-4 h-4 text-red-600 dark:text-red-400' />
              <div className='text-sm'>
                <p className='font-medium text-red-800 dark:text-red-200'>Warning</p>
                <p className='text-red-700 dark:text-red-300'>
                  Deleting this author will remove all their account information. Any articles they
                  have written will remain but will show as &quot;Anonymous Author&quot;.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting || isAdminUser}
          >
            {isDeleting ? 'Deleting...' : 'Delete Author'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
