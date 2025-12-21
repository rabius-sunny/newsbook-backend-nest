import { User } from '@prisma/client';

// User without password for public responses
export type UserPublic = Omit<User, 'password'>;

export interface UserWithArticleCount extends UserPublic {
  articleCount: number;
}
