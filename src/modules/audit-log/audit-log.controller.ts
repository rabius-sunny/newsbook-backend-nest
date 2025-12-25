import { Controller, Get, Param, Query } from '@nestjs/common';
import { Roles } from '../../common/decorators';
import { AuditLogService } from './audit-log.service';
import { ZodValidationPipe } from '../../common/pipes';
import { auditLogQuerySchema, auditLogParamsSchema } from './dto';
import type { AuditLogQueryDto } from './dto';

@Controller('admin/audit-logs')
@Roles('admin')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * GET /audit-logs
   * Get all audit logs with filtering and pagination
   */
  @Get()
  findAll(
    @Query(new ZodValidationPipe(auditLogQuerySchema)) query: AuditLogQueryDto,
  ) {
    return this.auditLogService.findAll(query);
  }

  /**
   * GET /audit-logs/:id
   * Get a single audit log by ID
   */
  @Get(':id')
  findOne(
    @Param('id', new ZodValidationPipe(auditLogParamsSchema.shape.id))
    id: number,
  ) {
    return this.auditLogService.findOne(id);
  }

  /**
   * GET /audit-logs/entity/:entityType/:entityId
   * Get audit logs for a specific entity
   */
  @Get('entity/:entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditLogService.findByEntity(
      entityType,
      parseInt(entityId, 10),
    );
  }

  /**
   * GET /audit-logs/user/:userId
   * Get audit logs for a specific user
   */
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.auditLogService.findByUser(parseInt(userId, 10));
  }
}
