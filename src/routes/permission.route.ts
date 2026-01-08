import { Router } from 'express';
import { permissionController } from '../controllers';
import {
  authenticate,
  authorize,
  validate,
  permissionValidationRules,
  commonValidationRules,
} from '../middlewares';
import { body, param } from 'express-validator';
import { UserRole, PERMISSION_RESOURCES } from '../constants';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/permissions - Get all permissions (Admin only)
router.get('/', authorize(UserRole.ADMIN), permissionController.getAllPermissions);

// GET /api/v1/permissions/resource/:resource - Get permissions by resource (Admin only)
router.get(
  '/resource/:resource',
  authorize(UserRole.ADMIN),
  [
    param('resource')
      .custom((value) => {
        if (!PERMISSION_RESOURCES.includes(value)) {
          throw new Error('Resource không hợp lệ');
        }
        return true;
      }),
  ],
  validate,
  permissionController.getPermissionsByResource
);

// GET /api/v1/permissions/:id - Get permission by ID (Admin only)
router.get(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  validate,
  permissionController.getPermissionById
);

// POST /api/v1/permissions - Create new permission (Admin only)
router.post(
  '/',
  authorize(UserRole.ADMIN),
  permissionValidationRules.create(),
  validate,
  permissionController.createPermission
);

// POST /api/v1/permissions/bulk - Bulk create permissions (Admin only)
router.post(
  '/bulk',
  authorize(UserRole.ADMIN),
  [body('permissions').isArray().withMessage('Permissions phải là một mảng')],
  validate,
  permissionController.bulkCreatePermissions
);

// PUT /api/v1/permissions/:id - Update permission (Admin only)
router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  permissionValidationRules.update(),
  validate,
  permissionController.updatePermission
);

// DELETE /api/v1/permissions/:id - Delete permission (Admin only)
router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  validate,
  permissionController.deletePermission
);

export default router;
