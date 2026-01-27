import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from './dto';
import { PermissionAction, PermissionResource } from '../../entities/enums';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Create permission
  async create(createPermissionDto: CreatePermissionDto) {
    // Check name exists
    const existingName = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existingName) {
      throw new ConflictException('Tên quyền đã tồn tại');
    }

    const permission = this.permissionRepository.create({
      name: createPermissionDto.name,
      action: createPermissionDto.action,
      resource: createPermissionDto.resource,
      description: createPermissionDto.description || '',
    });

    await this.permissionRepository.save(permission);

    return this.toPermissionResponse(permission);
  }

  // Find by ID
  async findById(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy permission');
    }

    return this.toPermissionResponse(permission);
  }

  // Find all
  async findAll(query?: PermissionQueryDto) {
    const where: Record<string, any> = {};

    if (typeof query?.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const permissions = await this.permissionRepository.find({
      where,
      order: { name: 'ASC' },
    });

    return {
      permissions: permissions.map((p) => this.toPermissionResponse(p)),
      total: permissions.length,
    };
  }

  // Update permission
  async update(permissionId: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy quyền');
    }

    // Check name uniqueness
    if (updatePermissionDto.name && updatePermissionDto.name !== permission.name) {
      const existingName = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name },
      });
      if (existingName) {
        throw new ConflictException('Tên quyền đã tồn tại');
      }
    }

    Object.assign(permission, updatePermissionDto);
    await this.permissionRepository.save(permission);

    return this.toPermissionResponse(permission);
  }

  // Delete permission
  async remove(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy quyền');
    }

    await this.permissionRepository.remove(permission);

    return { message: 'Xóa quyền thành công' };
  }

  // Toggle active status
  async toggleActive(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy quyền');
    }

    permission.isActive = !permission.isActive;
    await this.permissionRepository.save(permission);

    return this.toPermissionResponse(permission);
  }

  // Get available actions
  getActions() {
    return Object.values(PermissionAction);
  }

  // Get available resources
  getResources() {
    return Object.values(PermissionResource);
  }

  // Transform to response
  private toPermissionResponse(permission: Permission) {
    return {
      id: permission.id,
      name: permission.name,
      action: permission.action,
      resource: permission.resource,
      description: permission.description,
      isActive: permission.isActive,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
    };
  }
}
