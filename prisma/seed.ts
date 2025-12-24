import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { seedLanguages } from './seeds/language.seed';
import { seedUsers } from './seeds/user.seed';
import { seedCategories } from './seeds/category.seed';
import { seedTags } from './seeds/tag.seed';
import { seedArticles } from './seeds/article.seed';
import { seedComments } from './seeds/comment.seed';
import { seedAdvertisements } from './seeds/advertisement.seed';

// Initialize Prisma with pg adapter (matching PrismaService configuration)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Table names matching Prisma schema @@map values
const tables = [
  'languages',
  'users',
  'categories',
  'tags',
  'articles',
  'article_tags',
  'article_translations',
  'comments',
  'newsletters',
  'advertisements',
  'gallery',
  'settings',
  'AuditLog',
];

/**
 * Clear all tables and reset ID sequences to 1
 */
async function resetDatabase() {
  console.log('🗑️  Clearing existing data and resetting sequences...\n');

  // Disable foreign key checks temporarily
  await prisma.$executeRawUnsafe('SET session_replication_role = replica;');

  // Truncate all tables and reset identity
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
      );
      console.log(`   ✓ Cleared ${table}`);
    } catch {
      // Table might not exist yet, skip silently
    }
  }

  // Re-enable foreign key checks
  await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');

  console.log('');
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Reset all tables and sequences first
  await resetDatabase();

  // Order matters due to foreign key constraints
  // 1. Languages (required by articles)
  console.log('📌 Seeding languages...');
  const languages = await seedLanguages(prisma);
  console.log(`   ✅ Created ${languages.length} languages\n`);

  // 2. Users (required by articles as authors)
  console.log('📌 Seeding users...');
  const users = await seedUsers(prisma);
  console.log(`   ✅ Created ${users.length} users\n`);

  // 3. Categories (required by articles)
  console.log('📌 Seeding categories...');
  const categories = await seedCategories(prisma);
  console.log(`   ✅ Created ${categories.length} categories\n`);

  // 4. Tags (connected to articles via junction table)
  console.log('📌 Seeding tags...');
  const tags = await seedTags(prisma);
  console.log(`   ✅ Created ${tags.length} tags\n`);

  // 5. Articles (depends on languages, users, categories)
  console.log('📌 Seeding articles...');
  const articles = await seedArticles(prisma, {
    languages,
    users,
    categories,
    tags,
  });
  console.log(`   ✅ Created ${articles.length} articles\n`);

  // 6. Comments (depends on articles)
  console.log('📌 Seeding comments...');
  const comments = await seedComments(prisma, articles);
  console.log(`   ✅ Created ${comments.length} comments\n`);

  // 7. Advertisements (no dependencies)
  console.log('📌 Seeding advertisements...');
  const advertisements = await seedAdvertisements(prisma);
  console.log(`   ✅ Created ${advertisements.length} advertisements\n`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
