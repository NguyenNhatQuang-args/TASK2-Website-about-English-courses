import { Permission } from '../entities';
import { PermissionAction, PermissionResource } from '../constants';

// DTO for creating a permission
export interface CreatePermissionDto {
  name: string;
  action: PermissionAction;
  resource: PermissionResource;
  description?: string;
}

// DTO for updating a permission
export interface UpdatePermissionDto {
  name?: string;
  action?: PermissionAction;
  resource?: PermissionResource;
  description?: string;
  isActive?: boolean;
}

// DTO for permission response
export interface PermissionResponseDto {
  id: string;
  name: string;
  action: string;
  resource: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for permission list response
export interface PermissionListResponseDto {
  permissions: PermissionResponseDto[];
  total: number;
}

// Transform Permission entity to PermissionResponseDto
export const toPermissionResponseDto = (permission: Permission): PermissionResponseDto => ({
  id: permission.id,
  name: permission.name,
  action: permission.action,
  resource: permission.resource,
  description: permission.description || '',
  isActive: permission.isActive,
  createdAt: permission.createdAt.toISOString(),
  updatedAt: permission.updatedAt.toISOString(),
});
