import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagAdminController } from './tag-admin.controller';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController, TagAdminController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
