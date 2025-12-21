import { z } from 'zod';

export const uploadQuerySchema = z.object({
  folder: z.string().min(1).max(100).optional(),
});

export const deleteFileSchema = z.object({
  url: z.string().url('Invalid URL'),
});

export const deleteMultipleFilesSchema = z.object({
  urls: z.array(z.string().url('Invalid URL')).min(1).max(50),
});
