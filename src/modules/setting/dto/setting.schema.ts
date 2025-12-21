import { z } from 'zod';

// Create setting schema
export const settingCreateSchema = z.object({
  key: z
    .string()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9._-]+$/,
      'Key must contain only lowercase letters, numbers, dots, underscores, and hyphens',
    ),
  value: z.any(), // Can be any JSON value
});

// Update setting schema
export const settingUpdateSchema = z.object({
  value: z.any(), // Can be any JSON value
});

// Upsert setting schema (same as create)
export const settingUpsertSchema = settingCreateSchema;

// Bulk settings request schema
export const settingBulkKeysSchema = z.object({
  keys: z.array(z.string().min(1).max(100)).min(1).max(50),
});

// Query parameters for settings
export const settingQuerySchema = z.object({
  prefix: z.string().min(1).max(50).optional(),
});
