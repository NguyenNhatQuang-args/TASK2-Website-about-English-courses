import { Response, NextFunction } from 'express';
import { roleService } from '../services';
import { successResponse } from '../utils/responseHelper';
import { IAuthRequest } from '../types';
import { HttpStatus, MESSAGES } from '../constants';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';

class RoleController {
  // GET /api/v1/roles
  getAllRoles = async (
    _req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await roleService.getAllRoles();

      successResponse(res, {
        data: result.roles,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/roles/:id
  getRoleById = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);

      successResponse(res, {
        data: role,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/roles
  createRole = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const roleData: CreateRoleDto = req.body;
      const role = await roleService.createRole(roleData);

      successResponse(res, {
        data: role,
        message: MESSAGES.CREATED,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/roles/:id
  updateRole = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: UpdateRoleDto = req.body;
      const role = await roleService.updateRole(id, updateData);

      successResponse(res, {
        data: role,
        message: MESSAGES.UPDATED,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/v1/roles/:id
  deleteRole = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await roleService.deleteRole(id);

      successResponse(res, {
        message: MESSAGES.DELETED,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/roles/:id/permissions
  addPermissions = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { permissions } = req.body;
      const role = await roleService.addPermissionsToRole(id, permissions);

      successResponse(res, {
        data: role,
        message: 'Thêm quyền thành công',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/v1/roles/:id/permissions
  removePermissions = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { permissions } = req.body;
      const role = await roleService.removePermissionsFromRole(id, permissions);

      successResponse(res, {
        data: role,
        message: 'Xóa quyền thành công',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const roleController = new RoleController();
