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
import type {
  CategoryQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import {
  categoryCreateSchema,
  categoryQuerySchema,
  categoryUpdateSchema,
} from './dto';
import { CategoryService } from './category.service';

@Controller('categories')
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

  @Post()
  async createCategory(
    @Body(new ZodValidationPipe(categoryCreateSchema)) dto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(dto);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(categoryUpdateSchema)) dto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
