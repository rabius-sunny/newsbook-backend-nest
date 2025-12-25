import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { CreateTagDto, TagQueryDto, UpdateTagDto } from './dto';
import { tagCreateSchema, tagQuerySchema, tagUpdateSchema } from './dto';
import { TagService } from './tag.service';

@Controller('admin/tags')
@Roles('admin', 'editor')
export class TagAdminController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTags(
    @Query(new ZodValidationPipe(tagQuerySchema)) query: TagQueryDto,
  ) {
    return this.tagService.getTagsAdmin(query);
  }

  @Get(':id')
  async getTagById(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.getTagById(id);
  }

  @Post()
  async createTag(
    @Body(new ZodValidationPipe(tagCreateSchema)) dto: CreateTagDto,
  ) {
    return this.tagService.createTag(dto);
  }

  @Patch(':id')
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(tagUpdateSchema)) dto: UpdateTagDto,
  ) {
    return this.tagService.updateTag(id, dto);
  }

  @Patch(':id/toggle-active')
  async toggleTagActive(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.toggleActive(id);
  }

  @Delete(':id')
  async deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.deleteTag(id);
  }
}
