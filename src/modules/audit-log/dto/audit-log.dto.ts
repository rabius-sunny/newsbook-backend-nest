import type { z } from 'zod';
import type {
  auditLogCreateSchema,
  auditLogQuerySchema,
} from './audit-log.schema';

export type CreateAuditLogDto = z.infer<typeof auditLogCreateSchema>;
export type AuditLogQueryDto = z.infer<typeof auditLogQuerySchema>;
