import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleAdminController } from './article-admin.controller';
import { ArticleService } from './article.service';

@Module({
  controllers: [ArticleController, ArticleAdminController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
