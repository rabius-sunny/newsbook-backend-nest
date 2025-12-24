import {
  PrismaClient,
  Article,
  Language,
  User,
  Category,
  Tag,
} from '@prisma/client';

interface SeedDependencies {
  languages: Language[];
  users: User[];
  categories: Category[];
  tags: Tag[];
}

// Helper to get random items from array
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper to get random item
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate slug from title
function generateSlug(title: string, index: number): string {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + `-${index}`
  );
}

const articleTemplates = [
  {
    title: 'বাংলাদেশের অর্থনৈতিক প্রবৃদ্ধি ৭ শতাংশ ছাড়িয়ে যাবে',
    excerpt:
      'বিশ্বব্যাংকের প্রতিবেদন অনুযায়ী আগামী অর্থবছরে বাংলাদেশের জিডিপি প্রবৃদ্ধি ৭.২ শতাংশে পৌঁছাবে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'বিশ্বব্যাংকের সর্বশেষ প্রতিবেদন অনুযায়ী, বাংলাদেশের অর্থনৈতিক প্রবৃদ্ধি আগামী অর্থবছরে ৭.২ শতাংশে পৌঁছাবে বলে আশা করা হচ্ছে। এটি দক্ষিণ এশিয়ার মধ্যে সর্বোচ্চ প্রবৃদ্ধির হার।',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'প্রতিবেদনে বলা হয়েছে, তৈরি পোশাক রপ্তানি, রেমিট্যান্স প্রবাহ এবং অভ্যন্তরীণ চাহিদা বৃদ্ধি এই প্রবৃদ্ধির প্রধান চালিকাশক্তি।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'বিশ্বব্যাংক',
  },
  {
    title: 'জাতীয় ক্রিকেট দল বিশ্বকাপের প্রস্তুতি শুরু করেছে',
    excerpt:
      'আগামী মাসে অনুষ্ঠেয় বিশ্বকাপের জন্য বাংলাদেশ ক্রিকেট দলের প্রশিক্ষণ শুরু হয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'বাংলাদেশ ক্রিকেট দল আগামী মাসে অনুষ্ঠেয় বিশ্বকাপের জন্য মিরপুর শেরে বাংলা জাতীয় স্টেডিয়ামে প্রশিক্ষণ শুরু করেছে।',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'দলের অধিনায়ক জানিয়েছেন, তারা এবার সেমিফাইনালে উঠতে দৃঢ় প্রতিজ্ঞ।',
            },
          ],
        },
      ],
    },
    location: 'মিরপুর',
    source: 'বিসিবি',
  },
  {
    title: 'নতুন শিক্ষানীতি ঘোষণা করলেন শিক্ষামন্ত্রী',
    excerpt:
      'শিক্ষাক্ষেত্রে আমূল পরিবর্তন আনতে নতুন শিক্ষানীতি ঘোষণা করা হয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'শিক্ষামন্ত্রী আজ সংবাদ সম্মেলনে নতুন শিক্ষানীতি ঘোষণা করেছেন। এই নীতিতে প্রযুক্তি নির্ভর শিক্ষা ব্যবস্থার উপর বিশেষ গুরুত্ব দেওয়া হয়েছে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'শিক্ষা মন্ত্রণালয়',
  },
  {
    title: 'পদ্মা সেতুতে যানজট এড়াতে নতুন নিয়ম',
    excerpt: 'পদ্মা সেতুতে যানজট কমাতে নতুন ট্রাফিক নিয়ম চালু করা হচ্ছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'পদ্মা সেতুতে ক্রমবর্ধমান যানজট সমস্যা সমাধানে কর্তৃপক্ষ নতুন ট্রাফিক ব্যবস্থাপনা নিয়ম চালু করতে যাচ্ছে।',
            },
          ],
        },
      ],
    },
    location: 'মাওয়া',
    source: 'সেতু কর্তৃপক্ষ',
  },
  {
    title: 'ঢাকায় নতুন মেট্রোরেল লাইন উদ্বোধন',
    excerpt: 'রাজধানীতে দ্বিতীয় মেট্রোরেল লাইন আজ আনুষ্ঠানিকভাবে চালু হলো।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'ঢাকা মেট্রোরেলের দ্বিতীয় লাইন আজ প্রধানমন্ত্রী উদ্বোধন করেছেন। এই লাইনটি গাজীপুর থেকে মতিঝিল পর্যন্ত বিস্তৃত।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'ডিএমটিসিএল',
  },
  {
    title: 'দেশে আইটি রপ্তানি ১ বিলিয়ন ডলার ছাড়িয়েছে',
    excerpt:
      'তথ্যপ্রযুক্তি খাতে রপ্তানি আয় প্রথমবারের মতো ১ বিলিয়ন ডলার অতিক্রম করেছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'বাংলাদেশের তথ্যপ্রযুক্তি খাতে রপ্তানি আয় ঐতিহাসিক মাইলফলক অতিক্রম করেছে। চলতি অর্থবছরে আইটি রপ্তানি ১ বিলিয়ন ডলার ছাড়িয়ে গেছে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'বেসিস',
  },
  {
    title: 'ভারতের সাথে নতুন বাণিজ্য চুক্তি স্বাক্ষর',
    excerpt:
      'বাংলাদেশ ও ভারতের মধ্যে দ্বিপাক্ষিক বাণিজ্য বৃদ্ধিতে নতুন চুক্তি স্বাক্ষরিত হয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'দুই দেশের বাণিজ্যমন্ত্রীরা আজ নয়াদিল্লিতে একটি গুরুত্বপূর্ণ বাণিজ্য চুক্তি স্বাক্ষর করেছেন।',
            },
          ],
        },
      ],
    },
    location: 'নয়াদিল্লি',
    source: 'বাণিজ্য মন্ত্রণালয়',
  },
  {
    title: 'চট্টগ্রাম বন্দরে রেকর্ড পরিমাণ কনটেইনার হ্যান্ডলিং',
    excerpt:
      'চট্টগ্রাম বন্দরে একদিনে রেকর্ড সংখ্যক কনটেইনার হ্যান্ডলিং হয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'চট্টগ্রাম বন্দর কর্তৃপক্ষ জানিয়েছে, গতকাল একদিনে ৮,০০০ টিইইউ কনটেইনার হ্যান্ডলিং করা হয়েছে যা একটি নতুন রেকর্ড।',
            },
          ],
        },
      ],
    },
    location: 'চট্টগ্রাম',
    source: 'সিপিএ',
  },
  {
    title: 'প্রবাসীদের রেমিট্যান্স প্রবাহ বেড়েছে ১৫ শতাংশ',
    excerpt: 'চলতি অর্থবছরে প্রবাসী আয় উল্লেখযোগ্য হারে বৃদ্ধি পেয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'বাংলাদেশ ব্যাংকের তথ্য অনুযায়ী, চলতি অর্থবছরে প্রবাসী আয় গত বছরের একই সময়ের তুলনায় ১৫ শতাংশ বেড়েছে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'বাংলাদেশ ব্যাংক',
  },
  {
    title: 'ঢালিউডে নতুন চলচ্চিত্রের ঢল',
    excerpt: 'এই ঈদে মুক্তি পাচ্ছে একাধিক বাংলা চলচ্চিত্র।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'আগামী ঈদে ঢালিউডে মোট ৮টি চলচ্চিত্র মুক্তি পাচ্ছে। শীর্ষ তারকাদের অভিনীত এসব ছবি নিয়ে দর্শকদের মধ্যে ব্যাপক উৎসাহ দেখা যাচ্ছে।',
            },
          ],
        },
      ],
    },
    location: 'এফডিসি',
    source: 'বাংলাদেশ চলচ্চিত্র সংসদ',
  },
  {
    title: 'দেশে ডেঙ্গু পরিস্থিতি নিয়ন্ত্রণে',
    excerpt:
      'স্বাস্থ্য অধিদপ্তর জানিয়েছে, ডেঙ্গু পরিস্থিতি এখন অনেকটাই নিয়ন্ত্রণে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'গত সপ্তাহে ডেঙ্গু রোগীর সংখ্যা উল্লেখযোগ্য হারে কমেছে। স্বাস্থ্য অধিদপ্তরের তথ্য অনুযায়ী, পরিস্থিতি এখন নিয়ন্ত্রণে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'স্বাস্থ্য অধিদপ্তর',
  },
  {
    title: 'নতুন স্যাটেলাইট উৎক্ষেপণ করবে বাংলাদেশ',
    excerpt: 'বঙ্গবন্ধু স্যাটেলাইট-২ আগামী বছর উৎক্ষেপণ করা হবে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'টেলিযোগাযোগ মন্ত্রী জানিয়েছেন, বঙ্গবন্ধু স্যাটেলাইট-২ আগামী বছরের মাঝামাঝি সময়ে উৎক্ষেপণ করা হবে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'বিটিআরসি',
  },
  {
    title: 'শেয়ারবাজারে লেনদেন বেড়েছে',
    excerpt: 'ঢাকা স্টক এক্সচেঞ্জে আজ লেনদেন উল্লেখযোগ্য হারে বেড়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'ঢাকা স্টক এক্সচেঞ্জে আজ মোট ১,২০০ কোটি টাকার লেনদেন হয়েছে যা গত সপ্তাহের তুলনায় ২০ শতাংশ বেশি।',
            },
          ],
        },
      ],
    },
    location: 'মতিঝিল',
    source: 'ডিএসই',
  },
  {
    title: 'কক্সবাজারে পর্যটক সমাগম বেড়েছে',
    excerpt: 'শীতের মৌসুমে কক্সবাজারে পর্যটকদের সমাগম রেকর্ড পরিমাণে বেড়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'কক্সবাজার পর্যটন পুলিশ জানিয়েছে, এই মৌসুমে এখন পর্যন্ত ৫০ লাখেরও বেশি পর্যটক সমুদ্র সৈকত পরিদর্শন করেছেন।',
            },
          ],
        },
      ],
    },
    location: 'কক্সবাজার',
    source: 'পর্যটন কর্পোরেশন',
  },
  {
    title: 'গ্যাসের দাম বাড়ানোর প্রস্তাব',
    excerpt: 'এনার্জি রেগুলেটরি কমিশন গ্যাসের দাম বাড়ানোর প্রস্তাব দিয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (বিইআরসি) গ্যাসের দাম ১০ শতাংশ বাড়ানোর প্রস্তাব দিয়েছে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'বিইআরসি',
  },
  {
    title: 'বিশ্ববিদ্যালয়ে ভর্তি পরীক্ষার তারিখ ঘোষণা',
    excerpt:
      'পাবলিক বিশ্ববিদ্যালয়ে সমন্বিত ভর্তি পরীক্ষার তারিখ ঘোষণা করা হয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'ইউজিসি জানিয়েছে, আগামী মাসের ১৫ তারিখ থেকে পাবলিক বিশ্ববিদ্যালয়ে সমন্বিত ভর্তি পরীক্ষা শুরু হবে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'ইউজিসি',
  },
  {
    title: 'নতুন হাইওয়ে নির্মাণ কাজ শুরু',
    excerpt: 'ঢাকা-মাওয়া-ভাঙ্গা এক্সপ্রেসওয়ে সম্প্রসারণ কাজ শুরু হয়েছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'সড়ক ও জনপথ বিভাগ জানিয়েছে, ঢাকা-মাওয়া-ভাঙ্গা এক্সপ্রেসওয়ে ৮ লেনে উন্নীত করার কাজ শুরু হয়েছে।',
            },
          ],
        },
      ],
    },
    location: 'মাওয়া',
    source: 'সড়ক বিভাগ',
  },
  {
    title: 'দেশে মোবাইল ইন্টারনেট ব্যবহারকারী ১৫ কোটি ছাড়িয়েছে',
    excerpt: 'মোবাইল ইন্টারনেট গ্রাহক সংখ্যা নতুন মাইলফলক স্পর্শ করেছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'বিটিআরসির তথ্য অনুযায়ী, দেশে মোবাইল ইন্টারনেট গ্রাহক সংখ্যা ১৫ কোটি ছাড়িয়ে গেছে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'বিটিআরসি',
  },
  {
    title: 'কৃষি খাতে নতুন ভর্তুকি ঘোষণা',
    excerpt: 'সরকার কৃষকদের জন্য নতুন ভর্তুকি প্যাকেজ ঘোষণা করেছে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'কৃষিমন্ত্রী জানিয়েছেন, আগামী অর্থবছরে কৃষি খাতে ১০ হাজার কোটি টাকার ভর্তুকি দেওয়া হবে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'কৃষি মন্ত্রণালয়',
  },
  {
    title: 'আবহাওয়ার পূর্বাভাস: আগামী সপ্তাহে বৃষ্টি',
    excerpt:
      'আবহাওয়া অফিস জানিয়েছে, আগামী সপ্তাহে দেশের বিভিন্ন স্থানে বৃষ্টিপাত হতে পারে।',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'আবহাওয়া অধিদপ্তর জানিয়েছে, বঙ্গোপসাগরে একটি লঘুচাপ সৃষ্টি হওয়ায় আগামী সপ্তাহে দেশের দক্ষিণ ও মধ্যাঞ্চলে বৃষ্টিপাত হতে পারে।',
            },
          ],
        },
      ],
    },
    location: 'ঢাকা',
    source: 'আবহাওয়া অধিদপ্তর',
  },
];

export async function seedArticles(
  prisma: PrismaClient,
  deps: SeedDependencies,
): Promise<Article[]> {
  const { languages, users, categories, tags } = deps;
  const articles: Article[] = [];

  // Get Bengali language (default)
  const bengaliLang = languages.find((l) => l.code === 'bn') || languages[0];

  for (let i = 0; i < 20; i++) {
    const template = articleTemplates[i % articleTemplates.length];
    const author = getRandomItem(users);
    const category = getRandomItem(categories);
    const articleTags = getRandomItems(tags, Math.floor(Math.random() * 3) + 1);
    const slug = generateSlug(template.title, i + 1);

    // Random publish date within last 30 days
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - Math.floor(Math.random() * 30));

    const article = await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        title: template.title,
        slug,
        excerpt: template.excerpt,
        content: template.content,
        languageId: bengaliLang.id,
        featuredImage: `https://picsum.photos/seed/${slug}/800/400`,
        imageCaption: `${template.title} - ছবি`,
        categoryId: category.id,
        authorId: author.id,
        status: 'published',
        isPublished: true,
        publishedAt,
        isFeatured: i < 3, // First 3 are featured
        isBreaking: i === 0, // First one is breaking
        priority: Math.floor(Math.random() * 5) + 5,
        location: template.location,
        source: template.source,
        viewCount: Math.floor(Math.random() * 10000),
        likeCount: Math.floor(Math.random() * 500),
        commentCount: 0, // Will be updated by comments
        seo: {
          title: template.title,
          description: template.excerpt,
          keywords: 'বাংলাদেশ, সংবাদ, খবর',
        },
        tags: {
          create: articleTags.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
    });

    articles.push(article);
  }

  return articles;
}
