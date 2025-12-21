import type { z } from 'zod';
import type {
  commentCreateSchema,
  commentQuerySchema,
  commentUpdateSchema,
} from './comment.schema';

export type CreateCommentDto = z.infer<typeof commentCreateSchema>;
export type UpdateCommentDto = z.infer<typeof commentUpdateSchema>;
export type CommentQueryDto = z.infer<typeof commentQuerySchema>;
