import { UserRole } from '../constants';

// Base User Interface
export interface IUser {
  _id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  password: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Document (for Mongoose)
export interface IUserDocument extends IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User for creation
export interface IUserCreate {
  username: string;
  fullname: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  password: string;
  role?: UserRole;
}

// User for update
export interface IUserUpdate {
  fullname?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: Date;
  role?: UserRole;
  permissions?: string[];
  isActive?: boolean;
}

// User filter query
export interface IUserQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
