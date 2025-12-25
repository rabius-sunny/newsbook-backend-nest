import { Request } from 'express';
import type { Role } from '../constants/roles.constant';

/**
 * JWT payload structure - stored in the token
 */
export interface JwtPayload {
  /** User ID */
  sub: number;
  /** User email */
  email: string;
  /** User role */
  role: Role;
  /** Issued at timestamp */
  iat?: number;
  /** Expiration timestamp */
  exp?: number;
}

/**
 * Extended Request with user attached by AuthGuard
 */
export interface RequestWithUser extends Request {
  user: JwtPayload;
}

/**
 * Request that may or may not have a user (for @Public() routes)
 */
export interface RequestWithOptionalUser extends Request {
  user?: JwtPayload;
}
