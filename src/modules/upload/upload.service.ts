import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import ImageKit from 'imagekit';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingService } from '../setting/setting.service';
import type { ImageKitConfig, UploadResult } from './types';

@Injectable()
export class UploadService {
  private imageKitInstance: ImageKit | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingService: SettingService,
  ) {}

  /**
   * Get or create ImageKit instance with config from settings
   */
  private async getImageKitInstance(): Promise<ImageKit> {
    if (this.imageKitInstance) {
      return this.imageKitInstance;
    }

    const config = await this.getImageKitConfig();

    console.log('config', config);

    this.imageKitInstance = new ImageKit({
      publicKey: config.publicKey,
      privateKey: config.privateKey,
      urlEndpoint: config.urlEndpoint,
    });

    return this.imageKitInstance;
  }

  /**
   * Get ImageKit configuration from settings
   */
  private async getImageKitConfig(): Promise<ImageKitConfig> {
    try {
      const [publicKey, privateKey, urlEndpoint] = await Promise.all([
        this.settingService.getValue<string>('imagekit.public_key'),
        this.settingService.getValue<string>('imagekit.private_key'),
        this.settingService.getValue<string>('imagekit.url_endpoint'),
      ]);

      if (!publicKey || !privateKey || !urlEndpoint) {
        throw new BadRequestException('ImageKit configuration is incomplete');
      }

      return { publicKey, privateKey, urlEndpoint };
    } catch {
      throw new BadRequestException(
        'ImageKit configuration not found. Please configure imagekit.public_key, imagekit.private_key, and imagekit.url_endpoint in settings.',
      );
    }
  }

  /**
   * Determine file type from MIME type
   */
  private getFileType(mimeType: string): 'image' | 'video' {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    }
    return 'image'; // default to image for unknown types
  }

  /**
   * Upload single file to ImageKit and save to gallery
   */
  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadResult> {
    try {
      const imagekit = await this.getImageKitInstance();
      console.log('imagekit', imagekit);

      // Upload to ImageKit
      const uploadResult = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: folder || 'uploads',
        useUniqueFileName: true,
      });

      // Determine file type
      const fileType = this.getFileType(file.mimetype);

      // Save to gallery table
      await this.prisma.gallery.create({
        data: {
          fileId: uploadResult.fileId,
          url: uploadResult.url,
          type: fileType,
        },
      });

      return {
        fileId: uploadResult.fileId,
        url: uploadResult.url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Upload multiple files to ImageKit
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<{
    results: UploadResult[];
    errors: string[];
  }> {
    const results: UploadResult[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, folder);
        results.push(result);
      } catch (error) {
        errors.push(
          `Failed to upload ${file.originalname}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    return { results, errors };
  }

  /**
   * Delete file by URL
   */
  async deleteFileByUrl(url: string): Promise<void> {
    // Find the file in gallery by URL
    const galleryRecord = await this.prisma.gallery.findFirst({
      where: { url },
    });

    if (!galleryRecord) {
      throw new NotFoundException('File not found in gallery');
    }

    const imagekit = await this.getImageKitInstance();

    // Delete from ImageKit
    await imagekit.deleteFile(galleryRecord.fileId);

    // Delete from gallery table
    await this.prisma.gallery.delete({
      where: { id: galleryRecord.id },
    });
  }

  /**
   * Delete multiple files by URLs
   */
  async deleteMultipleFilesByUrls(urls: string[]): Promise<{
    deletedCount: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let deletedCount = 0;

    for (const url of urls) {
      try {
        await this.deleteFileByUrl(url);
        deletedCount++;
      } catch (error) {
        errors.push(
          `Failed to delete ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    return { deletedCount, errors };
  }

  /**
   * Get ImageKit authentication parameters for client-side upload
   */
  async getAuthenticationParameters(): Promise<{
    token: string;
    expire: number;
    signature: string;
  }> {
    const imagekit = await this.getImageKitInstance();
    return imagekit.getAuthenticationParameters();
  }

  /**
   * Invalidate ImageKit instance cache (for config updates)
   */
  invalidateCache(): void {
    this.imageKitInstance = null;
  }
}
