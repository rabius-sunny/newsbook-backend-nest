'use client'

import { CategoryTreeDropdown } from '@/components/admin/category-tree-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import useAsync from '@/hooks/useAsync'
import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { useBlockEditorStore } from '@/stores/block-editor-store'
import { useUploadSessionStore } from '@/stores/upload-session-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { TAuthors, TCategoryTree, TLanguages } from '../../../../api-types'
import { BlockEditor } from './block-editor'
import { GalleryManager } from './gallery-manager'
import { ImageSelector } from './image-selector'
import { StoreInitializer } from './store-initializer'
import { articleFormSchema, type ArticleFormData, type CompleteArticleData } from './types'

interface ArticleEditorProps {
  initialData?: Partial<CompleteArticleData & { id?: number | string }>
}

export function ArticleEditor({ initialData }: ArticleEditorProps) {
  const router = useRouter()
  const { loadInitialContent, getContent, clearBlocks } = useBlockEditorStore()
  const { clearSession } = useUploadSessionStore()

  // Internal loading state
  const [isLoading, setIsLoading] = useState(false)

  // Store selected category data for display purposes
  const [selectedCategoryData, setSelectedCategoryData] = useState<{
    name: string
    parentPath: string[]
  } | null>(null)

  // Fetch authors from API
  const { data: authorsResponse, loading: authorsLoading } = useAsync<TAuthors>('/authors')

  // Fetch languages from API
  const { data: languagesResponse, loading: languagesLoading } = useAsync<TLanguages>('/languages')

  // Fetch category tree
  const { data: categoryResponse, loading: categoriesLoading } = useAsync<TCategoryTree>(
    '/categories/hierarchy/tree'
  )

  const authors = useMemo(() => {
    return authorsResponse?.data || []
  }, [authorsResponse?.data])

  const languages = useMemo(() => {
    return languagesResponse?.data || []
  }, [languagesResponse?.data])

  const categories = useMemo(() => {
    return categoryResponse?.data || []
  }, [categoryResponse?.data])

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      languageId: initialData?.languageId || languages[0]?.id || 1,
      imageCaption: initialData?.imageCaption || '',
      categoryId: initialData?.categoryId,
      authorId: initialData?.authorId || authors[0]?.id || 1,
      status: initialData?.status || 'draft',
      isPublished: initialData?.isPublished || false,
      publishedAt: initialData?.publishedAt,
      scheduledAt: initialData?.scheduledAt ?? undefined,
      isFeatured: initialData?.isFeatured || false,
      isBreaking: initialData?.isBreaking || false,
      priority: initialData?.priority || 5,
      location: initialData?.location || '',
      source: initialData?.source || '',
      seo: initialData?.seo || {},
      meta: initialData?.meta || {},
      featuredImage: initialData?.featuredImage || ''
    }
  })

  // Load initial content into the store
  useEffect(() => {
    if (initialData?.content) {
      loadInitialContent(initialData.content)
    }
  }, [initialData?.content, loadInitialContent])

  // Update form defaults when API data loads
  useEffect(() => {
    if (authors.length > 0 && languages.length > 0) {
      const currentValues = form.getValues()
      form.reset({
        ...currentValues,
        languageId: currentValues.languageId || languages[0]?.id || 1,
        authorId: currentValues.authorId || authors[0]?.id || 1
      })
    }
  }, [authors, languages, form])

  // Set initial category data when editing existing article
  useEffect(() => {
    if (initialData?.categoryId && categories.length > 0 && !selectedCategoryData) {
      // Find the category in the flattened categories
      const findCategoryById = (cats: any[], id: number): any | null => {
        for (const cat of cats) {
          if (cat.id === id) return cat
          if (cat.children && cat.children.length > 0) {
            const found = findCategoryById(cat.children, id)
            if (found) return found
          }
        }
        return null
      }

      const foundCategory = findCategoryById(categories, initialData.categoryId)
      if (foundCategory) {
        // Build parent path
        const buildParentPath = (cats: any[], targetId: number, path: string[] = []): string[] => {
          for (const cat of cats) {
            if (cat.id === targetId) {
              return path
            }
            if (cat.children && cat.children.length > 0) {
              const childPath = buildParentPath(cat.children, targetId, [...path, cat.name])
              if (
                childPath.length > 0 ||
                cat.children.some((child: any) => child.id === targetId)
              ) {
                return childPath
              }
            }
          }
          return []
        }

        const parentPath = buildParentPath(categories, initialData.categoryId)
        setSelectedCategoryData({
          name: foundCategory.name,
          parentPath
        })
      }
    }
  }, [initialData?.categoryId, categories, selectedCategoryData])

  const {
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors }
  } = form

  const getCompleteData = (formData: ArticleFormData): CompleteArticleData => ({
    ...formData,
    content: getContent()
  })

  // const handleSave = handleSubmit(async (formData: ArticleFormData) => {
  //   setIsLoading(true)
  //   try {
  //     const completeData = getCompleteData(formData)
  //     console.log('Saving article:', completeData)

  //     // TODO: Implement save draft API call
  //     // if (initialData?.id) {
  //     //   await requests.put(`/articles/${initialData.id}`, completeData)
  //     // } else {
  //     //   await requests.post('/articles/draft', completeData)
  //     // }

  //     toast.success('Article saved as draft successfully!')
  //     router.push('/admin/news')
  //   } catch (error) {
  //     showError(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // })

  const handlePublish = handleSubmit(async (formData: ArticleFormData) => {
    setIsLoading(true)
    try {
      const now = new Date()
      const completeData = getCompleteData({
        ...formData,
        status: 'published',
        isPublished: true,
        publishedAt: now,
        scheduledAt: formData?.scheduledAt ?? undefined
      })

      if (initialData?.id) {
        // Update existing article
        const response = await requests.put(`/articles/${initialData?.id}`, completeData)
        if (response.success) {
          toast.success('Article updated and published successfully!')
        } else {
          showError('Publishing failed')
        }
      } else {
        // Create new article
        const response = await requests.post('/articles', completeData)
        if (response.success) {
          toast.success('Article published successfully!')
          clearBlocks()
          clearSession()
        } else {
          showError('Publishing failed')
        }
      }

      router.push('/admin/news')
    } catch (error) {
      showError(error)
    } finally {
      setIsLoading(false)
    }
  })

  const handleDiscard = () => {
    if (
      window.confirm('Are you sure you want to discard all changes? This action cannot be undone.')
    ) {
      // Reset the form to initial values
      reset()
      // Clear all blocks from the store
      clearBlocks()
    }
  }

  // Calculate total loading state
  const totalIsLoading = isLoading || authorsLoading || languagesLoading || categoriesLoading

  return (
    <StoreInitializer>
      <div className='space-y-6 mx-auto py-6 container'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='font-bold text-2xl'>
              {initialData?.id ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className='text-muted-foreground'>
              {initialData?.id
                ? 'Update your article content and settings'
                : 'Create and publish your news article'}
            </p>
          </div>

          <div className='flex items-center gap-2'>
            {/* <Button variant='outline' onClick={handlePreview} disabled={totalIsLoading}>
              <Eye className='mr-2 w-4 h-4' />
              Preview
            </Button> */}

            {/* <Button onClick={handleSave} disabled={totalIsLoading}>
              <Save className='mr-2 w-4 h-4' />
              Save Draft
            </Button> */}

            <Button variant='destructive' onClick={handleDiscard} disabled={totalIsLoading}>
              <Trash2 className='mr-2 w-4 h-4' />
              Discard
            </Button>

            <Button onClick={handlePublish} disabled={totalIsLoading}>
              <Send className='mr-2 w-4 h-4' />
              Publish
            </Button>
          </div>
        </div>

        <div className='gap-6 grid grid-cols-1 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Article Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='title'>Title *</Label>
                  <Input
                    id='title'
                    placeholder='Enter article title...'
                    {...form.register('title')}
                  />
                  {errors.title && (
                    <p className='mt-1 text-destructive text-sm'>{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor='slug'>Slug *</Label>
                  <Input id='slug' placeholder='article-url-slug' {...form.register('slug')} />
                  {errors.slug && (
                    <p className='mt-1 text-destructive text-sm'>{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor='excerpt'>Excerpt</Label>
                  <Textarea
                    id='excerpt'
                    placeholder='Brief summary of the article...'
                    rows={3}
                    {...form.register('excerpt')}
                  />
                  {errors.excerpt && (
                    <p className='mt-1 text-destructive text-sm'>{errors.excerpt.message}</p>
                  )}
                </div>

                {/* Featured Image and Caption */}
                <div>
                  <Label htmlFor='featuredImage'>Featured Image</Label>
                  <div className='space-y-2'>
                    <ImageSelector
                      selectedImage={watch('featuredImage') || ''}
                      onImageSelect={(imageUrl) => {
                        setValue('featuredImage', imageUrl)
                        setError('featuredImage', { message: undefined })
                      }}
                      triggerText='Select Featured Image'
                    />
                    <p className='text-muted-foreground text-xs'>
                      Select an image from the gallery above. Upload images first if needed.
                    </p>
                    {errors.featuredImage && (
                      <p className='mt-1 text-destructive text-sm'>
                        {errors.featuredImage.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor='imageCaption'>Image Caption</Label>
                  <Input
                    id='imageCaption'
                    placeholder='Caption for the featured image'
                    {...form.register('imageCaption')}
                  />
                </div>

                <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='location'>Location</Label>
                    <Input
                      id='location'
                      placeholder='Dhaka, Bangladesh'
                      {...form.register('location')}
                    />
                  </div>

                  <div>
                    <Label htmlFor='source'>Source</Label>
                    <Input
                      id='source'
                      placeholder='Source organization'
                      {...form.register('source')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <BlockEditor />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <GalleryManager />
              </CardContent>
            </Card>

            {/* Publication Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    value={watch('status')}
                    onValueChange={(value) => setValue('status', value as any)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='draft'>Draft</SelectItem>
                      <SelectItem value='review'>Under Review</SelectItem>
                      <SelectItem value='published'>Published</SelectItem>
                      <SelectItem value='archived'>Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex justify-between items-center'>
                  <Label htmlFor='isPublished'>Published</Label>
                  <Switch
                    id='isPublished'
                    checked={watch('isPublished')}
                    onCheckedChange={(checked) => setValue('isPublished', checked)}
                  />
                </div>

                <div className='flex justify-between items-center'>
                  <Label htmlFor='isFeatured'>Featured Article</Label>
                  <Switch
                    id='isFeatured'
                    checked={watch('isFeatured')}
                    onCheckedChange={(checked) => setValue('isFeatured', checked)}
                  />
                </div>

                <div className='flex justify-between items-center'>
                  <Label htmlFor='isBreaking'>Breaking News</Label>
                  <Switch
                    id='isBreaking'
                    checked={watch('isBreaking')}
                    onCheckedChange={(checked) => setValue('isBreaking', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor='priority'>Priority (1-10)</Label>
                  <Input
                    id='priority'
                    type='number'
                    min='1'
                    max='10'
                    {...form.register('priority', { valueAsNumber: true })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* General Info */}
            <Card>
              <CardHeader>
                <CardTitle>General Info</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label>Category *</Label>
                  <div className='space-y-2 mt-1'>
                    <CategoryTreeDropdown
                      selectedCategoryId={watch('categoryId') || null}
                      onCategoryChange={(categoryId, categoryData) => {
                        if (categoryId) {
                          setValue('categoryId', Number(categoryId))
                          setError('categoryId', { message: undefined })
                          setSelectedCategoryData(categoryData || null)
                        } else {
                          // Clear category selection
                          setSelectedCategoryData(null)
                        }
                      }}
                      categories={categories}
                      loading={categoriesLoading}
                      className='w-full'
                    />
                    {/* Display selected category */}
                    {selectedCategoryData && (
                      <div className='bg-muted/50 p-2 border rounded-md text-muted-foreground text-sm'>
                        <span className='font-medium'>Selected: </span>
                        {selectedCategoryData.parentPath.length > 0 && (
                          <span>{selectedCategoryData.parentPath.join(' → ')} → </span>
                        )}
                        <span className='font-semibold text-foreground'>
                          {selectedCategoryData.name}
                        </span>
                      </div>
                    )}
                    {errors.categoryId && (
                      <p className='mt-1 text-destructive text-sm'>{errors.categoryId.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor='authorId'>Author *</Label>
                  <Select
                    value={watch('authorId')?.toString()}
                    onValueChange={(value) => setValue('authorId', parseInt(value))}
                    disabled={authorsLoading || authors.length === 0}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={authorsLoading ? 'Loading authors...' : 'Select author'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id.toString()}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.authorId && (
                    <p className='mt-1 text-destructive text-sm'>{errors.authorId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor='languageId'>Language</Label>
                  <Select
                    value={watch('languageId')?.toString()}
                    onValueChange={(value) => setValue('languageId', parseInt(value))}
                    disabled={languagesLoading || languages.length === 0}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={languagesLoading ? 'Loading languages...' : 'Select language'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id.toString()}>
                          {language.name} ({language.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StoreInitializer>
  )
}
