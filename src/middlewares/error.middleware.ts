import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { errorResponse } from '../utils/responseHelper';
import { HttpStatus, MESSAGES } from '../constants';
import { isDevelopment } from '../config';

// Global error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Log error in development
  if (isDevelopment()) {
    console.error('Error:', err);
  }

  // Handle ApiError
  if (err instanceof ApiError) {
    return errorResponse(res, {
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, {
      message: MESSAGES.VALIDATION_ERROR,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    return errorResponse(res, {
      message: 'Dữ liệu đã tồn tại trong hệ thống',
      statusCode: HttpStatus.CONFLICT,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, {
      message: MESSAGES.INVALID_TOKEN,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, {
      message: MESSAGES.TOKEN_EXPIRED,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  // Handle unknown errors
  return errorResponse(res, {
    message: isDevelopment() ? err.message : MESSAGES.INTERNAL_ERROR,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  });
};

// 404 Not Found handler
export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return errorResponse(res, {
    message: 'Không tìm thấy đường dẫn yêu cầu',
    statusCode: HttpStatus.NOT_FOUND,
  });
};
