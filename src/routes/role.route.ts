import { Router } from 'express';
import { roleController } from '../controllers';
import {
  authenticate,
  authorize,
  validate,
  roleValidationRules,
  commonValidationRules,
} from '../middlewares';
import { body } from 'express-validator';
import { UserRole } from '../constants';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/roles - Get all roles (Admin only)
router.get('/', authorize(UserRole.ADMIN), roleController.getAllRoles);

// GET /api/v1/roles/:id - Get role by ID (Admin only)
router.get(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  validate,
  roleController.getRoleById
);

// POST /api/v1/roles - Create new role (Admin only)
router.post(
  '/',
  authorize(UserRole.ADMIN),
  roleValidationRules.create(),
  validate,
  roleController.createRole
);

// PUT /api/v1/roles/:id - Update role (Admin only)
router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  roleValidationRules.update(),
  validate,
  roleController.updateRole
);

// DELETE /api/v1/roles/:id - Delete role (Admin only)
router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  validate,
  roleController.deleteRole
);

// POST /api/v1/roles/:id/permissions - Add permissions to role (Admin only)
router.post(
  '/:id/permissions',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  [body('permissions').isArray().withMessage('Permissions phải là một mảng')],
  validate,
  roleController.addPermissions
);

// DELETE /api/v1/roles/:id/permissions - Remove permissions from role (Admin only)
router.delete(
  '/:id/permissions',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  [body('permissions').isArray().withMessage('Permissions phải là một mảng')],
  validate,
  roleController.removePermissions
);

export default router;
