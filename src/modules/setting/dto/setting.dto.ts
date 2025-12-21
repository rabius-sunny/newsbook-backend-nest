import type { z } from 'zod';
import type {
  settingBulkKeysSchema,
  settingCreateSchema,
  settingQuerySchema,
  settingUpdateSchema,
  settingUpsertSchema,
} from './setting.schema';

export type CreateSettingDto = z.infer<typeof settingCreateSchema>;
export type UpdateSettingDto = z.infer<typeof settingUpdateSchema>;
export type UpsertSettingDto = z.infer<typeof settingUpsertSchema>;
export type BulkKeysDto = z.infer<typeof settingBulkKeysSchema>;
export type SettingQueryDto = z.infer<typeof settingQuerySchema>;
