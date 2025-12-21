import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { Gallery, Prisma } from '@prisma/client';
import { calculateOffset } from '../../common/utils';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateGalleryDto, GalleryQueryDto } from './dto';
import type { PaginatedGallery } from './types';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all gallery items with pagination
  async getGalleryItems(query: GalleryQueryDto): Promise<PaginatedGallery> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = calculateOffset(page, limit);

    const where: Prisma.GalleryWhereInput = {};

    if (query.type) {
      where.type = query.type;
    }

    const [items, total] = await Promise.all([
      this.prisma.gallery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.gallery.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get gallery item by ID
  async getGalleryItemById(id: number): Promise<Gallery> {
    const item = await this.prisma.gallery.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }

    return item;
  }

  // Get gallery item by file ID
  async getGalleryItemByFileId(fileId: string): Promise<Gallery> {
    const item = await this.prisma.gallery.findUnique({
      where: { fileId },
    });

    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }

    return item;
  }

  // Create gallery item
  async createGalleryItem(dto: CreateGalleryDto): Promise<Gallery> {
    const existing = await this.prisma.gallery.findUnique({
      where: { fileId: dto.fileId },
    });

    if (existing) {
      throw new ConflictException(
        'Gallery item with this file ID already exists',
      );
    }

    return this.prisma.gallery.create({
      data: dto,
    });
  }

  // Delete gallery item by ID
  async deleteGalleryItem(id: number): Promise<void> {
    const item = await this.prisma.gallery.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }

    await this.prisma.gallery.delete({ where: { id } });
  }

  // Delete gallery item by file ID
  async deleteGalleryItemByFileId(fileId: string): Promise<void> {
    const item = await this.prisma.gallery.findUnique({
      where: { fileId },
    });

    if (!item) {
      throw new NotFoundException('Gallery item not found');
    }

    await this.prisma.gallery.delete({ where: { fileId } });
  }

  // Get count by type
  async getCountByType(): Promise<{ images: number; videos: number }> {
    const [images, videos] = await Promise.all([
      this.prisma.gallery.count({ where: { type: 'image' } }),
      this.prisma.gallery.count({ where: { type: 'video' } }),
    ]);

    return { images, videos };
  }
}
