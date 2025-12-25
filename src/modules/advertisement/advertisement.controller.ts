import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import { AdvertisementService } from './advertisement.service';
import type { AdvertisementQueryDto } from './dto';
import { advertisementQuerySchema } from './dto';

@Controller('advertisements')
@Public()
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @Get()
  async getAdvertisements(
    @Query(new ZodValidationPipe(advertisementQuerySchema))
    query: AdvertisementQueryDto,
  ) {
    return this.advertisementService.getAdvertisements(query);
  }

  @Get('position/:position')
  async getActiveByPosition(@Param('position') position: string) {
    return this.advertisementService.getActiveByPosition(position);
  }

  @Get(':id')
  async getAdvertisementById(@Param('id', ParseIntPipe) id: number) {
    return this.advertisementService.getAdvertisementById(id);
  }

  @Post(':id/impression')
  async recordImpression(@Param('id', ParseIntPipe) id: number) {
    await this.advertisementService.recordImpression(id);
    return { message: 'Impression recorded' };
  }

  @Post(':id/click')
  async recordClick(@Param('id', ParseIntPipe) id: number) {
    await this.advertisementService.recordClick(id);
    return { message: 'Click recorded' };
  }
}
