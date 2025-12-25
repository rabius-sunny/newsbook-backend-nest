import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingAdminController } from './setting-admin.controller';
import { SettingService } from './setting.service';

@Module({
  controllers: [SettingController, SettingAdminController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
