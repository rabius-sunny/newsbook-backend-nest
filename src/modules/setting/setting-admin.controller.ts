import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type {
  CreateSettingDto,
  SettingQueryDto,
  UpdateSettingDto,
} from './dto';
import {
  settingCreateSchema,
  settingQuerySchema,
  settingUpdateSchema,
  settingUpsertSchema,
} from './dto';
import { SettingService } from './setting.service';

@Controller('admin/settings')
@Roles('admin')
export class SettingAdminController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  async getAllSettings(
    @Query(new ZodValidationPipe(settingQuerySchema)) query: SettingQueryDto,
  ) {
    return this.settingService.getAllSettings(query);
  }

  @Get('key/:key')
  async getSettingByKey(@Param('key') key: string) {
    return this.settingService.getSettingByKey(key);
  }

  @Post()
  async createSetting(
    @Body(new ZodValidationPipe(settingCreateSchema)) dto: CreateSettingDto,
  ) {
    return this.settingService.createSetting(dto);
  }

  @Post('upsert')
  async upsertSetting(
    @Body(new ZodValidationPipe(settingUpsertSchema)) dto: CreateSettingDto,
  ) {
    return this.settingService.upsertSetting(dto);
  }

  @Patch('key/:key')
  async updateSetting(
    @Param('key') key: string,
    @Body(new ZodValidationPipe(settingUpdateSchema)) dto: UpdateSettingDto,
  ) {
    return this.settingService.updateSetting(key, dto);
  }

  @Delete('key/:key')
  async deleteSetting(@Param('key') key: string) {
    await this.settingService.deleteSetting(key);
    return { message: 'Setting deleted successfully' };
  }

  @Delete('prefix/:prefix')
  async deleteSettingsByPrefix(@Param('prefix') prefix: string) {
    const count = await this.settingService.deleteSettingsByPrefix(prefix);
    return { message: `Deleted ${count} settings` };
  }
}
