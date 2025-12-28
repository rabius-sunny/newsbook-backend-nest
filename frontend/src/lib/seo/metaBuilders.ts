import { SiteSettings } from '@/types/siteSettings.type';
import type { Metadata } from 'next';

export const buildSiteMetadata = (data: SiteSettings | null): Metadata => ({
  title: {
    default: data?.seo?.metaTitle || data?.name || 'News',
    template: `%s | ${data?.name ?? 'News'}`,
  },
  description: data?.seo?.metaDescription || data?.shortDescription || '',
  openGraph: {
    title: data?.seo?.metaTitle || data?.name,
    description: data?.seo?.metaDescription || data?.shortDescription || '',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || '',
    images: [
      {
        url: data?.logo?.default || '/default-og-image.jpg',
        width: 800,
        height: 600,
        alt: data?.name || 'News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: data?.seo?.metaTitle || data?.name,
    description: data?.seo?.metaDescription || data?.shortDescription || '',
    images: [data?.logo?.default || '/default-og-image.jpg'],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://example.com',
  ),
  icons: {
    icon: data?.favicon || '/favicon.ico',
    shortcut: data?.favicon || '/favicon.ico',
    apple: data?.favicon || '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: data?.favicon || '/favicon.ico',
        color: data?.theme?.color?.primary || '#5bbad5',
      },
    ],
  },
});

export const buildNewsMetadata = (news: News): Metadata => ({
  title: news?.title,
  description: news?.excerpt,
  openGraph: {
    title: news?.title,
    description: news?.excerpt,
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/news/${news?.slug}`,
    images: [
      {
        url: news?.featuredImage,
        width: 800,
        height: 600,
        alt: news?.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: news?.title,
    description: news?.excerpt,
    images: [news?.featuredImage],
  },
});

export const buildCategoryMetadata = (data: Category): Metadata => ({
  title: data?.name,
  description: data?.description,
  openGraph: {
    title: data?.name,
    description: data?.description,
    type: 'article',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/categories/${data?.slug}`,
    images: data?.image ? [{ url: data?.image }] : [],
  },
});
