import { PrismaClient, Comment, Article } from '@prisma/client';

// Helper to get random item
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const commentAuthors = [
  { name: 'আব্দুল করিম', email: 'karim@example.com' },
  { name: 'ফাতেমা বেগম', email: 'fatema@example.com' },
  { name: 'মোহাম্মদ হাসান', email: 'hasan@example.com' },
  { name: 'নাজমুল ইসলাম', email: 'nazmul@example.com' },
  { name: 'সাবরিনা আক্তার', email: 'sabrina@example.com' },
  { name: 'রফিকুল ইসলাম', email: 'rafiq@example.com' },
  { name: 'শাহানা পারভীন', email: 'shahana@example.com' },
  { name: 'জাহিদুল ইসলাম', email: 'zahid@example.com' },
];

const commentTemplates = [
  'চমৎকার সংবাদ! তথ্যবহুল লেখার জন্য ধন্যবাদ।',
  'এই বিষয়ে আরও বিস্তারিত জানতে চাই।',
  'খুবই গুরুত্বপূর্ণ একটি সংবাদ। শেয়ার করলাম।',
  'সাংবাদিকতার উৎকর্ষ সাধনে আপনাদের অবদান অনন্য।',
  'এই ধরনের সংবাদ আমাদের জানা দরকার। ধন্যবাদ।',
  'তথ্য সমৃদ্ধ প্রতিবেদন। আরও এ ধরনের সংবাদ আশা করি।',
  'সময়োপযোগী সংবাদ। পড়ে উপকৃত হলাম।',
  'বস্তুনিষ্ঠ সাংবাদিকতার উদাহরণ। শুভকামনা রইল।',
  'এই বিষয়ে সরকারের আরও মনোযোগ দেওয়া উচিত।',
  'দারুণ তথ্য! এটা জানা ছিল না।',
  'আপনাদের প্রতিবেদন সবসময় নির্ভরযোগ্য।',
  'এই সংবাদটি পড়ে অনেক কিছু জানলাম।',
  'আশা করি এ বিষয়ে আরও আপডেট পাব।',
  'চমৎকার বিশ্লেষণ। পরবর্তী প্রতিবেদনের অপেক্ষায়।',
  'গুরুত্বপূর্ণ তথ্য দেওয়ার জন্য ধন্যবাদ।',
];

export async function seedComments(
  prisma: PrismaClient,
  articles: Article[],
): Promise<Comment[]> {
  const comments: Comment[] = [];

  for (let i = 0; i < 20; i++) {
    const article = getRandomItem(articles);
    const author = getRandomItem(commentAuthors);
    const content = getRandomItem(commentTemplates);

    // Random date within last 7 days
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 7));
    createdAt.setHours(Math.floor(Math.random() * 24));
    createdAt.setMinutes(Math.floor(Math.random() * 60));

    const comment = await prisma.comment.create({
      data: {
        articleId: article.id,
        authorName: author.name,
        authorEmail: author.email,
        content,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt,
      },
    });

    comments.push(comment);

    // Update article comment count
    await prisma.article.update({
      where: { id: article.id },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });
  }

  return comments;
}
