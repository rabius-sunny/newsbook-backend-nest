import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { CreateGalleryDto, GalleryQueryDto } from './dto';
import { galleryCreateSchema, galleryQuerySchema } from './dto';
import { GalleryService } from './gallery.service';

@Controller('admin/gallery')
@Roles('admin', 'editor')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async getGalleryItems(
    @Query(new ZodValidationPipe(galleryQuerySchema)) query: GalleryQueryDto,
  ) {
    return this.galleryService.getGalleryItems(query);
  }

  @Get('count')
  async getCountByType() {
    return this.galleryService.getCountByType();
  }

  @Get('file/:fileId')
  async getGalleryItemByFileId(@Param('fileId') fileId: string) {
    return this.galleryService.getGalleryItemByFileId(fileId);
  }

  @Get(':id')
  async getGalleryItemById(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.getGalleryItemById(id);
  }

  @Post()
  async createGalleryItem(
    @Body(new ZodValidationPipe(galleryCreateSchema)) dto: CreateGalleryDto,
  ) {
    return this.galleryService.createGalleryItem(dto);
  }

  @Delete('file/:fileId')
  async deleteGalleryItemByFileId(@Param('fileId') fileId: string) {
    await this.galleryService.deleteGalleryItemByFileId(fileId);
    return { message: 'Gallery item deleted successfully' };
  }

  @Delete(':id')
  async deleteGalleryItem(@Param('id', ParseIntPipe) id: number) {
    await this.galleryService.deleteGalleryItem(id);
    return { message: 'Gallery item deleted successfully' };
  }
}
