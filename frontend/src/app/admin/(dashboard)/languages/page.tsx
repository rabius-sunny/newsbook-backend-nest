'use client';

import { TableLoading } from '@/components/admin';
import {
  DataTable,
  type ActionItem,
  type Column,
} from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAsync from '@/hooks/useAsync';
import type { Language, TLanguageList } from '@/types/language.types';
import { Check, Globe, Plus, X } from 'lucide-react';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { DeleteLanguageDialog } from './delete-language-dialog';
import { LanguageFormDialog } from './language-form-dialog';

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return 'Not set';
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function LanguagesPage() {
  return (
    <Suspense fallback={<TableLoading columns={6} rows={8} />}>
      <LanguagesPageContent />
    </Suspense>
  );
}

export function LanguagesPageContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [deletingLanguage, setDeletingLanguage] = useState<Language | null>(
    null,
  );

  // Fetch languages from API using useAsync hook
  const {
    data: languagesResponse,
    loading,
    error,
    mutate: refetchLanguages,
  } = useAsync<TLanguageList>('/admin/languages');

  const languages = languagesResponse?.data || [];
  const totalLanguages = languages.length;

  const columns: Column<Language>[] = [
    {
      key: 'code',
      label: 'Code',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {item.code.toUpperCase()}
          </Badge>
          {item.isDefault && (
            <Badge variant="default" className="text-xs">
              Default
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Language Name',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'direction',
      label: 'Direction',
      render: (_, item) => (
        <Badge variant="secondary" className="text-xs">
          {item.direction.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (_, item) => (
        <div className="flex items-center gap-1">
          {item.isActive ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-600 text-sm">Active</span>
            </>
          ) : (
            <>
              <X className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-600 text-sm">Inactive</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_, item) => (
        <div className="text-muted-foreground text-sm">
          {formatDate(item.createdAt)}
        </div>
      ),
      className: 'min-w-[140px]',
    },
  ];

  const actions: ActionItem<Language>[] = [
    {
      label: 'Edit',
      onClick: (item) => {
        setEditingLanguage(item);
      },
    },
    {
      label: 'Delete',
      onClick: (item) => {
        if (item.isDefault) {
          toast.error('Cannot delete the default language');
          return;
        }
        setDeletingLanguage(item);
      },
      variant: 'destructive',
      divider: true,
    },
  ];

  const handleLanguageCreated = () => {
    setIsCreateDialogOpen(false);
    refetchLanguages();
  };

  const handleLanguageUpdated = () => {
    setEditingLanguage(null);
    refetchLanguages();
  };

  const handleLanguageDeleted = () => {
    setDeletingLanguage(null);
    refetchLanguages();
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-2xl">Languages</h1>
            <p className="text-muted-foreground">
              Manage supported languages for your application
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 w-4 h-4" />
            Add Language
          </Button>
        </div>

        <div className="flex justify-center items-center h-64">
          <div className="text-destructive">
            Error loading languages: {error?.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Languages</h1>
          <p className="text-muted-foreground">
            Manage supported languages for your application
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} disabled={loading}>
          <Plus className="mr-2 w-4 h-4" />
          Add Language
        </Button>
      </div>

      {/* Stats Card */}
      <div className="gap-4 grid md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Languages
            </CardTitle>
            <Globe className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalLanguages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Languages
            </CardTitle>
            <Check className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {languages.filter((lang) => lang.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Default Language
            </CardTitle>
            <Badge className="text-xs">
              {languages.find((lang) => lang.isDefault)?.code.toUpperCase() ||
                'None'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">
              {languages.find((lang) => lang.isDefault)?.name ||
                'No default set'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      {loading ? (
        <TableLoading columns={5} rows={6} />
      ) : (
        <DataTable
          data={languages}
          columns={columns}
          actions={actions}
          emptyMessage="No languages found. Add your first language to get started."
          showSearch={false}
          showPagination={false}
        />
      )}

      {/* Dialogs */}
      <LanguageFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleLanguageCreated}
      />

      {editingLanguage && (
        <LanguageFormDialog
          open={!!editingLanguage}
          onOpenChange={(open: boolean) => !open && setEditingLanguage(null)}
          language={editingLanguage}
          onSuccess={handleLanguageUpdated}
        />
      )}

      {deletingLanguage && (
        <DeleteLanguageDialog
          open={!!deletingLanguage}
          onOpenChange={(open: boolean) => !open && setDeletingLanguage(null)}
          language={deletingLanguage}
          onSuccess={handleLanguageDeleted}
        />
      )}
    </div>
  );
}
