import { z } from 'zod';

// User roles enum
export const userRoles = [
  'admin',
  'editor',
  'reporter',
  'contributor',
] as const;
export type UserRole = (typeof userRoles)[number];

// Base user schema
const baseUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  role: z.enum(userRoles).default('reporter'),
  isActive: z.boolean().default(true),
  meta: z.record(z.string(), z.any()).optional(),
});

// Create user schema
export const userCreateSchema = baseUserSchema;

// Update user schema - all fields optional, exclude password for security
export const userUpdateSchema = baseUserSchema.partial().omit({
  password: true,
});

// Change password schema
export const userChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// Query parameters for user filtering
export const userQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0)
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 100)
    .optional(),
  q: z.string().max(100).optional(),
  role: z.enum(userRoles).optional(),
  active: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['name', 'email', 'role', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Params validation
export const userParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
