import { HttpStatus, MESSAGES } from '../constants';

// Base API Error class
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: Array<{ field: string; message: string }>;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Bad Request Error (400)
export class BadRequestError extends ApiError {
  constructor(
    message: string = MESSAGES.VALIDATION_ERROR,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(HttpStatus.BAD_REQUEST, message, true, errors);
  }
}

// Unauthorized Error (401)
export class UnauthorizedError extends ApiError {
  constructor(message: string = MESSAGES.UNAUTHORIZED) {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

// Forbidden Error (403)
export class ForbiddenError extends ApiError {
  constructor(message: string = MESSAGES.FORBIDDEN) {
    super(HttpStatus.FORBIDDEN, message);
  }
}

// Not Found Error (404)
export class NotFoundError extends ApiError {
  constructor(message: string = MESSAGES.NOT_FOUND) {
    super(HttpStatus.NOT_FOUND, message);
  }
}

// Conflict Error (409)
export class ConflictError extends ApiError {
  constructor(message: string) {
    super(HttpStatus.CONFLICT, message);
  }
}

// Internal Server Error (500)
export class InternalServerError extends ApiError {
  constructor(message: string = MESSAGES.INTERNAL_ERROR) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, false);
  }
}
