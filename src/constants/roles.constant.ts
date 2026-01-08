// User Roles - Định nghĩa các vai trò người dùng
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TEACHER = 'teacher',
}

// Mảng các role để validate
export const USER_ROLES: string[] = Object.values(UserRole);

// Role mặc định khi tạo user mới
export const DEFAULT_USER_ROLE: UserRole = UserRole.USER;

// Role descriptions - Mô tả các vai trò
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Quản trị viên',
  [UserRole.USER]: 'Người dùng',
  [UserRole.TEACHER]: 'Giáo viên',
};
