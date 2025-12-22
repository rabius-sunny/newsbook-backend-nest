import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { calculateOffset } from '../../common/utils';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  ArticleQueryDto,
  CreateArticleDto,
  CreateArticleTranslationDto,
  UpdateArticleDto,
  UpdateArticleTranslationDto,
} from './dto';
import type {
  ArticleListItem,
  ArticleWithRelations,
  PaginatedArticles,
} from './types';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all articles with filters
  async getArticles(query: ArticleQueryDto): Promise<PaginatedArticles> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = calculateOffset(page, limit);

    // Build filter conditions
    const filters = this.buildFilters(query);

    // Handle language filtering
    let languageId: number | undefined;
    if (query.lang) {
      const language = await this.prisma.language.findUnique({
        where: { code: query.lang },
        select: { id: true },
      });
      if (language) {
        languageId = language.id;
      }
    }

    // Build orderBy
    const sortBy = query.sortBy ?? 'publishedAt';
    const sortOrder = query.sortOrder ?? 'desc';
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    // Handle tag filtering
    let tagIds: number[] | undefined;
    if (query.tags) {
      tagIds = query.tags
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
    }

    // If filtering by tags, we need a different query approach
    let articleIds: number[] | undefined;
    if (tagIds && tagIds.length > 0) {
      const articleTagRecords = await this.prisma.articleTag.findMany({
        where: { tagId: { in: tagIds } },
        select: { articleId: true },
        distinct: ['articleId'],
      });
      articleIds = articleTagRecords.map((at) => at.articleId);

      // If no articles match the tags, return empty
      if (articleIds.length === 0) {
        return {
          articles: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
    }

    const where: Prisma.ArticleWhereInput = {
      ...filters,
      ...(articleIds ? { id: { in: articleIds } } : {}),
      ...(languageId ? { languageId } : {}),
    };

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          imageCaption: true,
          isPublished: true,
          publishedAt: true,
          isFeatured: true,
          isBreaking: true,
          priority: true,
          viewCount: true,
          likeCount: true,
          commentCount: true,
          location: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          author: {
            select: { id: true, name: true, avatar: true },
          },
          tags: {
            select: {
              tag: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    // Format articles
    const formattedArticles: ArticleListItem[] = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      imageCaption: article.imageCaption,
      isPublished: article.isPublished,
      publishedAt: article.publishedAt,
      isFeatured: article.isFeatured,
      isBreaking: article.isBreaking,
      priority: article.priority,
      viewCount: article.viewCount,
      likeCount: article.likeCount,
      commentCount: article.commentCount,
      location: article.location,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: article.category,
      author: article.author,
      tags: article.tags.map((at) => at.tag),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      articles: formattedArticles,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get single article by slug
  async getArticleBySlug(slug: string): Promise<ArticleWithRelations> {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
                createdAt: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article with this slug does not exist');
    }

    return {
      ...article,
      author: article.author as ArticleWithRelations['author'],
      tags: article.tags.map((at) => at.tag),
      _count: {
        comments: article._count.comments,
        views: article.viewCount,
      },
    };
  }

  // Get article by slug and optional language
  async getArticleBySlugAndLanguage(
    slug: string,
    languageCode?: string,
  ): Promise<ArticleWithRelations> {
    // If no language code provided, return the article in its original language (no translation lookup)
    if (!languageCode) {
      const article = await this.prisma.article.findUnique({
        where: { slug },
        include: {
          category: true,
          author: {
            select: {
              id: true,
              email: true,
              name: true,
              bio: true,
              avatar: true,
              role: true,
              createdAt: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  isActive: true,
                  createdAt: true,
                },
              },
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      });

      if (!article) {
        throw new NotFoundException('Article with this slug does not exist');
      }

      return {
        ...article,
        author: article.author as ArticleWithRelations['author'],
        tags: article.tags.map((at) => at.tag),
        _count: {
          comments: article._count.comments,
          views: article.viewCount,
        },
      };
    }

    // Language code provided - lookup the language first
    const language = await this.prisma.language.findUnique({
      where: { code: languageCode },
      select: { id: true, code: true },
    });

    if (!language) {
      throw new NotFoundException(`Language '${languageCode}' not found`);
    }

    // Fetch article with only the needed translation
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        language: { select: { id: true, code: true } },
        category: true,
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
                createdAt: true,
              },
            },
          },
        },
        translations: {
          where: { languageId: language.id }, // Only fetch the requested translation
          select: {
            title: true,
            excerpt: true,
            content: true,
            location: true,
            seo: true,
            languageId: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article with this slug does not exist');
    }

    // Base article data
    const baseArticle = {
      ...article,
      author: article.author as ArticleWithRelations['author'],
      tags: article.tags.map((at) => at.tag),
      _count: {
        comments: article._count.comments,
        views: article.viewCount,
      },
    };

    // If requesting the primary language, return the original article
    if (article.language.code === languageCode) {
      return baseArticle;
    }

    // Check if translation exists (we fetched only the needed one)
    const translation = article.translations[0];

    if (!translation) {
      // No translation available, return primary article
      return baseArticle;
    }

    // Translation found, merge translated content
    return {
      ...baseArticle,
      title: translation.title,
      excerpt: translation.excerpt,
      content: translation.content,
      location: translation.location || article.location,
      languageId: translation.languageId,
      seo: translation.seo || article.seo,
    };
  }

  // Get article by ID
  async getArticleById(id: number): Promise<ArticleWithRelations> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
                createdAt: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article with this ID does not exist');
    }

    return {
      ...article,
      author: article.author as ArticleWithRelations['author'],
      tags: article.tags.map((at) => at.tag),
      _count: {
        comments: article._count.comments,
        views: article.viewCount,
      },
    };
  }

  // Create new article
  async createArticle(dto: CreateArticleDto): Promise<ArticleWithRelations> {
    const { tagIds, publishedAt, scheduledAt, ...articleData } = dto;

    const article = await this.prisma.article.create({
      data: {
        ...articleData,
        publishedAt: publishedAt ?? null,
        scheduledAt: scheduledAt ?? null,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
    });

    return this.getArticleBySlug(article.slug);
  }

  // Update article
  async updateArticle(
    id: number,
    dto: UpdateArticleDto,
  ): Promise<ArticleWithRelations> {
    const existingArticle = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new NotFoundException('Article with this ID does not exist');
    }

    const { tagIds, publishedAt, scheduledAt, ...articleData } = dto;

    // Update article
    await this.prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        ...(publishedAt !== undefined ? { publishedAt } : {}),
        ...(scheduledAt !== undefined ? { scheduledAt } : {}),
      },
    });

    // Update tags if provided
    if (tagIds !== undefined) {
      // Delete existing tags
      await this.prisma.articleTag.deleteMany({
        where: { articleId: id },
      });

      // Create new tags
      if (tagIds.length > 0) {
        await this.prisma.articleTag.createMany({
          data: tagIds.map((tagId) => ({
            articleId: id,
            tagId,
          })),
        });
      }
    }

    return this.getArticleById(id);
  }

  // Delete article
  async deleteArticle(id: number): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article with this ID does not exist');
    }

    await this.prisma.article.delete({ where: { id } });
  }

  // Increment view count
  async incrementViewCount(id: number): Promise<void> {
    await this.prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  // Get featured articles
  async getFeaturedArticles(limit: number = 5): Promise<ArticleListItem[]> {
    const result = await this.getArticles({
      featured: 'true',
      published: 'true',
      limit: limit.toString() as unknown as number,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    } as ArticleQueryDto);

    return result.articles;
  }

  // Get breaking news
  async getBreakingNews(limit: number = 3): Promise<ArticleListItem[]> {
    const result = await this.getArticles({
      breaking: 'true',
      published: 'true',
      limit: limit.toString() as unknown as number,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    } as ArticleQueryDto);

    return result.articles;
  }

  // Get articles by category slug
  async getArticlesByCategory(
    categorySlug: string,
    query: ArticleQueryDto,
  ): Promise<PaginatedArticles> {
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new NotFoundException('Category with this slug does not exist');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = calculateOffset(page, limit);

    const filters = this.buildFilters(query);
    const sortBy = query.sortBy ?? 'publishedAt';
    const sortOrder = query.sortOrder ?? 'desc';
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const where: Prisma.ArticleWhereInput = {
      ...filters,
      categoryId: category.id,
      isPublished: true,
    };

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          imageCaption: true,
          isPublished: true,
          publishedAt: true,
          isFeatured: true,
          isBreaking: true,
          priority: true,
          viewCount: true,
          likeCount: true,
          commentCount: true,
          location: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          author: {
            select: { id: true, name: true, avatar: true },
          },
          tags: {
            select: {
              tag: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    const formattedArticles: ArticleListItem[] = articles.map((article) => ({
      ...article,
      category: article.category,
      author: article.author,
      tags: article.tags.map((at) => at.tag),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      articles: formattedArticles,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Add translation to article
  async addTranslation(
    articleId: number,
    dto: CreateArticleTranslationDto,
  ): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.prisma.articleTranslation.create({
      data: {
        articleId,
        ...dto,
      },
    });
  }

  // Update translation
  async updateTranslation(
    articleId: number,
    languageId: number,
    dto: UpdateArticleTranslationDto,
  ): Promise<void> {
    const translation = await this.prisma.articleTranslation.findFirst({
      where: { articleId, languageId },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    await this.prisma.articleTranslation.update({
      where: { id: translation.id },
      data: dto,
    });
  }

  // Delete translation
  async deleteTranslation(
    articleId: number,
    languageId: number,
  ): Promise<void> {
    const translation = await this.prisma.articleTranslation.findFirst({
      where: { articleId, languageId },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    await this.prisma.articleTranslation.delete({
      where: { id: translation.id },
    });
  }

  // Private helper methods
  private buildFilters(query: ArticleQueryDto): Prisma.ArticleWhereInput {
    const filters: Prisma.ArticleWhereInput = {};

    if (query.q) {
      filters.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { content: { path: [], string_contains: query.q } },
      ];
    }

    if (query.category) {
      filters.categoryId = query.category;
    }

    if (query.author) {
      filters.authorId = query.author;
    }

    if (query.status) {
      filters.status = query.status;
    }

    if (query.published === 'true') {
      filters.isPublished = true;
    } else if (query.published === 'false') {
      filters.isPublished = false;
    }

    if (query.featured === 'true') {
      filters.isFeatured = true;
    } else if (query.featured === 'false') {
      filters.isFeatured = false;
    }

    if (query.breaking === 'true') {
      filters.isBreaking = true;
    } else if (query.breaking === 'false') {
      filters.isBreaking = false;
    }

    if (query.dateFrom) {
      filters.publishedAt = {
        ...(filters.publishedAt as Prisma.DateTimeNullableFilter),
        gte: new Date(query.dateFrom),
      };
    }

    if (query.dateTo) {
      filters.publishedAt = {
        ...(filters.publishedAt as Prisma.DateTimeNullableFilter),
        lte: new Date(query.dateTo),
      };
    }

    return filters;
  }

  private buildOrderBy(
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ): Prisma.ArticleOrderByWithRelationInput {
    const orderMap: Record<string, Prisma.ArticleOrderByWithRelationInput> = {
      publishedAt: { publishedAt: sortOrder },
      createdAt: { createdAt: sortOrder },
      updatedAt: { updatedAt: sortOrder },
      title: { title: sortOrder },
      viewCount: { viewCount: sortOrder },
      priority: { priority: sortOrder },
    };

    return orderMap[sortBy] || { publishedAt: sortOrder };
  }
}
