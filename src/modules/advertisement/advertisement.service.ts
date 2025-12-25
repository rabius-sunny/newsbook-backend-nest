import { Injectable, NotFoundException } from '@nestjs/common';
import type { Advertisement, Prisma } from '@prisma/client';
import { calculateOffset } from '../../common/utils';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  AdvertisementQueryDto,
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
} from './dto';
import type { PaginatedAdvertisements } from './types';

@Injectable()
export class AdvertisementService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all advertisements with pagination
  async getAdvertisements(
    query: AdvertisementQueryDto,
  ): Promise<PaginatedAdvertisements> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = calculateOffset(page, limit);

    const where: Prisma.AdvertisementWhereInput = {};

    if (query.position) {
      where.position = query.position;
    }

    if (query.isActive === 'true') {
      where.isActive = true;
    } else if (query.isActive === 'false') {
      where.isActive = false;
    }

    const [advertisements, total] = await Promise.all([
      this.prisma.advertisement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.advertisement.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      advertisements,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get active advertisements by position
  async getActiveByPosition(position: string): Promise<Advertisement[]> {
    const now = new Date();

    return this.prisma.advertisement.findMany({
      where: {
        position,
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get advertisement by ID
  async getAdvertisementById(id: number): Promise<Advertisement> {
    const advertisement = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }

    return advertisement;
  }

  // Create advertisement
  async createAdvertisement(
    dto: CreateAdvertisementDto,
  ): Promise<Advertisement> {
    return this.prisma.advertisement.create({
      data: dto,
    });
  }

  // Update advertisement
  async updateAdvertisement(
    id: number,
    dto: UpdateAdvertisementDto,
  ): Promise<Advertisement> {
    const existing = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Advertisement not found');
    }

    return this.prisma.advertisement.update({
      where: { id },
      data: dto,
    });
  }

  // Delete advertisement
  async deleteAdvertisement(id: number): Promise<void> {
    const existing = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Advertisement not found');
    }

    await this.prisma.advertisement.delete({ where: { id } });
  }

  // Record impression
  async recordImpression(id: number): Promise<void> {
    await this.prisma.advertisement.update({
      where: { id },
      data: { impressions: { increment: 1 } },
    });
  }

  // Record click
  async recordClick(id: number): Promise<void> {
    await this.prisma.advertisement.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  }

  // Get statistics for an advertisement
  async getStatistics(id: number): Promise<{
    impressions: number;
    clicks: number;
    ctr: number;
  }> {
    const ad = await this.getAdvertisementById(id);

    const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;

    return {
      impressions: ad.impressions,
      clicks: ad.clicks,
      ctr: Math.round(ctr * 100) / 100,
    };
  }

  // ==================== ADMIN METHODS ====================

  async getAdvertisementsAdmin(
    query: AdvertisementQueryDto,
  ): Promise<PaginatedAdvertisements> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = calculateOffset(page, limit);

    // Build where clause (include inactive for admin)
    const where: Prisma.AdvertisementWhereInput = {};

    if (query.position) {
      where.position = query.position;
    }

    if (query.isActive === 'true') {
      where.isActive = true;
    } else if (query.isActive === 'false') {
      where.isActive = false;
    }

    const [advertisements, total] = await Promise.all([
      this.prisma.advertisement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.advertisement.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      advertisements,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async toggleActive(id: number): Promise<Advertisement> {
    const existing = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Advertisement with ID ${id} not found`);
    }

    return this.prisma.advertisement.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  }
}
