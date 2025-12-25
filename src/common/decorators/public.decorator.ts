import { SetMetadata } from '@nestjs/common';

/**
 * Key used to store public route metadata
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as public - no authentication required
 *
 * @example
 * ```typescript
 * @Public()
 * @Get()
 * findAll() {}
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
