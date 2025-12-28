/**
 * Application-wide constants
 */

/**
 * Root admin user ID - this user cannot be modified or deleted
 */
export const ROOT_ADMIN_ID = 1;

/**
 * Check if a user ID is the root admin
 */
export function isRootAdmin(userId: number): boolean {
  return userId === ROOT_ADMIN_ID;
}

/**
 * Role hierarchy for permission checks
 * Higher index = more permissions
 */
export const ROLE_HIERARCHY = [
  'contributor',
  'reporter',
  'editor',
  'admin',
] as const;

/**
 * Check if a role can manage users (create, edit, delete)
 */
export function canManageUsers(role: string): boolean {
  return role === 'admin';
}
