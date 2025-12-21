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
import { AdvertisementService } from './advertisement.service';
import type {
  AdvertisementQueryDto,
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
} from './dto';
import {
  advertisementCreateSchema,
  advertisementQuerySchema,
  advertisementUpdateSchema,
} from './dto';

@Controller('advertisements')
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

  @Get(':id/statistics')
  async getStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.advertisementService.getStatistics(id);
  }

  @Post()
  async createAdvertisement(
    @Body(new ZodValidationPipe(advertisementCreateSchema))
    dto: CreateAdvertisementDto,
  ) {
    return this.advertisementService.createAdvertisement(dto);
  }

  @Patch(':id')
  async updateAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(advertisementUpdateSchema))
    dto: UpdateAdvertisementDto,
  ) {
    return this.advertisementService.updateAdvertisement(id, dto);
  }

  @Delete(':id')
  async deleteAdvertisement(@Param('id', ParseIntPipe) id: number) {
    await this.advertisementService.deleteAdvertisement(id);
    return { message: 'Advertisement deleted successfully' };
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
