import { AuditLog, Prisma } from '@prisma/client';

export type AuditLogWithUser = AuditLog & {
  // User relation can be added if needed
};

export type AuditLogListResponse = {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AuditLogOrderByInput = Prisma.AuditLogOrderByWithRelationInput;
export type AuditLogWhereInput = Prisma.AuditLogWhereInput;
