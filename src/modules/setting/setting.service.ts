import { Injectable, NotFoundException } from '@nestjs/common';
import type { Setting } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateSettingDto,
  SettingQueryDto,
  UpdateSettingDto,
} from './dto';

@Injectable()
export class SettingService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all settings
  async getAllSettings(query?: SettingQueryDto): Promise<Setting[]> {
    if (query?.prefix) {
      return this.prisma.setting.findMany({
        where: {
          key: { startsWith: query.prefix },
        },
        orderBy: { key: 'asc' },
      });
    }

    return this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  // Get setting by key
  async getSettingByKey(key: string): Promise<Setting> {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key '${key}' does not exist`);
    }

    return setting;
  }

  // Get multiple settings by keys
  async getSettingsByKeys(keys: string[]): Promise<Setting[]> {
    if (!keys || keys.length === 0) {
      return [];
    }

    return this.prisma.setting.findMany({
      where: {
        key: { in: keys },
      },
      orderBy: { key: 'asc' },
    });
  }

  // Create or update setting (upsert)
  async upsertSetting(dto: CreateSettingDto): Promise<Setting> {
    return this.prisma.setting.upsert({
      where: { key: dto.key },
      update: { value: dto.value },
      create: { key: dto.key, value: dto.value },
    });
  }

  // Create setting
  async createSetting(dto: CreateSettingDto): Promise<Setting> {
    return this.prisma.setting.create({
      data: dto,
    });
  }

  // Update setting
  async updateSetting(key: string, dto: UpdateSettingDto): Promise<Setting> {
    const existing = await this.prisma.setting.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Setting with key '${key}' does not exist`);
    }

    return this.prisma.setting.update({
      where: { key },
      data: { value: dto.value },
    });
  }

  // Delete setting
  async deleteSetting(key: string): Promise<void> {
    const existing = await this.prisma.setting.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Setting with key '${key}' does not exist`);
    }

    await this.prisma.setting.delete({ where: { key } });
  }

  // Delete settings by prefix
  async deleteSettingsByPrefix(prefix: string): Promise<number> {
    const result = await this.prisma.setting.deleteMany({
      where: {
        key: { startsWith: prefix },
      },
    });

    return result.count;
  }

  // Get setting value by key (convenience method)
  async getValue<T = unknown>(key: string, defaultValue?: T): Promise<T> {
    try {
      const setting = await this.getSettingByKey(key);
      return setting.value as T;
    } catch {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new NotFoundException(`Setting with key '${key}' does not exist`);
    }
  }

  // Set setting value (convenience method)
  async setValue(key: string, value: unknown): Promise<Setting> {
    return this.upsertSetting({ key, value });
  }
}
