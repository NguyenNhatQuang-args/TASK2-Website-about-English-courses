import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query, ValidationChain } from 'express-validator';
import { BadRequestError } from '../utils/apiError';
import {
  VALIDATION_MESSAGES,
  FIELD_LENGTHS,
  USER_ROLES,
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
} from '../constants';

// Validate request and return errors
export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: 'path' in error ? error.path : 'unknown',
      message: error.msg,
    }));

    throw new BadRequestError(VALIDATION_MESSAGES.USERNAME_INVALID, errorMessages);
  }

  next();
};

// User validation rules
export const userValidationRules = {
  create: (): ValidationChain[] => [
    body('username')
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.USERNAME_REQUIRED)
      .isLength({ min: FIELD_LENGTHS.USERNAME_MIN, max: FIELD_LENGTHS.USERNAME_MAX })
      .withMessage(VALIDATION_MESSAGES.USERNAME_INVALID)
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(VALIDATION_MESSAGES.USERNAME_INVALID),
    body('fullname')
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FULLNAME_REQUIRED)
      .isLength({ min: FIELD_LENGTHS.FULLNAME_MIN, max: FIELD_LENGTHS.FULLNAME_MAX })
      .withMessage(VALIDATION_MESSAGES.FULLNAME_INVALID),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Số điện thoại là bắt buộc')
      .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/)
      .withMessage(VALIDATION_MESSAGES.PHONE_INVALID),
    body('email')
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
      .normalizeEmail(),
    body('dateOfBirth')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.DOB_REQUIRED)
      .isISO8601()
      .withMessage(VALIDATION_MESSAGES.DOB_INVALID),
    body('password')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
      .isLength({ min: FIELD_LENGTHS.PASSWORD_MIN })
      .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    body('role')
      .optional()
      .isIn(USER_ROLES)
      .withMessage(VALIDATION_MESSAGES.ROLE_INVALID),
  ],

  update: (): ValidationChain[] => [
    body('fullname')
      .optional()
      .trim()
      .isLength({ min: FIELD_LENGTHS.FULLNAME_MIN, max: FIELD_LENGTHS.FULLNAME_MAX })
      .withMessage(VALIDATION_MESSAGES.FULLNAME_INVALID),
    body('phone')
      .optional()
      .trim()
      .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/)
      .withMessage(VALIDATION_MESSAGES.PHONE_INVALID),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
      .normalizeEmail(),
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage(VALIDATION_MESSAGES.DOB_INVALID),
    body('role')
      .optional()
      .isIn(USER_ROLES)
      .withMessage(VALIDATION_MESSAGES.ROLE_INVALID),
  ],

  login: (): ValidationChain[] => [
    body('username')
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.USERNAME_REQUIRED),
    body('password')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
  ],
};

// Role validation rules
export const roleValidationRules = {
  create: (): ValidationChain[] => [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tên vai trò là bắt buộc')
      .isLength({ min: 2, max: 50 })
      .withMessage('Tên vai trò phải từ 2-50 ký tự'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Mô tả vai trò là bắt buộc'),
    body('permissions')
      .optional()
      .isArray()
      .withMessage('Permissions phải là một mảng'),
  ],

  update: (): ValidationChain[] => [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Tên vai trò phải từ 2-50 ký tự'),
    body('description')
      .optional()
      .trim(),
    body('permissions')
      .optional()
      .isArray()
      .withMessage('Permissions phải là một mảng'),
  ],
};

// Permission validation rules
export const permissionValidationRules = {
  create: (): ValidationChain[] => [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tên quyền là bắt buộc'),
    body('action')
      .trim()
      .notEmpty()
      .withMessage('Action là bắt buộc')
      .isIn(PERMISSION_ACTIONS)
      .withMessage('Action không hợp lệ'),
    body('resource')
      .trim()
      .notEmpty()
      .withMessage('Resource là bắt buộc')
      .isIn(PERMISSION_RESOURCES)
      .withMessage('Resource không hợp lệ'),
    body('description')
      .optional()
      .trim(),
  ],

  update: (): ValidationChain[] => [
    body('name')
      .optional()
      .trim(),
    body('action')
      .optional()
      .trim()
      .isIn(PERMISSION_ACTIONS)
      .withMessage('Action không hợp lệ'),
    body('resource')
      .optional()
      .trim()
      .isIn(PERMISSION_RESOURCES)
      .withMessage('Resource không hợp lệ'),
    body('description')
      .optional()
      .trim(),
  ],
};

// Common validation rules
export const commonValidationRules = {
  uuid: (paramName: string = 'id'): ValidationChain[] => [
    param(paramName)
      .isUUID()
      .withMessage('ID không hợp lệ'),
  ],

  pagination: (): ValidationChain[] => [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page phải là số nguyên dương'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit phải từ 1-100'),
  ],
};
