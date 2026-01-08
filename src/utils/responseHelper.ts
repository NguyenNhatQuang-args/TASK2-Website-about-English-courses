import { Response } from 'express';
import { HttpStatus } from '../constants';
import { IApiResponse, IPagination } from '../types';

// Success response helper
export const successResponse = <T>(
  res: Response,
  { data, message = 'Thành công', statusCode = HttpStatus.OK, pagination }: {
    data?: T;
    message?: string;
    statusCode?: number;
    pagination?: IPagination;
  }
): Response => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    data,
    pagination,
  };
  return res.status(statusCode).json(response);
};

// Error response helper
export const errorResponse = (
  res: Response,
  { message, statusCode = HttpStatus.INTERNAL_SERVER_ERROR, errors }: {
    message: string;
    statusCode?: number;
    errors?: Array<{ field: string; message: string }>;
  }
): Response => {
  const response: IApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};

// Create pagination object
export const createPagination = (
  { page, limit, total }: {
    page: number;
    limit: number;
    total: number;
  }
): IPagination => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
