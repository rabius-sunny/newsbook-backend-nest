import { PrismaClient, Advertisement } from '@prisma/client';

const advertisementData = [
  {
    title: 'শীতকালীন সেল - ৫০% পর্যন্ত ছাড়',
    description: 'সব ধরনের শীতের পোশাকে বিশাল ছাড়। সীমিত সময়ের অফার!',
    imageUrl: 'https://picsum.photos/seed/ad-winter/728/90',
    clickUrl: 'https://example.com/winter-sale',
    position: 'header',
    isActive: true,
    impressions: 15420,
    clicks: 342,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
  },
  {
    title: 'নতুন স্মার্টফোন - অর্ডার করুন এখনই',
    description:
      'সর্বশেষ প্রযুক্তির স্মার্টফোন এখন বাংলাদেশে। প্রি-অর্ডার চলছে।',
    imageUrl: 'https://picsum.photos/seed/ad-phone/300/250',
    clickUrl: 'https://example.com/new-smartphone',
    position: 'sidebar',
    isActive: true,
    impressions: 8930,
    clicks: 156,
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-06-30'),
  },
  {
    title: 'অনলাইন কোর্স - ফ্রি ট্রায়াল',
    description: 'প্রোগ্রামিং, ডিজাইন, মার্কেটিং শিখুন বিশেষজ্ঞদের কাছ থেকে।',
    imageUrl: 'https://picsum.photos/seed/ad-course/728/90',
    clickUrl: 'https://example.com/online-courses',
    position: 'content',
    isActive: true,
    impressions: 12560,
    clicks: 289,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-12-31'),
  },
  {
    title: 'বিকাশ - নিরাপদ লেনদেন',
    description: 'বিকাশ দিয়ে সহজে টাকা পাঠান, বিল পরিশোধ করুন।',
    imageUrl: 'https://picsum.photos/seed/ad-bkash/300/250',
    clickUrl: 'https://example.com/bkash',
    position: 'sidebar',
    isActive: true,
    impressions: 25890,
    clicks: 567,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
  },
  {
    title: 'ট্রাভেল এজেন্সি - ছুটির প্যাকেজ',
    description:
      'কক্সবাজার, সেন্টমার্টিন, সুন্দরবন ট্যুর প্যাকেজ। এখনই বুক করুন!',
    imageUrl: 'https://picsum.photos/seed/ad-travel/728/90',
    clickUrl: 'https://example.com/travel-packages',
    position: 'footer',
    isActive: true,
    impressions: 6780,
    clicks: 123,
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-09-30'),
  },
];

export async function seedAdvertisements(
  prisma: PrismaClient,
): Promise<Advertisement[]> {
  const advertisements: Advertisement[] = [];

  for (const data of advertisementData) {
    // Use create since there's no unique field to upsert on
    const ad = await prisma.advertisement.create({
      data,
    });
    advertisements.push(ad);
  }

  return advertisements;
}
