import { PrismaClient, Category } from '@prisma/client';

const categoryData = [
  {
    name: 'জাতীয়',
    slug: 'national',
    description: 'দেশের সকল জাতীয় সংবাদ',
    displayOrder: 1,
    isActive: true,
    depth: 0,
    path: 'national',
    names: { en: 'National' },
    descriptions: { en: 'All national news of the country' },
    seo: {
      title: 'জাতীয় সংবাদ | Grate Bangla',
      description: 'বাংলাদেশের সকল জাতীয় সংবাদ পড়ুন',
      keywords: 'জাতীয়, সংবাদ, বাংলাদেশ, national, news',
    },
  },
  {
    name: 'রাজনীতি',
    slug: 'politics',
    description: 'রাজনৈতিক সংবাদ ও বিশ্লেষণ',
    displayOrder: 2,
    isActive: true,
    depth: 0,
    path: 'politics',
    names: { en: 'Politics' },
    descriptions: { en: 'Political news and analysis' },
    seo: {
      title: 'রাজনীতি | Grate Bangla',
      description: 'রাজনৈতিক সংবাদ ও বিশ্লেষণ',
      keywords: 'রাজনীতি, politics, সংবাদ, বিশ্লেষণ',
    },
  },
  {
    name: 'আন্তর্জাতিক',
    slug: 'international',
    description: 'বিশ্বের সকল গুরুত্বপূর্ণ সংবাদ',
    displayOrder: 3,
    isActive: true,
    depth: 0,
    path: 'international',
    names: { en: 'International' },
    descriptions: { en: 'Important news from around the world' },
    seo: {
      title: 'আন্তর্জাতিক সংবাদ | Grate Bangla',
      description: 'বিশ্বের সকল গুরুত্বপূর্ণ সংবাদ',
      keywords: 'আন্তর্জাতিক, international, বিশ্ব, world',
    },
  },
  {
    name: 'অর্থনীতি',
    slug: 'economy',
    description: 'অর্থনৈতিক সংবাদ ও বাজার বিশ্লেষণ',
    displayOrder: 4,
    isActive: true,
    depth: 0,
    path: 'economy',
    names: { en: 'Economy' },
    descriptions: { en: 'Economic news and market analysis' },
    seo: {
      title: 'অর্থনীতি | Grate Bangla',
      description: 'অর্থনৈতিক সংবাদ ও বাজার বিশ্লেষণ',
      keywords: 'অর্থনীতি, economy, বাজার, market',
    },
  },
  {
    name: 'খেলাধুলা',
    slug: 'sports',
    description: 'ক্রিকেট, ফুটবল ও অন্যান্য খেলার সংবাদ',
    displayOrder: 5,
    isActive: true,
    depth: 0,
    path: 'sports',
    names: { en: 'Sports' },
    descriptions: { en: 'Cricket, football and other sports news' },
    seo: {
      title: 'খেলাধুলা | Grate Bangla',
      description: 'ক্রিকেট, ফুটবল ও অন্যান্য খেলার সংবাদ',
      keywords: 'খেলাধুলা, sports, ক্রিকেট, ফুটবল',
    },
  },
  {
    name: 'বিনোদন',
    slug: 'entertainment',
    description: 'চলচ্চিত্র, সঙ্গীত ও সেলিব্রিটি সংবাদ',
    displayOrder: 6,
    isActive: true,
    depth: 0,
    path: 'entertainment',
    names: { en: 'Entertainment' },
    descriptions: { en: 'Movies, music and celebrity news' },
    seo: {
      title: 'বিনোদন | Grate Bangla',
      description: 'চলচ্চিত্র, সঙ্গীত ও সেলিব্রিটি সংবাদ',
      keywords: 'বিনোদন, entertainment, সিনেমা, গান',
    },
  },
  {
    name: 'প্রযুক্তি',
    slug: 'technology',
    description: 'প্রযুক্তি, গ্যাজেট ও ডিজিটাল সংবাদ',
    displayOrder: 7,
    isActive: true,
    depth: 0,
    path: 'technology',
    names: { en: 'Technology' },
    descriptions: { en: 'Technology, gadgets and digital news' },
    seo: {
      title: 'প্রযুক্তি | Grate Bangla',
      description: 'প্রযুক্তি, গ্যাজেট ও ডিজিটাল সংবাদ',
      keywords: 'প্রযুক্তি, technology, গ্যাজেট, gadget',
    },
  },
  {
    name: 'শিক্ষা',
    slug: 'education',
    description: 'শিক্ষা সংক্রান্ত সকল সংবাদ',
    displayOrder: 8,
    isActive: true,
    depth: 0,
    path: 'education',
    names: { en: 'Education' },
    descriptions: { en: 'All education related news' },
    seo: {
      title: 'শিক্ষা | Grate Bangla',
      description: 'শিক্ষা সংক্রান্ত সকল সংবাদ',
      keywords: 'শিক্ষা, education, পড়াশোনা, school',
    },
  },
  {
    name: 'স্বাস্থ্য',
    slug: 'health',
    description: 'স্বাস্থ্য, চিকিৎসা ও জীবনধারা সংবাদ',
    displayOrder: 9,
    isActive: true,
    depth: 0,
    path: 'health',
    names: { en: 'Health' },
    descriptions: { en: 'Health, medical and lifestyle news' },
    seo: {
      title: 'স্বাস্থ্য | Grate Bangla',
      description: 'স্বাস্থ্য, চিকিৎসা ও জীবনধারা সংবাদ',
      keywords: 'স্বাস্থ্য, health, চিকিৎসা, medical',
    },
  },
  {
    name: 'মতামত',
    slug: 'opinion',
    description: 'সম্পাদকীয়, কলাম ও বিশেষজ্ঞ মতামত',
    displayOrder: 10,
    isActive: true,
    depth: 0,
    path: 'opinion',
    names: { en: 'Opinion' },
    descriptions: { en: 'Editorial, columns and expert opinions' },
    seo: {
      title: 'মতামত | Grate Bangla',
      description: 'সম্পাদকীয়, কলাম ও বিশেষজ্ঞ মতামত',
      keywords: 'মতামত, opinion, সম্পাদকীয়, editorial',
    },
  },
];

export async function seedCategories(
  prisma: PrismaClient,
): Promise<Category[]> {
  const categories: Category[] = [];

  for (const data of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
    categories.push(category);
  }

  return categories;
}
