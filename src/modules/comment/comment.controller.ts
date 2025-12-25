import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import { CommentService } from './comment.service';
import type { CommentQueryDto, CreateCommentDto } from './dto';
import { commentCreateSchema, commentQuerySchema } from './dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @Public()
  async getComments(
    @Query(new ZodValidationPipe(commentQuerySchema)) query: CommentQueryDto,
  ) {
    return this.commentService.getComments(query);
  }

  @Get('article/:articleId')
  @Public()
  async getCommentsByArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Query(new ZodValidationPipe(commentQuerySchema)) query: CommentQueryDto,
  ) {
    return this.commentService.getCommentsByArticle(articleId, query);
  }

  @Get('article/:articleId/count')
  @Public()
  async getCommentCount(@Param('articleId', ParseIntPipe) articleId: number) {
    const count = await this.commentService.getCommentCount(articleId);
    return { count };
  }

  @Get(':id')
  @Public()
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentById(id);
  }

  // Authenticated users can create comments
  @Post()
  async createComment(
    @Body(new ZodValidationPipe(commentCreateSchema)) dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentService.createComment({
      ...dto,
      ipAddress: (req.ip || req.socket?.remoteAddress) as string,
      userAgent: req.headers['user-agent'],
    });
  }
}
