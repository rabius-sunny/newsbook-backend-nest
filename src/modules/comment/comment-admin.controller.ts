import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import { CommentService } from './comment.service';
import type { CommentQueryDto } from './dto';
import { commentQuerySchema } from './dto';

@Controller('admin/comments')
@Roles('admin', 'editor')
export class CommentAdminController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(
    @Query(new ZodValidationPipe(commentQuerySchema)) query: CommentQueryDto,
  ) {
    return this.commentService.getCommentsAdmin(query);
  }

  @Get('pending')
  async getPendingComments(
    @Query(new ZodValidationPipe(commentQuerySchema)) query: CommentQueryDto,
  ) {
    return this.commentService.getPendingComments(query);
  }

  @Get(':id')
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentById(id);
  }

  @Patch(':id/approve')
  async approveComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.approveComment(id);
  }

  @Patch(':id/reject')
  async rejectComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.rejectComment(id);
  }

  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    await this.commentService.deleteComment(id);
    return { message: 'Comment deleted successfully' };
  }
}
