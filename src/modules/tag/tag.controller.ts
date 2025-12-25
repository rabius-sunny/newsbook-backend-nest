import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Public } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { TagQueryDto } from './dto';
import { tagQuerySchema } from './dto';
import { TagService } from './tag.service';

@Controller('tags')
@Public()
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
}
