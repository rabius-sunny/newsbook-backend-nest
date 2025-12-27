'use client'

import { TableLoading } from '@/components/admin'
import { DataTable, type ActionItem, type Column } from '@/components/admin/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAsync from '@/hooks/useAsync'
import { Check, Plus, Users, X } from 'lucide-react'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'
import type { TAuthors, UserPublic } from '../../../../../api-types'
import { AuthorFormDialog } from './author-form-dialog'
import { DeleteAuthorDialog } from './delete-author-dialog'

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return 'Not set'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRoleBadgeVariant = (role: string) => {
  const variants = {
    admin: 'destructive',
    editor: 'default',
    author: 'secondary',
    contributor: 'outline'
  } as const

  return variants[role as keyof typeof variants] || 'outline'
}

export function AuthorsPageContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<UserPublic | null>(null)
  const [deletingAuthor, setDeletingAuthor] = useState<UserPublic | null>(null)

  // Fetch authors from API using useAsync hook
  const {
    data: authorsResponse,
    loading,
    error,
    mutate: refetchAuthors
  } = useAsync<TAuthors>('/authors')

  const authors = authorsResponse?.data || []
  const totalAuthors = authors.length

  const columns: Column<UserPublic>[] = [
    {
      key: 'name',
      label: 'Author',
      render: (_, item) => (
        <div className='flex items-center gap-3'>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={item.avatar || undefined} alt={item.name} />
            <AvatarFallback>
              {item.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{item.name}</div>
            <div className='text-muted-foreground text-sm'>{item.email}</div>
          </div>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    {
      key: 'role',
      label: 'Role',
      render: (_, item) => (
        <Badge variant={getRoleBadgeVariant(item.role)} className='capitalize'>
          {item.role}
        </Badge>
      )
    },
    {
      key: 'bio',
      label: 'Bio',
      render: (_, item) => (
        <div className='max-w-xs'>
          {item.bio ? (
            <p className='text-muted-foreground text-sm line-clamp-2'>{item.bio}</p>
          ) : (
            <span className='text-muted-foreground text-sm italic'>No bio provided</span>
          )}
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (_, item) => (
        <div className='flex items-center gap-1'>
          {item.isActive ? (
            <>
              <Check className='w-4 h-4 text-green-600' />
              <span className='font-medium text-green-600 text-sm'>Active</span>
            </>
          ) : (
            <>
              <X className='w-4 h-4 text-red-600' />
              <span className='font-medium text-red-600 text-sm'>Inactive</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_, item) => (
        <div className='text-muted-foreground text-sm'>{formatDate(item.createdAt)}</div>
      ),
      className: 'min-w-[140px]'
    }
  ]

  const actions: ActionItem<UserPublic>[] = [
    {
      label: 'Edit',
      onClick: (item) => {
        setEditingAuthor(item)
      }
    },
    {
      label: 'Delete',
      onClick: (item) => {
        if (item.role === 'admin') {
          toast.error('Cannot delete admin users')
          return
        }
        setDeletingAuthor(item)
      },
      variant: 'destructive',
      divider: true
    }
  ]

  const handleAuthorCreated = () => {
    setIsCreateDialogOpen(false)
    refetchAuthors()
  }

  const handleAuthorUpdated = () => {
    setEditingAuthor(null)
    refetchAuthors()
  }

  const handleAuthorDeleted = () => {
    setDeletingAuthor(null)
    refetchAuthors()
  }

  // Show error state
  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='font-bold text-2xl'>Authors</h1>
            <p className='text-muted-foreground'>Manage authors and their access levels</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className='mr-2 w-4 h-4' />
            Add Author
          </Button>
        </div>

        <div className='flex justify-center items-center h-64'>
          <div className='text-destructive'>
            Error loading authors: {error?.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='font-bold text-2xl'>Authors</h1>
          <p className='text-muted-foreground'>Manage authors and their access levels</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} disabled={loading}>
          <Plus className='mr-2 w-4 h-4' />
          Add Author
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='gap-4 grid md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Total Authors</CardTitle>
            <Users className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>{totalAuthors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Active Authors</CardTitle>
            <Check className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>
              {authors.filter((author) => author.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Admins</CardTitle>
            <Badge variant='destructive' className='text-xs'>
              {authors.filter((author) => author.role === 'admin').length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>System administrators</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Editors</CardTitle>
            <Badge className='text-xs'>
              {authors.filter((author) => author.role === 'editor').length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>Content editors</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      {loading ? (
        <TableLoading columns={5} rows={8} />
      ) : (
        <DataTable
          data={authors}
          columns={columns}
          actions={actions}
          emptyMessage='No authors found. Add your first author to get started.'
          showSearch={false}
          showPagination={false}
        />
      )}

      {/* Dialogs */}
      <AuthorFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleAuthorCreated}
      />

      {editingAuthor && (
        <AuthorFormDialog
          open={!!editingAuthor}
          onOpenChange={(open: boolean) => !open && setEditingAuthor(null)}
          author={editingAuthor}
          onSuccess={handleAuthorUpdated}
        />
      )}

      {deletingAuthor && (
        <DeleteAuthorDialog
          open={!!deletingAuthor}
          onOpenChange={(open: boolean) => !open && setDeletingAuthor(null)}
          author={deletingAuthor}
          onSuccess={handleAuthorDeleted}
        />
      )}
    </div>
  )
}

export default function AuthorsPage() {
  return (
    <Suspense fallback={<TableLoading columns={6} rows={8} />}>
      <AuthorsPageContent />
    </Suspense>
  )
}
