import { PrismaClient, User } from '@prisma/client';
import { createHmac, randomBytes } from 'crypto';

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = createHmac('sha256', salt).update(password).digest('hex');
  return `${salt}:${hash}`;
}

const userData = [
  {
    email: 'admin@gratebangla.com',
    name: 'Admin User',
    bio: 'System administrator with full access to all features.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    isActive: true,
  },
  {
    email: 'editor@gratebangla.com',
    name: 'রহিম উদ্দিন',
    bio: 'Senior editor with 10 years of experience in journalism.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    role: 'editor',
    isActive: true,
  },
  {
    email: 'reporter@gratebangla.com',
    name: 'করিম হোসেন',
    bio: 'Field reporter covering national and political news.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reporter',
    role: 'reporter',
    isActive: true,
  },
];

export async function seedUsers(prisma: PrismaClient): Promise<User[]> {
  const users: User[] = [];

  for (const data of userData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: { ...data, password: await hashPassword('266696687Password.') },
      create: { ...data, password: await hashPassword('266696687Password.') },
    });
    users.push(user);
  }

  return users;
}
