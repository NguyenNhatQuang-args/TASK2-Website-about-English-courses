import { Response, NextFunction } from 'express';
import { userService } from '../services';
import { successResponse } from '../utils/responseHelper';
import { IAuthRequest, IUserQuery } from '../types';
import { HttpStatus, MESSAGES, UserRole } from '../constants';
import { CreateUserDto, UpdateUserDto } from '../dtos';

class UserController {
  // GET /api/v1/users
  getAllUsers = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query: IUserQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        role: req.query.role as UserRole,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await userService.getAllUsers(query);

      successResponse(res, {
        data: result.users,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/users/:id
  getUserById = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      successResponse(res, {
        data: user,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/users
  createUser = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);

      successResponse(res, {
        data: user,
        message: MESSAGES.CREATED,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/users/:id
  updateUser = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: UpdateUserDto = req.body;
      const user = await userService.updateUser(id, updateData);

      successResponse(res, {
        data: user,
        message: MESSAGES.UPDATED,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/v1/users/:id
  deleteUser = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);

      successResponse(res, {
        message: MESSAGES.DELETED,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/users/:id/role
  assignRole = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await userService.assignRole(id, role);

      successResponse(res, {
        data: user,
        message: 'Gán vai trò thành công',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/users/:id/permissions
  assignPermissions = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { permissions } = req.body;
      const user = await userService.assignPermissions(id, permissions);

      successResponse(res, {
        data: user,
        message: 'Gán quyền thành công',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
