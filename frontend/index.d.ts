type Params<Key extends string> = Promise<{ [K in Key]: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
type PageProps = {
  params: Params
  searchParams: SearchParams
}

type Author = { id: number; name: string; avatar: string | null }
type Tag = { id: number; name: string; slug: string }

type Category = {
  id: number
  name: string
  description: string
  image: string | null
  names: Record<string, string>
  descriptions: Record<string, string>
  slug: string
  parentId: number | null
  displayOrder: number
  isActive: boolean
  depth: number
  path: string
  seo: Record<string, any> | null
  meta: Record<string, any> | null
  createdAt: string
  updatedAt: string
  children: Category[]
}

type News = {
  id: number
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  imageCaption: string
  isPublished: boolean
  publishedAt: string
  isFeatured: boolean
  isBreaking: boolean
  priority: number
  viewCount: number
  likeCount: number
  commentCount: number
  location: string
  createdAt: string
  updatedAt: string
  category: Pick<Category, 'id' | 'name' | 'slug'>
  author: Pick<Author, 'id' | 'name' | 'avatar'>
  tags: Tag[]
  content?: {
    blocks: Array<{
      id: string
      type: 'text' | 'quote' | 'image' | 'video' | 'imageWithText' | 'banner' | 'relatedNews'
      order: number
      data: any
    }>
    version: string
  }
}

type NewsComment = {
  id: number
  articleId: number
  authorName: string
  authorEmail: string
  content: string
  createdAt: string
  updatedAt: string
}

type NewsCardVariant =
  | 'default'
  | 'slim'
  | 'slimList'
  | 'minimal'
  | 'minimalSimple'
  | 'simple'
  | 'compact'
  | 'compactSlim'
  | 'compactMinimal'
  | 'compactDivided'
  | 'compactList'
  | 'compactSimple'
  | 'banner'
  | 'featured'
