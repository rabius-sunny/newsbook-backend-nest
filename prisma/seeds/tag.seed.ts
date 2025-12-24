import { PrismaClient, Tag } from '@prisma/client';

const tagData = [
  {
    name: 'ব্রেকিং নিউজ',
    slug: 'breaking-news',
    isActive: true,
    meta: { color: '#dc2626', priority: 1 },
  },
  {
    name: 'এক্সক্লুসিভ',
    slug: 'exclusive',
    isActive: true,
    meta: { color: '#7c3aed', priority: 2 },
  },
  {
    name: 'বাংলাদেশ',
    slug: 'bangladesh',
    isActive: true,
    meta: { color: '#059669', priority: 3 },
  },
  {
    name: 'ক্রিকেট',
    slug: 'cricket',
    isActive: true,
    meta: { color: '#0891b2', priority: 4 },
  },
  {
    name: 'নির্বাচন',
    slug: 'election',
    isActive: true,
    meta: { color: '#ca8a04', priority: 5 },
  },
  {
    name: 'প্রধানমন্ত্রী',
    slug: 'prime-minister',
    isActive: true,
    meta: { color: '#2563eb', priority: 6 },
  },
  {
    name: 'ভারত',
    slug: 'india',
    isActive: true,
    meta: { color: '#ea580c', priority: 7 },
  },
  {
    name: 'প্রবাস',
    slug: 'expatriate',
    isActive: true,
    meta: { color: '#16a34a', priority: 8 },
  },
  {
    name: 'শেয়ার বাজার',
    slug: 'stock-market',
    isActive: true,
    meta: { color: '#4f46e5', priority: 9 },
  },
  {
    name: 'আবহাওয়া',
    slug: 'weather',
    isActive: true,
    meta: { color: '#0284c7', priority: 10 },
  },
];

export async function seedTags(prisma: PrismaClient): Promise<Tag[]> {
  const tags: Tag[] = [];

  for (const data of tagData) {
    const tag = await prisma.tag.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
    tags.push(tag);
  }

  return tags;
}
