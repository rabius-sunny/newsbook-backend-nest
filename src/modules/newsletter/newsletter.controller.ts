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
import type {
  CreateNewsletterDto,
  NewsletterQueryDto,
  UpdateNewsletterDto,
} from './dto';
import {
  newsletterCreateSchema,
  newsletterQuerySchema,
  newsletterUpdateSchema,
} from './dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletters')
export class NewsletterController {
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

  @Post('subscribe')
  async subscribe(
    @Body(new ZodValidationPipe(newsletterCreateSchema))
    dto: CreateNewsletterDto,
  ) {
    return this.newsletterService.subscribe(dto);
  }

  @Patch(':id')
  async updateSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(newsletterUpdateSchema))
    dto: UpdateNewsletterDto,
  ) {
    return this.newsletterService.updateSubscription(id, dto);
  }

  @Post('unsubscribe')
  async unsubscribe(@Body('email') email: string) {
    await this.newsletterService.unsubscribe(email);
    return { message: 'Unsubscribed successfully' };
  }

  @Post('verify')
  async verifyEmail(@Body('email') email: string) {
    return this.newsletterService.verifyEmail(email);
  }

  @Delete(':id')
  async deleteSubscription(@Param('id', ParseIntPipe) id: number) {
    await this.newsletterService.deleteSubscription(id);
    return { message: 'Subscription deleted successfully' };
  }
}
