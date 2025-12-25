import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload, RequestWithOptionalUser } from '../types/auth.types';

/**
 * Extract the current user from the request
 *
 * Returns the full JwtPayload or a specific property
 *
 * @example
 * ```typescript
 * // Get full user object
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user; // { sub: 1, email: '...', role: 'admin' }
 * }
 *
 * // Get specific property
 * @Get('my-id')
 * getMyId(@CurrentUser('sub') userId: number) {
 *   return userId; // 1
 * }
 *
 * // Optional user (for @Public() routes)
 * @Public()
 * @Get()
 * findAll(@CurrentUser() user?: JwtPayload) {
 *   // user is undefined if not authenticated
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithOptionalUser>();
    const user = request.user;

    // If no user attached (public route without auth), return undefined
    if (!user) {
      return undefined;
    }

    // If specific property requested, return that property
    if (data) {
      return user[data];
    }

    // Return full user object
    return user;
  },
);
