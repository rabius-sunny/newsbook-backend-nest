import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { Newsletter } from '@prisma/client';
import { calculateOffset } from '../../common/utils';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateNewsletterDto,
  NewsletterQueryDto,
  UpdateNewsletterDto,
} from './dto';
import type { PaginatedNewsletters } from './types';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all newsletters with pagination
  async getNewsletters(
    query: NewsletterQueryDto,
  ): Promise<PaginatedNewsletters> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = calculateOffset(page, limit);

    const where: { isActive?: boolean } = {};
    if (query.isActive === 'true') {
      where.isActive = true;
    } else if (query.isActive === 'false') {
      where.isActive = false;
    }

    const [newsletters, total] = await Promise.all([
      this.prisma.newsletter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.newsletter.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      newsletters,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get newsletter by email
  async getNewsletterByEmail(email: string): Promise<Newsletter> {
    const newsletter = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (!newsletter) {
      throw new NotFoundException('Newsletter subscription not found');
    }

    return newsletter;
  }

  // Get newsletter by ID
  async getNewsletterById(id: number): Promise<Newsletter> {
    const newsletter = await this.prisma.newsletter.findUnique({
      where: { id },
    });

    if (!newsletter) {
      throw new NotFoundException('Newsletter subscription not found');
    }

    return newsletter;
  }

  // Subscribe to newsletter
  async subscribe(dto: CreateNewsletterDto): Promise<Newsletter> {
    const existing = await this.prisma.newsletter.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Email already subscribed');
      }

      // Reactivate subscription
      return this.prisma.newsletter.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          name: dto.name ?? existing.name,
          preferences:
            dto.preferences ??
            (existing.preferences as Record<string, unknown>) ??
            undefined,
          unsubscribedAt: null,
        },
      });
    }

    return this.prisma.newsletter.create({
      data: dto,
    });
  }

  // Update subscription
  async updateSubscription(
    id: number,
    dto: UpdateNewsletterDto,
  ): Promise<Newsletter> {
    const existing = await this.prisma.newsletter.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Newsletter subscription not found');
    }

    return this.prisma.newsletter.update({
      where: { id },
      data: dto,
    });
  }

  // Unsubscribe
  async unsubscribe(email: string): Promise<void> {
    const existing = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (!existing) {
      throw new NotFoundException('Newsletter subscription not found');
    }

    await this.prisma.newsletter.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });
  }

  // Delete subscription
  async deleteSubscription(id: number): Promise<void> {
    const existing = await this.prisma.newsletter.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Newsletter subscription not found');
    }

    await this.prisma.newsletter.delete({ where: { id } });
  }

  // Verify email
  async verifyEmail(email: string): Promise<Newsletter> {
    const existing = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (!existing) {
      throw new NotFoundException('Newsletter subscription not found');
    }

    return this.prisma.newsletter.update({
      where: { email },
      data: { verifiedAt: new Date() },
    });
  }

  // Get subscriber count
  async getSubscriberCount(): Promise<number> {
    return this.prisma.newsletter.count({
      where: { isActive: true },
    });
  }
}
