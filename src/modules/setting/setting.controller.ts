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
import { ZodValidationPipe } from '../../common/pipes';
import type {
  BulkKeysDto,
  CreateSettingDto,
  SettingQueryDto,
  UpdateSettingDto,
} from './dto';
import {
  settingBulkKeysSchema,
  settingCreateSchema,
  settingQuerySchema,
  settingUpdateSchema,
  settingUpsertSchema,
} from './dto';
import { SettingService } from './setting.service';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  async getAllSettings(
    @Query(new ZodValidationPipe(settingQuerySchema)) query: SettingQueryDto,
  ) {
    return this.settingService.getAllSettings(query);
  }

  @Post('bulk')
  async getSettingsByKeys(
    @Body(new ZodValidationPipe(settingBulkKeysSchema)) dto: BulkKeysDto,
  ) {
    return this.settingService.getSettingsByKeys(dto.keys);
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
