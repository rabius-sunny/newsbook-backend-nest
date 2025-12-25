import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageAdminController } from './language-admin.controller';
import { LanguageService } from './language.service';

@Module({
  controllers: [LanguageController, LanguageAdminController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
