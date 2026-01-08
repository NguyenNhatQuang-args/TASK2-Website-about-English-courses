// Permission Actions - Các hành động quyền
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage', // Full access
}

// Permission Resources - Các tài nguyên được quản lý
export enum PermissionResource {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  COURSES = 'courses',
  LESSONS = 'lessons',
  PROFILE = 'profile',
}

// Mảng các action và resource
export const PERMISSION_ACTIONS: string[] = Object.values(PermissionAction);
export const PERMISSION_RESOURCES: string[] = Object.values(PermissionResource);

// Default permissions cho mỗi role
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'manage:users',
    'manage:roles',
    'manage:permissions',
    'manage:courses',
    'manage:lessons',
    'manage:profile',
  ],
  teacher: [
    'read:users',
    'create:courses',
    'read:courses',
    'update:courses',
    'create:lessons',
    'read:lessons',
    'update:lessons',
    'delete:lessons',
    'manage:profile',
  ],
  user: [
    'read:courses',
    'read:lessons',
    'read:profile',
    'update:profile',
  ],
};
