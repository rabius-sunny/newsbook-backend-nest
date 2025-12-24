import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateAuditLogDto, AuditLogQueryDto } from './dto';
import { AuditLogListResponse } from './types';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new audit log entry
   */
  async create(dto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        ...dto,
      },
    });
  }

  /**
   * Get all audit logs with filtering and pagination
   */
  async findAll(query: AuditLogQueryDto): Promise<AuditLogListResponse> {
    const {
      page = 1,
      limit = 20,
      userId,
      action,
      entityType,
      entityId,
      dateFrom,
      dateTo,
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      ...(userId && { userId }),
      ...(action && { action }),
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(`${dateTo}T23:59:59.999Z`) }),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single audit log by ID
   */
  async findOne(id: number) {
    return this.prisma.auditLog.findUnique({
      where: { id },
    });
  }

  /**
   * Get audit logs for a specific entity
   */
  async findByEntity(entityType: string, entityId: number) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async findByUser(userId: number) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete old audit logs (for cleanup/maintenance)
   */
  async deleteOlderThan(date: Date) {
    return this.prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: date },
      },
    });
  }

  /**
   * Helper method to log an action (can be called from other services)
   */
  async logAction(
    userId: number,
    action: string,
    entityType: string,
    entityId: number,
    identity?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        identity,
      },
    });
  }
}
