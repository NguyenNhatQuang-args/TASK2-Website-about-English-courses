import { UserRole } from '../constants';
import { User } from '../entities';

// DTO for user registration/creation input
export interface CreateUserDto {
  username: string;
  fullname: string;
  phone: string;
  email: string;
  dateOfBirth: string; // ISO string format
  password: string;
  role?: UserRole;
}

// DTO for updating user
export interface UpdateUserDto {
  fullname?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  role?: UserRole;
  isActive?: boolean;
}

// DTO for user response (safe data, no password)
export interface UserResponseDto {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for user list response
export interface UserListResponseDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// DTO for assigning role to user
export interface AssignRoleDto {
  userId: string;
  role: UserRole;
}

// DTO for assigning permissions to user
export interface AssignPermissionsDto {
  userId: string;
  permissions: string[];
}

// Transform User entity to UserResponseDto
export const toUserResponseDto = (user: User): UserResponseDto => ({
  id: user.id,
  username: user.username,
  fullname: user.fullname,
  phone: user.phone,
  email: user.email,
  dateOfBirth: user.dateOfBirth instanceof Date 
    ? user.dateOfBirth.toISOString().split('T')[0] 
    : user.dateOfBirth,
  role: user.role,
  permissions: user.permissions || [],
  isActive: user.isActive,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
