import { Injectable, NotFoundException } from '@nestjs/common';
import type { Comment } from '@prisma/client';
import { calculateOffset } from '../../common/utils';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CommentQueryDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto';
import type { PaginatedComments } from './types';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  // Get comments for an article
  async getCommentsByArticle(
    articleId: number,
    query: CommentQueryDto,
  ): Promise<PaginatedComments> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortOrder = query.sortOrder ?? 'desc';
    const skip = calculateOffset(page, limit);

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { articleId },
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      this.prisma.comment.count({ where: { articleId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      comments,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get all comments with pagination
  async getComments(query: CommentQueryDto): Promise<PaginatedComments> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortOrder = query.sortOrder ?? 'desc';
    const skip = calculateOffset(page, limit);

    const where = query.articleId ? { articleId: query.articleId } : {};

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      this.prisma.comment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      comments,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get single comment by ID
  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  // Create a new comment
  async createComment(dto: CreateCommentDto): Promise<Comment> {
    // Check if article exists
    const article = await this.prisma.article.findUnique({
      where: { id: dto.articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const comment = await this.prisma.comment.create({
      data: dto,
    });

    // Update article comment count
    await this.prisma.article.update({
      where: { id: dto.articleId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  // Update a comment
  async updateComment(id: number, dto: UpdateCommentDto): Promise<Comment> {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.comment.update({
      where: { id },
      data: dto,
    });
  }

  // Delete a comment
  async deleteComment(id: number): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.delete({ where: { id } });

    // Update article comment count
    await this.prisma.article.update({
      where: { id: comment.articleId },
      data: { commentCount: { decrement: 1 } },
    });
  }

  // Get comment count for an article
  async getCommentCount(articleId: number): Promise<number> {
    return this.prisma.comment.count({
      where: { articleId },
    });
  }
}
