import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type { CreateNewsletterDto } from './dto';
import { newsletterCreateSchema } from './dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletters')
@Public()
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(
    @Body(new ZodValidationPipe(newsletterCreateSchema))
    dto: CreateNewsletterDto,
  ) {
    return this.newsletterService.subscribe(dto);
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
}
