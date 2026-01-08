import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate, validate, userValidationRules } from '../middlewares';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.post(
  '/login',
  userValidationRules.login(),
  validate,
  authController.login
);

router.post(
  '/register',
  userValidationRules.create(),
  validate,
  authController.register
);

router.post(
  '/refresh-token',
  [body('refreshToken').notEmpty().withMessage('Refresh token là bắt buộc')],
  validate,
  authController.refreshToken
);

// Protected routes (require authentication)
router.get('/profile', authenticate, authController.getProfile);

router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
    body('newPassword')
      .notEmpty()
      .withMessage('Mật khẩu mới là bắt buộc')
      .isLength({ min: 8 })
      .withMessage('Mật khẩu phải có ít nhất 8 ký tự'),
    body('confirmPassword').notEmpty().withMessage('Xác nhận mật khẩu là bắt buộc'),
  ],
  validate,
  authController.changePassword
);

router.post('/logout', authenticate, authController.logout);

export default router;
