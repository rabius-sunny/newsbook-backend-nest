import { Module } from '@nestjs/common';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementAdminController } from './advertisement-admin.controller';
import { AdvertisementService } from './advertisement.service';

@Module({
  controllers: [AdvertisementController, AdvertisementAdminController],
  providers: [AdvertisementService],
  exports: [AdvertisementService],
})
export class AdvertisementModule {}
