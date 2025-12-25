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
import { Roles } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { CreateLanguageDto, UpdateLanguageDto } from './dto';
import { languageCreateSchema, languageUpdateSchema } from './dto';
import { LanguageService } from './language.service';

@Controller('admin/languages')
@Roles('admin')
export class LanguageAdminController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  async getAllLanguages() {
    return this.languageService.getAllLanguages();
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

  @Patch(':id/toggle-active')
  async toggleLanguageActive(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.toggleActive(id);
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
