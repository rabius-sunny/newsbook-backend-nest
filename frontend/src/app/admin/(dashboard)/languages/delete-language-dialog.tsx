'use client'

import { Badge } from '@/components/ui/badge'
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
import type { Language, TLanguageDeleted } from '../../../../../api-types'

interface DeleteLanguageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  language: Language
  onSuccess: () => void
}

export function DeleteLanguageDialog({
  open,
  onOpenChange,
  language,
  onSuccess
}: DeleteLanguageDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result: TLanguageDeleted = await requests.delete(`/languages/${language.id}`)

      if (result.success) {
        toast.success('Language deleted successfully!')
        onSuccess()
      } else {
        throw new Error(result.message || 'Failed to delete language')
      }
    } catch (error) {
      showError(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-destructive' />
            <DialogTitle>Delete Language</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the language from your
            system.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='bg-muted p-4 rounded-lg'>
            <div className='flex justify-between items-center mb-2'>
              <span className='font-medium'>Language</span>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='font-mono text-xs'>
                  {language.code.toUpperCase()}
                </Badge>
                {language.isDefault && (
                  <Badge variant='default' className='text-xs'>
                    Default
                  </Badge>
                )}
              </div>
            </div>
            <div className='font-semibold text-lg'>{language.name}</div>
            <div className='text-muted-foreground text-sm'>
              Direction: {language.direction.toUpperCase()}
            </div>
            <div className='text-muted-foreground text-sm'>
              Status: {language.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          {language.isDefault && (
            <div className='bg-destructive/10 p-3 border border-destructive/20 rounded-lg'>
              <div className='flex items-center gap-2 text-destructive'>
                <AlertTriangle className='w-4 h-4' />
                <span className='font-medium text-sm'>Warning</span>
              </div>
              <p className='mt-1 text-destructive text-sm'>
                This is the default language. Deleting it may affect your application functionality.
              </p>
            </div>
          )}

          <div className='text-muted-foreground text-sm'>
            <strong>Note:</strong> Make sure no content is using this language before deletion.
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button type='button' variant='destructive' onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Language'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
