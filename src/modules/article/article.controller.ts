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
import { ArticleService } from './article.service';
import type {
  ArticleQueryDto,
  CreateArticleDto,
  CreateArticleTranslationDto,
  UpdateArticleDto,
  UpdateArticleTranslationDto,
} from './dto';
import {
  articleCreateSchema,
  articleQuerySchema,
  articleTranslationCreateSchema,
  articleTranslationUpdateSchema,
  articleUpdateSchema,
} from './dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getArticles(
    @Query(new ZodValidationPipe(articleQuerySchema)) query: ArticleQueryDto,
  ) {
    return this.articleService.getArticles(query);
  }

  @Get('featured')
  async getFeaturedArticles(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.articleService.getFeaturedArticles(parsedLimit);
  }

  @Get('breaking')
  async getBreakingNews(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 3;
    return this.articleService.getBreakingNews(parsedLimit);
  }

  @Get('category/:slug')
  async getArticlesByCategory(
    @Param('slug') slug: string,
    @Query(new ZodValidationPipe(articleQuerySchema)) query: ArticleQueryDto,
  ) {
    return this.articleService.getArticlesByCategory(slug, query);
  }

  @Get('slug/:slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    const article = await this.articleService.getArticleBySlug(slug);
    // Increment view count
    await this.articleService.incrementViewCount(article.id);
    return article;
  }

  @Get('slug/:slug/lang/:language')
  async getArticleBySlugAndLanguage(
    @Param('slug') slug: string,
    @Param('language') language: string,
  ) {
    const article = await this.articleService.getArticleBySlugAndLanguage(
      slug,
      language,
    );
    // Increment view count
    await this.articleService.incrementViewCount(article.id);
    return article;
  }

  @Get(':id')
  async getArticleById(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getArticleById(id);
  }

  @Post()
  async createArticle(
    @Body(new ZodValidationPipe(articleCreateSchema)) dto: CreateArticleDto,
  ) {
    return this.articleService.createArticle(dto);
  }

  @Patch(':id')
  async updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(articleUpdateSchema)) dto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(id, dto);
  }

  @Delete(':id')
  async deleteArticle(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.deleteArticle(id);
    return { message: 'Article deleted successfully' };
  }

  @Post(':id/view')
  async incrementViewCount(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.incrementViewCount(id);
    return { message: 'View count incremented' };
  }

  // Translation endpoints
  @Post(':id/translations')
  async addTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(articleTranslationCreateSchema))
    dto: CreateArticleTranslationDto,
  ) {
    await this.articleService.addTranslation(id, dto);
    return { message: 'Translation added successfully' };
  }

  @Patch(':id/translations/:languageId')
  async updateTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Param('languageId', ParseIntPipe) languageId: number,
    @Body(new ZodValidationPipe(articleTranslationUpdateSchema))
    dto: UpdateArticleTranslationDto,
  ) {
    await this.articleService.updateTranslation(id, languageId, dto);
    return { message: 'Translation updated successfully' };
  }

  @Delete(':id/translations/:languageId')
  async deleteTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Param('languageId', ParseIntPipe) languageId: number,
  ) {
    await this.articleService.deleteTranslation(id, languageId);
    return { message: 'Translation deleted successfully' };
  }
}
