// API Response Interface
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: IValidationError[];
  pagination?: IPagination;
}

// Validation Error
export interface IValidationError {
  field: string;
  message: string;
}

// Pagination
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated result
export interface IPaginatedResult<T> {
  items: T[];
  pagination: IPagination;
}

// Query params for list
export interface IQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
