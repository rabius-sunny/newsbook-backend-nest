import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentAdminController } from './comment-admin.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController, CommentAdminController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
