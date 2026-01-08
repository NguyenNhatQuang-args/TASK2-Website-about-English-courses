import { Router } from 'express';
import { userController } from '../controllers';
import {
  authenticate,
  authorize,
  validate,
  userValidationRules,
  commonValidationRules,
} from '../middlewares';
import { body } from 'express-validator';
import { UserRole, USER_ROLES } from '../constants';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users - Get all users (Admin only)
router.get(
  '/',
  authorize(UserRole.ADMIN),
  commonValidationRules.pagination(),
  validate,
  userController.getAllUsers
);

// GET /api/v1/users/:id - Get user by ID (Admin only)
router.get(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  validate,
  userController.getUserById
);

// POST /api/v1/users - Create new user (Admin only)
router.post(
  '/',
  authorize(UserRole.ADMIN),
  userValidationRules.create(),
  validate,
  userController.createUser
);

// PUT /api/v1/users/:id - Update user (Admin only)
router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  userValidationRules.update(),
  validate,
  userController.updateUser
);

// DELETE /api/v1/users/:id - Delete user (Admin only)
router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  validate,
  userController.deleteUser
);

// PUT /api/v1/users/:id/role - Assign role to user (Admin only)
router.put(
  '/:id/role',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  [body('role').isIn(USER_ROLES).withMessage('Vai trò không hợp lệ')],
  validate,
  userController.assignRole
);

// PUT /api/v1/users/:id/permissions - Assign permissions to user (Admin only)
router.put(
  '/:id/permissions',
  authorize(UserRole.ADMIN),
  commonValidationRules.uuid('id'),
  [body('permissions').isArray().withMessage('Permissions phải là một mảng')],
  validate,
  userController.assignPermissions
);

export default router;
