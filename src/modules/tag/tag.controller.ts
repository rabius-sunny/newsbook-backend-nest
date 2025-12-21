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
import { ZodValidationPipe } from '../../common/pipes';
import type { CreateTagDto, TagQueryDto, UpdateTagDto } from './dto';
import { tagCreateSchema, tagQuerySchema, tagUpdateSchema } from './dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTags(
    @Query(new ZodValidationPipe(tagQuerySchema)) query: TagQueryDto,
  ) {
    return this.tagService.getTags(query);
  }

  @Get('popular')
  async getPopularTags(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.tagService.getPopularTags(parsedLimit);
  }

  @Get('slug/:slug')
  async getTagBySlug(@Param('slug') slug: string) {
    return this.tagService.getTagBySlug(slug);
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

  @Delete(':id')
  async deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.deleteTag(id);
  }
}
