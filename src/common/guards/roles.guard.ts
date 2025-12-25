import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { Role } from '../constants/roles.constant';
import type { RequestWithOptionalUser } from '../types/auth.types';

/**
 * Global roles guard
 *
 * - Checks for @Roles() decorator
 * - If no roles specified, allows any authenticated user
 * - If roles specified, checks if user has any of the required roles
 *
 * Note: This guard runs AFTER AuthGuard, so user is already verified
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator = no role restriction (any authenticated user)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request (attached by AuthGuard)
    const request = context
      .switchToHttp()
      .getRequest<RequestWithOptionalUser>();
    const user = request.user;

    // No user = public route that also has @Roles() (shouldn't happen, but handle it)
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles.join(' or ')}`,
      );
    }

    return true;
  }
}
