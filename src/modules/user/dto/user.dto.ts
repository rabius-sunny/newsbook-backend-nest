import { z } from 'zod';
import {
  userChangePasswordSchema,
  userCreateSchema,
  userQuerySchema,
  userUpdateSchema,
} from './user.schema';

export type CreateUserDto = z.infer<typeof userCreateSchema>;
export type UpdateUserDto = z.infer<typeof userUpdateSchema>;
export type UserQueryDto = z.infer<typeof userQuerySchema>;
export type ChangePasswordDto = z.infer<typeof userChangePasswordSchema>;
