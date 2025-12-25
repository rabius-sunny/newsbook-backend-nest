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

/**
 * Admin Article Controller
 * All routes require admin or editor role
 * Full CRUD operations for articles
 */
@Controller('admin/articles')
@Roles('admin', 'editor')
export class ArticleAdminController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * GET /admin/articles
   * List all articles (including drafts) for admin panel
   */
  @Get()
  async getArticles(
    @Query(new ZodValidationPipe(articleQuerySchema)) query: ArticleQueryDto,
  ) {
    // Admin gets all articles including drafts
    return this.articleService.getArticlesAdmin(query);
  }

  /**
   * GET /admin/articles/stats
   * Get article statistics for dashboard
   */
  @Get('stats')
  async getStats() {
    return this.articleService.getArticleStats();
  }

  /**
   * GET /admin/articles/drafts
   * Get all draft articles
   */
  @Get('drafts')
  async getDrafts(
    @Query(new ZodValidationPipe(articleQuerySchema)) query: ArticleQueryDto,
  ) {
    return this.articleService.getDraftArticles(query);
  }

  /**
   * GET /admin/articles/:id
   * Get single article by ID (full details for admin)
   */
  @Get(':id')
  async getArticleById(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getArticleById(id);
  }

  /**
   * POST /admin/articles
   * Create a new article
   */
  @Post()
  async createArticle(
    @Body(new ZodValidationPipe(articleCreateSchema)) dto: CreateArticleDto,
  ) {
    return this.articleService.createArticle(dto);
  }

  /**
   * PATCH /admin/articles/:id
   * Update an article
   */
  @Patch(':id')
  async updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(articleUpdateSchema)) dto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(id, dto);
  }

  /**
   * PATCH /admin/articles/:id/publish
   * Publish an article
   */
  @Patch(':id/publish')
  async publishArticle(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.publishArticle(id);
  }

  /**
   * PATCH /admin/articles/:id/unpublish
   * Unpublish an article
   */
  @Patch(':id/unpublish')
  async unpublishArticle(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.unpublishArticle(id);
  }

  /**
   * PATCH /admin/articles/:id/feature
   * Toggle featured status
   */
  @Patch(':id/feature')
  async toggleFeatured(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.toggleFeatured(id);
  }

  /**
   * PATCH /admin/articles/:id/breaking
   * Toggle breaking news status
   */
  @Patch(':id/breaking')
  async toggleBreaking(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.toggleBreaking(id);
  }

  /**
   * DELETE /admin/articles/:id
   * Delete an article (admin only)
   */
  @Roles('admin')
  @Delete(':id')
  async deleteArticle(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.deleteArticle(id);
    return { message: 'Article deleted successfully' };
  }

  // ═══════════════════════════════════════════════════════════════
  // TRANSLATION ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * POST /admin/articles/:id/translations
   * Add a translation to an article
   */
  @Post(':id/translations')
  async addTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(articleTranslationCreateSchema))
    dto: CreateArticleTranslationDto,
  ) {
    await this.articleService.addTranslation(id, dto);
    return { message: 'Translation added successfully' };
  }

  /**
   * PATCH /admin/articles/:id/translations/:languageId
   * Update a translation
   */
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

  /**
   * DELETE /admin/articles/:id/translations/:languageId
   * Delete a translation
   */
  @Delete(':id/translations/:languageId')
  async deleteTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Param('languageId', ParseIntPipe) languageId: number,
  ) {
    await this.articleService.deleteTranslation(id, languageId);
    return { message: 'Translation deleted successfully' };
  }
}
