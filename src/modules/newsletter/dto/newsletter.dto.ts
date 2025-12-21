import type { z } from 'zod';
import type {
  newsletterCreateSchema,
  newsletterQuerySchema,
  newsletterUpdateSchema,
} from './newsletter.schema';

export type CreateNewsletterDto = z.infer<typeof newsletterCreateSchema>;
export type UpdateNewsletterDto = z.infer<typeof newsletterUpdateSchema>;
export type NewsletterQueryDto = z.infer<typeof newsletterQuerySchema>;
