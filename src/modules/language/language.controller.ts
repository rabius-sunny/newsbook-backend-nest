import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes';
import type { CreateLanguageDto, UpdateLanguageDto } from './dto';
import { languageCreateSchema, languageUpdateSchema } from './dto';
import { LanguageService } from './language.service';

@Controller('languages')
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

  @Post()
  async createLanguage(
    @Body(new ZodValidationPipe(languageCreateSchema)) dto: CreateLanguageDto,
  ) {
    return this.languageService.createLanguage(dto);
  }

  @Patch(':id')
  async updateLanguage(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(languageUpdateSchema)) dto: UpdateLanguageDto,
  ) {
    return this.languageService.updateLanguage(id, dto);
  }

  @Delete(':id')
  async deleteLanguage(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.deleteLanguage(id);
  }

  @Put(':id/default')
  async setDefaultLanguage(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.setDefaultLanguage(id);
  }
}
