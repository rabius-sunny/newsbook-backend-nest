import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryAdminController } from './category-admin.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
