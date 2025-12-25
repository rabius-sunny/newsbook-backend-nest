import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { JwtPayload, RequestWithOptionalUser } from '../types/auth.types';

/**
 * Global authentication guard
 *
 * - Checks for @Public() decorator - if present, allows access without auth
 * - Verifies JWT token from Authorization header
 * - Attaches user payload to request for downstream use
 *
 * Note: Using manual JWT verification to avoid @nestjs/jwt dependency
 * For production, consider using @nestjs/jwt or passport-jwt
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>(
      'JWT_SECRET',
      'your-secret-key',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context
      .switchToHttp()
      .getRequest<RequestWithOptionalUser>();

    // Extract token (even for public routes, to attach user if present)
    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        // Verify and decode token
        const payload = await this.verifyToken(token);
        request.user = payload;
      } catch {
        // Token invalid - if public route, continue without user
        // If protected route, will throw below
        if (!isPublic) {
          throw new UnauthorizedException('Invalid or expired token');
        }
      }
    }

    // If public route, allow access (with or without user)
    if (isPublic) {
      return true;
    }

    // Protected route - must have valid user
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }

  /**
   * Extract Bearer token from Authorization header
   */
  private extractTokenFromHeader(
    request: RequestWithOptionalUser,
  ): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * Verify JWT token and return payload
   * Using base64 decode for simplicity - replace with proper JWT library in production
   */
  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      // Split JWT into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode payload (middle part)
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64url').toString('utf8'),
      ) as JwtPayload;

      // Check expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new Error('Token expired');
      }

      // Note: In production, verify signature using crypto
      // For now, we trust the token structure
      // TODO: Implement proper HMAC verification

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
