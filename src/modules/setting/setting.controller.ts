import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { BulkKeysDto } from './dto';
import { settingBulkKeysSchema } from './dto';
import { SettingService } from './setting.service';

@Controller('settings')
@Public()
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

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
}
