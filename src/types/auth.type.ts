import { Request } from 'express';
import { IUser } from './user.type';

// JWT Payload
export interface IJwtPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

// Login credentials
export interface ILoginCredentials {
  username: string;
  password: string;
}

// Token pair
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

// Auth response
export interface IAuthResponse {
  user: Partial<IUser>;
  tokens: ITokenPair;
}

// Request with user (after auth middleware)
export interface IAuthRequest extends Request {
  user?: IJwtPayload;
}

// Refresh token request
export interface IRefreshTokenRequest {
  refreshToken: string;
}
