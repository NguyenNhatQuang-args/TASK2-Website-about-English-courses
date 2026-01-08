import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Role } from '../entities';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto, toRoleResponseDto } from '../dtos';
import { NotFoundError, ConflictError } from '../utils';
import { MESSAGES } from '../constants';

class RoleService {
  private get roleRepository(): Repository<Role> {
    return AppDataSource.getRepository(Role);
  }

  // Create a new role
  createRole = async (roleData: CreateRoleDto): Promise<RoleResponseDto> => {
    const existingRole = await this.roleRepository.findOne({
      where: { name: roleData.name.toLowerCase() },
    });

    if (existingRole) {
      throw new ConflictError(MESSAGES.ROLE_EXISTS);
    }

    const role = this.roleRepository.create({
      ...roleData,
      name: roleData.name.toLowerCase(),
      permissions: roleData.permissions || [],
    });

    await this.roleRepository.save(role);

    return toRoleResponseDto(role);
  };

  // Get role by ID
  getRoleById = async (roleId: string): Promise<RoleResponseDto> => {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }

    return toRoleResponseDto(role);
  };

  // Get role by name
  getRoleByName = async (name: string): Promise<RoleResponseDto | null> => {
    const role = await this.roleRepository.findOne({
      where: { name: name.toLowerCase() },
    });

    if (!role) {
      return null;
    }

    return toRoleResponseDto(role);
  };

  // Get all roles
  getAllRoles = async (): Promise<{ roles: RoleResponseDto[]; total: number }> => {
    const roles = await this.roleRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
    const total = roles.length;

    return {
      roles: roles.map((role) => toRoleResponseDto(role)),
      total,
    };
  };

  // Update role
  updateRole = async (
    roleId: string,
    updateData: UpdateRoleDto
  ): Promise<RoleResponseDto> => {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }

    // Check name uniqueness if being updated
    if (updateData.name && updateData.name.toLowerCase() !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateData.name.toLowerCase() },
      });
      if (existingRole) {
        throw new ConflictError(MESSAGES.ROLE_EXISTS);
      }
    }

    Object.assign(role, {
      ...updateData,
      name: updateData.name ? updateData.name.toLowerCase() : role.name,
    });

    await this.roleRepository.save(role);

    return toRoleResponseDto(role);
  };

  // Delete role
  deleteRole = async (roleId: string): Promise<void> => {
    const result = await this.roleRepository.delete(roleId);

    if (result.affected === 0) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }
  };

  // Add permissions to role
  addPermissionsToRole = async (
    roleId: string,
    permissions: string[]
  ): Promise<RoleResponseDto> => {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }

    // Merge unique permissions
    const currentPermissions = role.permissions || [];
    const newPermissions = [...new Set([...currentPermissions, ...permissions])];
    role.permissions = newPermissions;

    await this.roleRepository.save(role);

    return toRoleResponseDto(role);
  };

  // Remove permissions from role
  removePermissionsFromRole = async (
    roleId: string,
    permissions: string[]
  ): Promise<RoleResponseDto> => {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND);
    }

    const currentPermissions = role.permissions || [];
    role.permissions = currentPermissions.filter((p) => !permissions.includes(p));

    await this.roleRepository.save(role);

    return toRoleResponseDto(role);
  };
}

export const roleService = new RoleService();
