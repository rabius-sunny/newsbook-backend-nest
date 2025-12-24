import { PrismaClient, User } from '@prisma/client';

const userData = [
  {
    email: 'admin@gratebangla.com',
    password: '$2b$10$dummy.hashed.password.for.seeding.only1', // In production, use bcrypt
    name: 'Admin User',
    bio: 'System administrator with full access to all features.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    isActive: true,
    meta: {
      phone: '+8801700000001',
      department: 'Administration',
    },
  },
  {
    email: 'editor@gratebangla.com',
    password: '$2b$10$dummy.hashed.password.for.seeding.only2',
    name: 'রহিম উদ্দিন',
    bio: 'Senior editor with 10 years of experience in journalism.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    role: 'editor',
    isActive: true,
    meta: {
      phone: '+8801700000002',
      department: 'Editorial',
    },
  },
  {
    email: 'reporter@gratebangla.com',
    password: '$2b$10$dummy.hashed.password.for.seeding.only3',
    name: 'করিম হোসেন',
    bio: 'Field reporter covering national and political news.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reporter',
    role: 'reporter',
    isActive: true,
    meta: {
      phone: '+8801700000003',
      department: 'News',
    },
  },
];

export async function seedUsers(prisma: PrismaClient): Promise<User[]> {
  const users: User[] = [];

  for (const data of userData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: data,
      create: data,
    });
    users.push(user);
  }

  return users;
}
