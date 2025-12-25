import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Public } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { CategoryQueryDto } from './dto';
import { categoryQuerySchema } from './dto';
import { CategoryService } from './category.service';

@Controller('categories')
@Public()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(
    @Query(new ZodValidationPipe(categoryQuerySchema)) query: CategoryQueryDto,
  ) {
    return this.categoryService.getCategories({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('tree')
  async getCategoryTree() {
    return this.categoryService.getCategoryTree();
  }

  @Get('slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }

  @Get(':id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Get(':id/children')
  async getCategoryChildren(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryChildren(id);
  }
}
