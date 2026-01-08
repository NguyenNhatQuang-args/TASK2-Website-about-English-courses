import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IJwtPayload, ITokenPair } from '../types';

// Generate access token
export const generateAccessToken = (payload: Omit<IJwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
};

// Generate refresh token
export const generateRefreshToken = (payload: Omit<IJwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
};

// Generate token pair (access + refresh)
export const generateTokenPair = (payload: Omit<IJwtPayload, 'iat' | 'exp'>): ITokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

// Verify access token
export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.secret) as IJwtPayload;
};

// Verify refresh token
export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as IJwtPayload;
};

// Decode token without verification (for debugging)
export const decodeToken = (token: string): IJwtPayload | null => {
  return jwt.decode(token) as IJwtPayload | null;
};
