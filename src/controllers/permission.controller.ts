import { Response, NextFunction } from 'express';
import { permissionService } from '../services';
import { successResponse } from '../utils/responseHelper';
import { IAuthRequest } from '../types';
import { HttpStatus, MESSAGES } from '../constants';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos';

class PermissionController {
  // GET /api/v1/permissions
  getAllPermissions = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters = {
        action: req.query.action as string,
        resource: req.query.resource as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      };

      const result = await permissionService.getAllPermissions(filters);

      successResponse(res, {
        data: result.permissions,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/permissions/:id
  getPermissionById = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const permission = await permissionService.getPermissionById(id);

      successResponse(res, {
        data: permission,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/permissions
  createPermission = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const permissionData: CreatePermissionDto = req.body;
      const permission = await permissionService.createPermission(permissionData);

      successResponse(res, {
        data: permission,
        message: MESSAGES.CREATED,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/permissions/:id
  updatePermission = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: UpdatePermissionDto = req.body;
      const permission = await permissionService.updatePermission(id, updateData);

      successResponse(res, {
        data: permission,
        message: MESSAGES.UPDATED,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/v1/permissions/:id
  deletePermission = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await permissionService.deletePermission(id);

      successResponse(res, {
        message: MESSAGES.DELETED,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/permissions/resource/:resource
  getPermissionsByResource = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { resource } = req.params;
      const permissions = await permissionService.getPermissionsByResource(resource);

      successResponse(res, {
        data: permissions,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/permissions/bulk
  bulkCreatePermissions = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { permissions } = req.body;
      const createdPermissions = await permissionService.bulkCreatePermissions(permissions);

      successResponse(res, {
        data: createdPermissions,
        message: `Tạo thành công ${createdPermissions.length} quyền`,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const permissionController = new PermissionController();
