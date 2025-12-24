import { z } from 'zod';

// Valid entity types in the system
export const entityTypes = [
  'article',
  'category',
  'user',
  'tag',
  'language',
  'setting',
  'newsletter',
  'advertisement',
  'gallery',
  'comment',
] as const;
export type EntityType = (typeof entityTypes)[number];

// Valid audit actions
export const auditActions = [
  'create',
  'update',
  'delete',
  'publish',
  'unpublish',
  'archive',
] as const;
export type AuditAction = (typeof auditActions)[number];

// Create audit log schema
export const auditLogCreateSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  action: z.enum(auditActions),
  entityType: z.enum(entityTypes),
  entityId: z.number().int().positive('Entity ID must be a positive integer'),
  identity: z.string().max(500).optional(), // IP address and user agent
});

// Query parameters for audit log filtering
export const auditLogQuerySchema = z.object({
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
  userId: z.string().regex(/^\d+$/).transform(Number).optional(),
  action: z.enum(auditActions).optional(),
  entityType: z.enum(entityTypes).optional(),
  entityId: z.string().regex(/^\d+$/).transform(Number).optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Params validation
export const auditLogParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
