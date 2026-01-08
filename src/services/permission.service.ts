import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Permission } from '../entities';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto,
  toPermissionResponseDto,
} from '../dtos';
import { NotFoundError, ConflictError } from '../utils';
import { MESSAGES, PermissionAction, PermissionResource } from '../constants';

class PermissionService {
  private get permissionRepository(): Repository<Permission> {
    return AppDataSource.getRepository(Permission);
  }

  // Create a new permission
  createPermission = async (
    permissionData: CreatePermissionDto
  ): Promise<PermissionResponseDto> => {
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: permissionData.name },
    });

    if (existingPermission) {
      throw new ConflictError(MESSAGES.PERMISSION_EXISTS);
    }

    // Also check for duplicate action:resource combination
    const existingActionResource = await this.permissionRepository.findOne({
      where: {
        action: permissionData.action,
        resource: permissionData.resource,
      },
    });

    if (existingActionResource) {
      throw new ConflictError('Quyền với action và resource này đã tồn tại');
    }

    const permission = this.permissionRepository.create({
      ...permissionData,
      description: permissionData.description || '',
    });
    await this.permissionRepository.save(permission);

    return toPermissionResponseDto(permission);
  };

  // Get permission by ID
  getPermissionById = async (permissionId: string): Promise<PermissionResponseDto> => {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundError(MESSAGES.PERMISSION_NOT_FOUND);
    }

    return toPermissionResponseDto(permission);
  };

  // Get all permissions
  getAllPermissions = async (filters?: {
    action?: string;
    resource?: string;
    isActive?: boolean;
  }): Promise<{ permissions: PermissionResponseDto[]; total: number }> => {
    const where: Record<string, unknown> = {};

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.resource) {
      where.resource = filters.resource;
    }

    if (typeof filters?.isActive === 'boolean') {
      where.isActive = filters.isActive;
    }

    const permissions = await this.permissionRepository.find({
      where,
      order: { resource: 'ASC', action: 'ASC' },
    });
    const total = permissions.length;

    return {
      permissions: permissions.map((p) => toPermissionResponseDto(p)),
      total,
    };
  };

  // Update permission
  updatePermission = async (
    permissionId: string,
    updateData: UpdatePermissionDto
  ): Promise<PermissionResponseDto> => {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundError(MESSAGES.PERMISSION_NOT_FOUND);
    }

    // Check name uniqueness if being updated
    if (updateData.name && updateData.name !== permission.name) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: updateData.name },
      });
      if (existingPermission) {
        throw new ConflictError(MESSAGES.PERMISSION_EXISTS);
      }
    }

    Object.assign(permission, updateData);
    await this.permissionRepository.save(permission);

    return toPermissionResponseDto(permission);
  };

  // Delete permission
  deletePermission = async (permissionId: string): Promise<void> => {
    const result = await this.permissionRepository.delete(permissionId);

    if (result.affected === 0) {
      throw new NotFoundError(MESSAGES.PERMISSION_NOT_FOUND);
    }
  };

  // Get permissions by resource
  getPermissionsByResource = async (
    resource: string
  ): Promise<PermissionResponseDto[]> => {
    const permissions = await this.permissionRepository.find({
      where: {
        resource: resource as PermissionResource,
        isActive: true,
      },
      order: { action: 'ASC' },
    });

    return permissions.map((p) => toPermissionResponseDto(p));
  };

  // Bulk create permissions
  bulkCreatePermissions = async (
    permissionsData: CreatePermissionDto[]
  ): Promise<PermissionResponseDto[]> => {
    const createdPermissions: PermissionResponseDto[] = [];

    for (const data of permissionsData) {
      try {
        const permission = await this.createPermission(data);
        createdPermissions.push(permission);
      } catch (error) {
        // Skip if permission already exists
        if (!(error instanceof ConflictError)) {
          throw error;
        }
      }
    }

    return createdPermissions;
  };
}

export const permissionService = new PermissionService();
