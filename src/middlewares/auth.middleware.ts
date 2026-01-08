import { Response, NextFunction } from 'express';
import { IAuthRequest, IJwtPayload } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/apiError';
import { MESSAGES } from '../constants';

// Authentication middleware - verify JWT token
export const authenticate = (
  req: IAuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError(MESSAGES.UNAUTHORIZED);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError(MESSAGES.INVALID_TOKEN));
    }
  }
};

// Authorization middleware - check user role
export const authorize = (...allowedRoles: string[]) => {
  return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    const user = req.user as IJwtPayload;

    if (!user) {
      return next(new UnauthorizedError(MESSAGES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError(MESSAGES.FORBIDDEN));
    }

    next();
  };
};

// Permission middleware - check specific permission
export const hasPermission = (...requiredPermissions: string[]) => {
  return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    const user = req.user as IJwtPayload;

    if (!user) {
      return next(new UnauthorizedError(MESSAGES.UNAUTHORIZED));
    }

    // Admin has all permissions
    if (user.role === 'admin') {
      return next();
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return next(new ForbiddenError(MESSAGES.FORBIDDEN));
    }

    next();
  };
};
