'use client'

import CustomInput from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { generateSlug, getParentOptions } from '@/lib/utils/pageTreeUtils'
import { PageItem } from '@/lib/validations/schemas/pageSchema'
import { useEffect, useState } from 'react'

interface PageEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (page: Omit<PageItem, 'id'>) => void
  allPages: PageItem[]
  parentSlug?: string
  editingPage?: PageItem | null
}

export default function PageEditorModal({
  isOpen,
  onClose,
  onSave,
  allPages,
  parentSlug,
  editingPage
}: PageEditorModalProps) {
  const [formData, setFormData] = useState<Partial<PageItem>>({
    title: '',
    slug: '',
    parentSlug: parentSlug || '',
    isActive: true,
    showInMenu: true,
    menuOrder: 0,
    depth: 0,
    hasContent: true,
    target: '_self' as const,
    url: ''
  })

  const [isExternal, setIsExternal] = useState(false)

  useEffect(() => {
    if (editingPage) {
      setFormData({ ...editingPage })
      setIsExternal(!!editingPage.url)
    } else if (parentSlug) {
      setFormData((prev) => ({
        ...prev,
        parentSlug,
        depth: (allPages.find((p) => p.slug === parentSlug)?.depth || 0) + 1
      }))
    }
  }, [editingPage, parentSlug, allPages])

  const parentOptions = getParentOptions(editingPage?.slug || '', allPages)

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug) return

    const pageData: Omit<PageItem, 'id'> = {
      title: formData.title,
      slug: formData.slug,
      parentSlug: formData.parentSlug,
      isActive: formData.isActive ?? true,
      showInMenu: formData.showInMenu ?? true,
      menuOrder: formData.menuOrder ?? 0,
      depth: formData.depth ?? 0,
      hasContent: !isExternal,
      target: formData.target ?? '_self',
      url: isExternal ? formData.url : undefined,
      path: formData.path,
      icon: formData.icon
    }

    onSave(pageData)
    onClose()
  }

  const handleClose = () => {
    setFormData({
      title: '',
      slug: '',
      parentSlug: '',
      isActive: true,
      showInMenu: true,
      menuOrder: 0,
      depth: 0,
      hasContent: true,
      target: '_self',
      url: ''
    })
    setIsExternal(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <CustomInput
              label='Page Title'
              placeholder='e.g., About Us, Contact'
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />

            <CustomInput
              label='URL Slug'
              placeholder='e.g., about-us, contact'
              value={formData.slug || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              helperText='Used in the URL: /pages/your-slug'
              required
            />
          </div>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='parent'>Parent Page</Label>
              <CustomSelect />
              {/* <Select
                value={formData.parentSlug || ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, parentSlug: value || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select parent page (optional)' />
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>

            <div className='flex items-center space-x-2'>
              <Switch id='external' checked={isExternal} onCheckedChange={setIsExternal} />
              <Label htmlFor='external'>External Link</Label>
            </div>

            {isExternal && (
              <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                <CustomInput
                  label='External URL'
                  placeholder='https://example.com'
                  value={formData.url || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  required
                />

                <div>
                  <Label htmlFor='target'>Link Target</Label>
                  <Select
                    value={formData.target || '_self'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, target: value as '_self' | '_blank' }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='_self'>Same Tab</SelectItem>
                      <SelectItem value='_blank'>New Tab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className='gap-4 grid grid-cols-2'>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='active'
                  checked={formData.isActive ?? true}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor='active'>Active</Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Switch
                  id='showInMenu'
                  checked={formData.showInMenu ?? true}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, showInMenu: checked }))
                  }
                />
                <Label htmlFor='showInMenu'>Show in Menu</Label>
              </div>
            </div>

            <CustomInput
              label='Menu Order'
              type='number'
              placeholder='0'
              value={formData.menuOrder || 0}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, menuOrder: Number(e.target.value) }))
              }
              helperText='Lower numbers appear first'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit'>{editingPage ? 'Update Page' : 'Create Page'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
