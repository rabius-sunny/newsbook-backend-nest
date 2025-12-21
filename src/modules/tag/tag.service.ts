import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { handlePrismaError } from '../../common/filters/prisma-exception.filter';
import { ApiResponse, PaginationMeta, ServiceResult } from '../../common/types';
import { calculateOffset, calculatePagination } from '../../common/utils';
import { PrismaService } from '../../prisma';
import { CreateTagDto, TagQueryDto, UpdateTagDto } from './dto';
import { TagWithArticleCount } from './types';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async getTags(params: TagQueryDto): Promise<
    ServiceResult<{
      tags: TagWithArticleCount[];
      meta: PaginationMeta;
    }>
  > {
    try {
      const page = params.page || 1;
      const limit = params.limit || 50;
      const offset = calculateOffset(page, limit);

      // Build where conditions
      const where: Prisma.TagWhereInput = { isActive: true };

      if (params.q) {
        where.name = { contains: params.q, mode: 'insensitive' };
      }

      if (params.active !== undefined) {
        where.isActive = params.active === 'true';
      }

      // Apply sorting
      const orderBy: Prisma.TagOrderByWithRelationInput = {};
      const sortBy = params.sortBy || 'name';
      const sortOrder = params.sortOrder || 'asc';
      orderBy[sortBy] = sortOrder;

      // Get total count
      const totalCount = await this.prisma.tag.count({ where });

      // Get paginated tags with article count
      const tags = await this.prisma.tag.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: { articleTags: true },
          },
        },
      });

      const tagsData: TagWithArticleCount[] = tags.map((tag) => ({
        ...tag,
        articleCount: tag._count.articleTags,
      }));

      return {
        success: true,
        message: 'Tags retrieved successfully',
        data: {
          tags: tagsData,
          meta: calculatePagination(totalCount, { page, limit }),
        },
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getTagBySlug(
    slug: string,
  ): Promise<ServiceResult<TagWithArticleCount>> {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { slug },
        include: {
          _count: {
            select: { articleTags: true },
          },
        },
      });

      if (!tag) {
        throw new NotFoundException(`Tag with slug '${slug}' not found`);
      }

      return {
        success: true,
        message: 'Tag retrieved successfully',
        data: {
          ...tag,
          articleCount: tag._count.articleTags,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getTagById(id: number): Promise<ServiceResult<TagWithArticleCount>> {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id },
        include: {
          _count: {
            select: { articleTags: true },
          },
        },
      });

      if (!tag) {
        throw new NotFoundException(`Tag with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Tag retrieved successfully',
        data: {
          ...tag,
          articleCount: tag._count.articleTags,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async createTag(data: CreateTagDto): Promise<ServiceResult<Tag>> {
    try {
      const tag = await this.prisma.tag.create({
        data,
      });

      return {
        success: true,
        message: 'Tag created successfully',
        data: tag,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async updateTag(id: number, data: UpdateTagDto): Promise<ServiceResult<Tag>> {
    try {
      // Check if tag exists
      await this.getTagById(id);

      const tag = await this.prisma.tag.update({
        where: { id },
        data,
      });

      return {
        success: true,
        message: 'Tag updated successfully',
        data: tag,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async deleteTag(id: number): Promise<ApiResponse> {
    try {
      // Check if tag exists
      await this.getTagById(id);

      await this.prisma.tag.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Tag deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getPopularTags(
    limit = 10,
  ): Promise<ServiceResult<TagWithArticleCount[]>> {
    try {
      const tags = await this.prisma.tag.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { articleTags: true },
          },
        },
        orderBy: {
          articleTags: {
            _count: 'desc',
          },
        },
        take: limit,
      });

      const tagsData: TagWithArticleCount[] = tags.map((tag) => ({
        ...tag,
        articleCount: tag._count.articleTags,
      }));

      return {
        success: true,
        message: 'Popular tags retrieved successfully',
        data: tagsData,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
