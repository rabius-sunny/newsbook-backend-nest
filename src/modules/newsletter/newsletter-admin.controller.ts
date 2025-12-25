import {
  Body,
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
import type { NewsletterQueryDto, UpdateNewsletterDto } from './dto';
import { newsletterQuerySchema, newsletterUpdateSchema } from './dto';
import { NewsletterService } from './newsletter.service';

@Controller('admin/newsletters')
@Roles('admin', 'editor')
export class NewsletterAdminController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Get()
  async getNewsletters(
    @Query(new ZodValidationPipe(newsletterQuerySchema))
    query: NewsletterQueryDto,
  ) {
    return this.newsletterService.getNewsletters(query);
  }

  @Get('count')
  async getSubscriberCount() {
    const count = await this.newsletterService.getSubscriberCount();
    return { count };
  }

  @Get('email/:email')
  async getNewsletterByEmail(@Param('email') email: string) {
    return this.newsletterService.getNewsletterByEmail(email);
  }

  @Get(':id')
  async getNewsletterById(@Param('id', ParseIntPipe) id: number) {
    return this.newsletterService.getNewsletterById(id);
  }

  @Patch(':id')
  async updateSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(newsletterUpdateSchema))
    dto: UpdateNewsletterDto,
  ) {
    return this.newsletterService.updateSubscription(id, dto);
  }

  @Delete(':id')
  async deleteSubscription(@Param('id', ParseIntPipe) id: number) {
    await this.newsletterService.deleteSubscription(id);
    return { message: 'Subscription deleted successfully' };
  }
}
