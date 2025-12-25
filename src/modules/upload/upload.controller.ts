import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators';
import { ZodValidationPipe } from '../../common/pipes';
import type {
  DeleteFileDto,
  DeleteMultipleFilesDto,
  UploadQueryDto,
} from './dto';
import {
  deleteFileSchema,
  deleteMultipleFilesSchema,
  uploadQuerySchema,
} from './dto';
import { UploadService } from './upload.service';

@Controller('admin/upload')
@Roles('admin', 'editor')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query(new ZodValidationPipe(uploadQuerySchema)) query: UploadQueryDto,
  ) {
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    const result = await this.uploadService.uploadFile(file, query.folder);
    return {
      success: true,
      message: 'File uploaded successfully',
      data: result,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query(new ZodValidationPipe(uploadQuerySchema)) query: UploadQueryDto,
  ) {
    if (!files || files.length === 0) {
      return { success: false, message: 'No files provided' };
    }

    const { results, errors } = await this.uploadService.uploadMultipleFiles(
      files,
      query.folder,
    );

    return {
      success: results.length > 0,
      message: `Successfully uploaded ${results.length}/${files.length} files`,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  @Delete()
  async deleteFile(
    @Body(new ZodValidationPipe(deleteFileSchema)) dto: DeleteFileDto,
  ) {
    await this.uploadService.deleteFileByUrl(dto.url);
    return { success: true, message: 'File deleted successfully' };
  }

  @Delete('multiple')
  async deleteMultipleFiles(
    @Body(new ZodValidationPipe(deleteMultipleFilesSchema))
    dto: DeleteMultipleFilesDto,
  ) {
    const { deletedCount, errors } =
      await this.uploadService.deleteMultipleFilesByUrls(dto.urls);

    return {
      success: deletedCount > 0,
      message: `Successfully deleted ${deletedCount}/${dto.urls.length} files`,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  @Get('auth')
  async getAuthenticationParameters() {
    const params = await this.uploadService.getAuthenticationParameters();
    return {
      success: true,
      data: params,
    };
  }
}
