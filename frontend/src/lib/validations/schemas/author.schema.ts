import { z } from 'zod';

// User roles enum for validation
const userRoles = ['admin', 'editor', 'author', 'contributor'] as const;

// Create author schema - all required fields
export const authorCreateSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must not exceed 100 characters'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),

  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),

  avatar: z.string().url('Avatar must be a valid URL').optional(),

  role: z.enum(userRoles),

  isActive: z.boolean(),

  meta: z.record(z.string(), z.any()).optional(),
});

// Update author schema - all fields optional except password handling
export const authorUpdateSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must not exceed 100 characters')
    .optional(),

  // Password is optional for updates - only validate if provided
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    )
    .optional(),

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .optional(),

  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),

  avatar: z.string().url('Avatar must be a valid URL').optional(),

  role: z.enum(userRoles).optional(),

  isActive: z.boolean().optional(),

  meta: z.record(z.string(), z.any()).optional(),
});

// Query parameters for author filtering
export const authorQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  query: z.string().max(200).optional(),
  role: z.enum(userRoles).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy: z
    .enum(['name', 'email', 'role', 'createdAt', 'updatedAt'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Params validation
export const authorParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

// Export types
export type AuthorCreateInput = z.infer<typeof authorCreateSchema>;
export type AuthorUpdateInput = z.infer<typeof authorUpdateSchema>;
export type AuthorQueryParams = z.infer<typeof authorQuerySchema>;
export type AuthorPathParams = z.infer<typeof authorParamsSchema>;

// Export user roles for use in components
export const USER_ROLES = userRoles;
export type UserRole = (typeof userRoles)[number];
