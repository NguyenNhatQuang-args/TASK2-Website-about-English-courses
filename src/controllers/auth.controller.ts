import { Response, NextFunction } from 'express';
import { authService } from '../services';
import { successResponse } from '../utils/responseHelper';
import { IAuthRequest } from '../types';
import { HttpStatus, MESSAGES } from '../constants';
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto } from '../dtos';

class AuthController {
  // POST /api/v1/auth/login
  login = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const result = await authService.login(loginData);

      successResponse(res, {
        data: result,
        message: MESSAGES.LOGIN_SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/auth/register
  register = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const registerData: RegisterDto = req.body;
      const result = await authService.register(registerData);

      successResponse(res, {
        data: result,
        message: MESSAGES.REGISTER_SUCCESS,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/auth/refresh-token
  refreshToken = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken }: RefreshTokenDto = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      successResponse(res, {
        data: tokens,
        message: MESSAGES.TOKEN_REFRESHED,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/auth/profile
  getProfile = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const profile = await authService.getProfile(userId);

      successResponse(res, {
        data: profile,
        message: MESSAGES.SUCCESS,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/auth/change-password
  changePassword = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const { currentPassword, newPassword, confirmPassword }: ChangePasswordDto =
        req.body;

      await authService.changePassword(
        userId,
        currentPassword,
        newPassword,
        confirmPassword
      );

      successResponse(res, {
        message: 'Đổi mật khẩu thành công',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/auth/logout
  logout = async (
    _req: IAuthRequest,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    // For JWT, logout is handled on client-side by removing tokens
    // Server-side can implement token blacklisting if needed
    successResponse(res, {
      message: MESSAGES.LOGOUT_SUCCESS,
      statusCode: HttpStatus.OK,
    });
  };
}

export const authController = new AuthController();
