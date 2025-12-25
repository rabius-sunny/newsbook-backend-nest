/**
 * Role constants matching the user roles in the database
 */
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  REPORTER: 'reporter',
  CONTRIBUTOR: 'contributor',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * All roles array for validation
 */
export const ALL_ROLES = Object.values(ROLES);

/**
 * Role hierarchy - higher index = more permissions
 * Used for "at least this role" checks
 */
export const ROLE_HIERARCHY: Role[] = [
  ROLES.CONTRIBUTOR,
  ROLES.REPORTER,
  ROLES.EDITOR,
  ROLES.ADMIN,
];

/**
 * Check if a role has at least the specified level
 */
export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}
