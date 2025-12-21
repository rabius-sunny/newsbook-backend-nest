import type { z } from 'zod';
import type {
  deleteFileSchema,
  deleteMultipleFilesSchema,
  uploadQuerySchema,
} from './upload.schema';

export type UploadQueryDto = z.infer<typeof uploadQuerySchema>;
export type DeleteFileDto = z.infer<typeof deleteFileSchema>;
export type DeleteMultipleFilesDto = z.infer<typeof deleteMultipleFilesSchema>;
