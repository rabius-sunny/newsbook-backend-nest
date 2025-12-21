import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import { handlePrismaError } from '../../common/filters/prisma-exception.filter';
import { ApiResponse, ServiceResult } from '../../common/types';
import { PrismaService } from '../../prisma';
import { CreateLanguageDto, UpdateLanguageDto } from './dto';

@Injectable()
export class LanguageService {
  private languageCache: Language[] | null = null;
  private defaultLanguage: Language | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async getActiveLanguages(): Promise<ServiceResult<Language[]>> {
    try {
      if (this.languageCache) {
        return {
          success: true,
          message: 'Languages retrieved from cache',
          data: this.languageCache,
        };
      }

      const result = await this.prisma.language.findMany({
        where: { isActive: true },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      });

      this.languageCache = result;

      return {
        success: true,
        message: 'Active languages retrieved successfully',
        data: result,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getDefaultLanguage(): Promise<ServiceResult<Language>> {
    try {
      if (this.defaultLanguage) {
        return {
          success: true,
          message: 'Default language retrieved from cache',
          data: this.defaultLanguage,
        };
      }

      const result = await this.prisma.language.findFirst({
        where: { isDefault: true },
      });

      if (!result) {
        // Fallback to first active language if no default set
        const fallback = await this.prisma.language.findFirst({
          where: { isActive: true },
        });

        if (!fallback) {
          throw new NotFoundException('No active languages found');
        }

        this.defaultLanguage = fallback;
        return {
          success: true,
          message: 'Default language retrieved (fallback)',
          data: fallback,
        };
      }

      this.defaultLanguage = result;
      return {
        success: true,
        message: 'Default language retrieved successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getLanguageByCode(code: string): Promise<ServiceResult<Language>> {
    try {
      const result = await this.prisma.language.findUnique({
        where: { code },
      });

      if (!result) {
        throw new NotFoundException(`Language with code '${code}' not found`);
      }

      return {
        success: true,
        message: 'Language retrieved successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async getLanguageById(id: number): Promise<ServiceResult<Language>> {
    try {
      const result = await this.prisma.language.findUnique({
        where: { id },
      });

      if (!result) {
        throw new NotFoundException(`Language with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Language retrieved successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async createLanguage(
    data: CreateLanguageDto,
  ): Promise<ServiceResult<Language>> {
    try {
      // If this is set as default, unset other defaults
      if (data.isDefault) {
        await this.prisma.language.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const result = await this.prisma.language.create({
        data,
      });

      this.clearCache();

      return {
        success: true,
        message: 'Language created successfully',
        data: result,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async updateLanguage(
    id: number,
    data: UpdateLanguageDto,
  ): Promise<ServiceResult<Language>> {
    try {
      // Check if language exists
      await this.getLanguageById(id);

      // If this is set as default, unset other defaults
      if (data.isDefault) {
        await this.prisma.language.updateMany({
          where: { isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      const result = await this.prisma.language.update({
        where: { id },
        data,
      });

      this.clearCache();

      return {
        success: true,
        message: 'Language updated successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async deleteLanguage(id: number): Promise<ApiResponse> {
    try {
      // Check if language exists
      await this.getLanguageById(id);

      await this.prisma.language.delete({
        where: { id },
      });

      this.clearCache();

      return {
        success: true,
        message: 'Language deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  async setDefaultLanguage(id: number): Promise<ServiceResult<Language>> {
    try {
      // Check if language exists
      await this.getLanguageById(id);

      // Unset all other defaults
      await this.prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });

      // Set this language as default
      const result = await this.prisma.language.update({
        where: { id },
        data: { isDefault: true },
      });

      this.clearCache();

      return {
        success: true,
        message: 'Default language updated successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error);
    }
  }

  private clearCache(): void {
    this.languageCache = null;
    this.defaultLanguage = null;
  }
}
