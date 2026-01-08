import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities';
import { CreateUserDto, UpdateUserDto, UserResponseDto, toUserResponseDto } from '../dtos';
import { NotFoundError, ConflictError, BadRequestError } from '../utils';
import { MESSAGES, DEFAULT_ROLE_PERMISSIONS, UserRole } from '../constants';
import { IUserQuery } from '../types';
import { createPagination } from '../utils/responseHelper';

// User Service class
class UserService {
  private get userRepository(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

  // Create a new user
  createUser = async (userData: CreateUserDto): Promise<UserResponseDto> => {
    // Check if username already exists
    const existingUsername = await this.userRepository.findOne({
      where: { username: userData.username },
    });
    if (existingUsername) {
      throw new ConflictError(MESSAGES.USER_EXISTS);
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingEmail) {
      throw new ConflictError(MESSAGES.EMAIL_EXISTS);
    }

    // Set default permissions based on role
    const role = userData.role || UserRole.USER;
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[role] || [];

    const user = this.userRepository.create({
      ...userData,
      dateOfBirth: new Date(userData.dateOfBirth),
      role,
      permissions: defaultPermissions,
    });

    await this.userRepository.save(user);

    return toUserResponseDto(user);
  };

  // Get user by ID
  getUserById = async (userId: string): Promise<UserResponseDto> => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    return toUserResponseDto(user);
  };

  // Get user by username (with password for auth)
  getUserByUsername = async (username: string): Promise<User | null> => {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  };

  // Get all users with pagination
  getAllUsers = async (query: IUserQuery): Promise<{
    users: UserResponseDto[];
    pagination: ReturnType<typeof createPagination>;
  }> => {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.fullname ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Active status filter
    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('user.is_active = :isActive', { isActive });
    }

    // Sorting
    const sortColumn = sortBy === 'createdAt' ? 'user.created_at' : `user.${sortBy}`;
    queryBuilder.orderBy(sortColumn, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users: users.map((user) => toUserResponseDto(user)),
      pagination: createPagination({ page, limit, total }),
    };
  };

  // Update user
  updateUser = async (
    userId: string,
    updateData: UpdateUserDto
  ): Promise<UserResponseDto> => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    // Check email uniqueness if being updated
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateData.email },
      });
      if (existingEmail) {
        throw new ConflictError(MESSAGES.EMAIL_EXISTS);
      }
    }

    // Update fields
    Object.assign(user, {
      ...updateData,
      dateOfBirth: updateData.dateOfBirth
        ? new Date(updateData.dateOfBirth)
        : user.dateOfBirth,
    });

    await this.userRepository.save(user);

    return toUserResponseDto(user);
  };

  // Delete user
  deleteUser = async (userId: string): Promise<void> => {
    const result = await this.userRepository.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }
  };

  // Assign role to user
  assignRole = async (
    userId: string,
    role: UserRole
  ): Promise<UserResponseDto> => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    // Update role and default permissions
    user.role = role;
    user.permissions = DEFAULT_ROLE_PERMISSIONS[role] || [];

    await this.userRepository.save(user);

    return toUserResponseDto(user);
  };

  // Assign permissions to user
  assignPermissions = async (
    userId: string,
    permissions: string[]
  ): Promise<UserResponseDto> => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    user.permissions = permissions;
    await this.userRepository.save(user);

    return toUserResponseDto(user);
  };

  // Change user password
  changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Mật khẩu hiện tại không chính xác');
    }

    user.setPassword(newPassword);
    await this.userRepository.save(user);
  };
}

export const userService = new UserService();
