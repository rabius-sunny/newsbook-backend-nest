import { SetMetadata } from '@nestjs/common';
import type { Role } from '../constants/roles.constant';

/**
 * Key used to store roles metadata
 */
export const ROLES_KEY = 'roles';

/**
 * Restrict route to specific roles
 *
 * @example
 * ```typescript
 * // Single role
 * @Roles('admin')
 * @Delete(':id')
 * delete() {}
 *
 * // Multiple roles (OR logic)
 * @Roles('admin', 'editor')
 * @Patch(':id')
 * update() {}
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
