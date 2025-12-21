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
import { CommentService } from './comment.service';
import type {
  CommentQueryDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto';
import {
  commentCreateSchema,
  commentQuerySchema,
  commentUpdateSchema,
} from './dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(
    @Query(new ZodValidationPipe(commentQuerySchema)) query: CommentQueryDto,
  ) {
    return this.commentService.getComments(query);
  }

  @Get('article/:articleId')
  async getCommentsByArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Query(new ZodValidationPipe(commentQuerySchema)) query: CommentQueryDto,
  ) {
    return this.commentService.getCommentsByArticle(articleId, query);
  }

  @Get('article/:articleId/count')
  async getCommentCount(@Param('articleId', ParseIntPipe) articleId: number) {
    const count = await this.commentService.getCommentCount(articleId);
    return { count };
  }

  @Get(':id')
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentById(id);
  }

  @Post()
  async createComment(
    @Body(new ZodValidationPipe(commentCreateSchema)) dto: CreateCommentDto,
  ) {
    return this.commentService.createComment(dto);
  }

  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(commentUpdateSchema)) dto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, dto);
  }

  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    await this.commentService.deleteComment(id);
    return { message: 'Comment deleted successfully' };
  }
}
