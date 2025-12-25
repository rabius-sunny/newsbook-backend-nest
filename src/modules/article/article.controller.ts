import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import { ArticleService } from './article.service';
import type { ArticleQueryDto } from './dto';
import { articleQuerySchema } from './dto';

/**
 * Public Article Controller
 * All routes are public (read-only)
 * No mutations allowed - admin operations are in ArticleAdminController
 */
@Controller('articles')
@Public()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * GET /articles
   * List all published articles with filtering and pagination
   */
  @Get()
  async getArticles(
    @Query(new ZodValidationPipe(articleQuerySchema)) query: ArticleQueryDto,
  ) {
    return this.articleService.getArticles(query);
  }

  /**
   * GET /articles/featured
   * Get featured articles for homepage
   */
  @Get('featured')
  async getFeaturedArticles(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.articleService.getFeaturedArticles(parsedLimit);
  }

  /**
   * GET /articles/breaking
   * Get breaking news articles
   */
  @Get('breaking')
  async getBreakingNews(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 3;
    return this.articleService.getBreakingNews(parsedLimit);
  }

  /**
   * GET /articles/category/:slug
   * Get articles by category slug
   */
  @Get('category/:slug')
  async getArticlesByCategory(
    @Param('slug') slug: string,
    @Query(new ZodValidationPipe(articleQuerySchema)) query: ArticleQueryDto,
  ) {
    return this.articleService.getArticlesByCategory(slug, query);
  }

  /**
   * GET /articles/slug/:slug
   * Get single article by slug (with optional language translation)
   */
  @Get('slug/:slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ) {
    const article = await this.articleService.getArticleBySlugAndLanguage(
      slug,
      lang,
    );
    // Increment view count
    await this.articleService.incrementViewCount(article.id);
    return article;
  }

  /**
   * GET /articles/slug/:slug/lang/:language
   * Get article with specific language translation (backward compatibility)
   */
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

  /**
   * GET /articles/:id
   * Get single article by ID
   */
  @Get(':id')
  async getArticleById(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getArticleById(id);
  }

  /**
   * POST /articles/:id/view
   * Increment view count for an article
   */
  @Post(':id/view')
  async incrementViewCount(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.incrementViewCount(id);
    return { message: 'View count incremented' };
  }
}
