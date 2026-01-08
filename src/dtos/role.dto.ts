import { Role } from '../entities';

// DTO for creating a role
export interface CreateRoleDto {
  name: string;
  description: string;
  permissions?: string[];
}

// DTO for updating a role
export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

// DTO for role response
export interface RoleResponseDto {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for role list response
export interface RoleListResponseDto {
  roles: RoleResponseDto[];
  total: number;
}

// Transform Role entity to RoleResponseDto
export const toRoleResponseDto = (role: Role): RoleResponseDto => ({
  id: role.id,
  name: role.name,
  description: role.description,
  permissions: role.permissions || [],
  isActive: role.isActive,
  createdAt: role.createdAt.toISOString(),
  updatedAt: role.updatedAt.toISOString(),
});
