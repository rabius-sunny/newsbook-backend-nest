'use client';

import { CategoryTreeDropdown } from '@/components/admin/category-tree-dropdown';
import CustomInput from '@/components/common/CustomInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useAsync from '@/hooks/useAsync';
import { showError } from '@/lib/errMsg';
import {
  baseCategorySchema,
  CategorySchema,
} from '@/lib/validations/schemas/category.schema';
import requests from '@/services/network/http';
import type { Category, TCategoryTree } from '@/types/category.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FileUploader from '../FileUploader';

interface CategoryFormProps {
  initialData?: Category;
  onSuccess?: () => void;
}

const CategoryForm = ({ initialData, onSuccess }: CategoryFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Store selected parent category data for display purposes
  const [selectedParentData, setSelectedParentData] = useState<{
    name: string;
    parentPath: string[];
  } | null>(null);

  // Fetch category tree for parent selection
  const { data: categoryResponse, loading: categoriesLoading } =
    useAsync<TCategoryTree>('/categories/tree');

  const categories = useMemo(() => {
    return categoryResponse?.data || [];
  }, [categoryResponse?.data]);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategorySchema>({
    resolver: zodResolver(baseCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      slug: initialData?.slug || '',
      image: initialData?.image || '',
      parentId: initialData?.parentId || undefined,
      displayOrder: initialData?.displayOrder || 0,
      isActive: initialData?.isActive ?? true,
      names: initialData?.names || {},
      descriptions: initialData?.descriptions || {},
      seo: initialData?.seo || {},
      meta: initialData?.meta || {},
    },
  });

  // Auto-generate slug from name
  const watchedName = watch('name');
  useEffect(() => {
    if (watchedName && !initialData?.slug) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchedName, setValue, initialData]);

  // Set initial parent data when editing existing category
  useEffect(() => {
    if (initialData?.parentId && categories.length > 0 && !selectedParentData) {
      const findCategoryById = (cats: any[], id: number): any | null => {
        for (const cat of cats) {
          if (cat.id === id) return cat;
          if (cat.children && cat.children.length > 0) {
            const found = findCategoryById(cat.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const foundParent = findCategoryById(categories, initialData.parentId);
      if (foundParent) {
        const buildParentPath = (
          cats: any[],
          targetId: number,
          path: string[] = [],
        ): string[] => {
          for (const cat of cats) {
            if (cat.id === targetId) {
              return path;
            }
            if (cat.children && cat.children.length > 0) {
              const childPath = buildParentPath(cat.children, targetId, [
                ...path,
                cat.name,
              ]);
              if (
                childPath.length > 0 ||
                cat.children.some((child: any) => child.id === targetId)
              ) {
                return childPath;
              }
            }
          }
          return [];
        };

        const parentPath = buildParentPath(categories, initialData.parentId);
        setSelectedParentData({
          name: foundParent.name,
          parentPath,
        });
      }
    }
  }, [initialData?.parentId, categories, selectedParentData]);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      let response;

      if (initialData?.id) {
        // Update existing category
        response = await requests.put(
          `/admin/categories/${initialData.id}`,
          data,
        );
      } else {
        // Create new category
        response = await requests.post('/admin/categories', data);
      }

      if (response?.success) {
        toast.success(
          `Category ${initialData ? 'updated' : 'created'} successfully!`,
        );
        onSuccess?.();
        router.push('/admin/categories');
      } else {
        showError(
          response?.message ||
            `Failed to ${initialData ? 'updated' : 'created'} category`,
        );
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  });

  const totalIsLoading = isLoading || isSubmitting || categoriesLoading;

  return (
    <div className="space-y-6 mx-auto py-6 container">
      {/* Header */}
      {/* <div className='flex justify-between items-center'>
       <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push('/admin/categories')}
            disabled={totalIsLoading}
          >
            <ArrowLeft className='mr-2 w-4 h-4' />
            Back to Categories
          </Button>
          <div>
            <h1 className='font-bold text-2xl'>
              {mode === 'edit' ? 'Edit Category' : 'Create New Category'}
            </h1>
            <p className='text-muted-foreground'>
              {mode === 'edit'
                ? 'Update category information and settings'
                : 'Add a new category to organize your content'}
            </p>
          </div>
        </div> 

        <Button onClick={onSubmit} disabled={totalIsLoading}>
          <Save className='mr-2 w-4 h-4' />
          {totalIsLoading ? 'Saving...' : mode === 'edit' ? 'Update Category' : 'Create Category'}
        </Button>
      </div>*/}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
          {/* Main Information */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <CustomInput
                        label="Category Name *"
                        placeholder="Enter category name"
                        error={errors.name?.message}
                        {...field}
                        value={field.value ?? ''}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="slug"
                    render={({ field }) => (
                      <CustomInput
                        label="Slug *"
                        placeholder="category-url-slug"
                        error={errors.slug?.message}
                        // disabled={!!initialData?.id} // Don't allow slug changes in edit mode
                        helperText={
                          initialData
                            ? 'Slug cannot be changed after creation'
                            : 'Auto-generated from name, or enter custom'
                        }
                        {...field}
                        value={field.value ?? ''}
                      />
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <CustomInput
                      label="Description"
                      type="textarea"
                      rows={4}
                      placeholder="Enter category description (optional)"
                      error={errors.description?.message}
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm">Category Image</label>
                  <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <FileUploader
                        value={field.value || ''}
                        onChange={field.onChange}
                        multiple={false}
                        maxAllow={1}
                      />
                    )}
                  />
                  {errors.image && (
                    <span className="text-red-500 text-xs">
                      {errors.image.message}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            {/* <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Controller
                  control={control}
                  name='seo.metaTitle'
                  render={({ field }) => (
                    <CustomInput
                      label='Meta Title'
                      placeholder='SEO title for this category'
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
                      rows={3}
                      placeholder='SEO description for this category'
                      maxLength={160}
                      showCharCount={true}
                      helperText='Max 160 characters recommended'
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
                      placeholder='keyword1, keyword2, keyword3'
                      helperText='Separate keywords with commas'
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </CardContent>
            </Card> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Category Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="isActive">Active Status</Label>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name="displayOrder"
                  render={({ field }) => (
                    <CustomInput
                      label="Display Order"
                      type="number"
                      placeholder="0"
                      helperText="Lower numbers appear first (0-1000)"
                      error={errors.displayOrder?.message}
                      {...field}
                      value={field.value?.toString() ?? '0'}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Parent Category */}
            <Card>
              <CardHeader>
                <CardTitle>Parent Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Parent Category</Label>
                  <div className="space-y-2 mt-2">
                    <CategoryTreeDropdown
                      selectedCategoryId={watch('parentId') || null}
                      onCategoryChange={(categoryId, categoryData) => {
                        if (categoryId) {
                          setValue('parentId', categoryId);
                          setError('parentId', { message: undefined });
                          setSelectedParentData(categoryData || null);
                        } else {
                          setValue('parentId', undefined);
                          setSelectedParentData(null);
                        }
                      }}
                      categories={categories}
                      loading={categoriesLoading}
                      className="w-full"
                    />

                    {/* Display selected parent */}
                    {selectedParentData && (
                      <div className="bg-muted/50 p-2 border rounded-md text-muted-foreground text-sm">
                        <span className="font-medium">Selected: </span>
                        {selectedParentData.parentPath.length > 0 && (
                          <span>
                            {selectedParentData.parentPath.join(' → ')} →{' '}
                          </span>
                        )}
                        <span className="font-semibold text-foreground">
                          {selectedParentData.name}
                        </span>
                      </div>
                    )}

                    <p className="text-muted-foreground text-xs">
                      Leave empty to create a top-level category
                    </p>
                    {errors.parentId && (
                      <p className="text-destructive text-sm">
                        {errors.parentId.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
            disabled={totalIsLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={totalIsLoading}>
            <Save className="mr-2 w-4 h-4" />
            {totalIsLoading
              ? 'Saving...'
              : initialData
                ? 'Update Category'
                : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
