import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Public } from '../../common/decorators';
import { LanguageService } from './language.service';

@Controller('languages')
@Public()
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  async getActiveLanguages() {
    return this.languageService.getActiveLanguages();
  }

  @Get('default')
  async getDefaultLanguage() {
    return this.languageService.getDefaultLanguage();
  }

  @Get('code/:code')
  async getLanguageByCode(@Param('code') code: string) {
    return this.languageService.getLanguageByCode(code);
  }

  @Get(':id')
  async getLanguageById(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.getLanguageById(id);
  }
}
