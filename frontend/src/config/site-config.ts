import {
  FileCode2,
  FileText,
  Languages,
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  Settings,
  Users2,
} from 'lucide-react'

export const navData = {
  user: {
    name: 'admin',
    email: 'admin@bdnews.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'All News',
      url: '/admin/news',
      icon: Newspaper,
    },
    {
      title: 'Create New News',
      url: '/admin/news/create',
      icon: PlusCircle,
    },
    {
      title: 'Categories',
      url: '/admin/categories',
      icon: PlusCircle,
    },
    {
      title: 'All Languages',
      url: '/admin/languages',
      icon: Languages,
    },
    {
      title: 'Manage Pages',
      url: '/admin/settings/pages',
      icon: FileText,
    },
    {
      title: 'All Authors',
      url: '/admin/author',
      icon: Users2,
    },
  ],

  navSecondary: [
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings,
    },
    {
      title: 'Header Script',
      url: '/admin/settings/header-scripts',
      icon: FileCode2,
    },
  ],
}
