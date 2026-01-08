import { userService } from './user.service';
import { LoginDto, RegisterDto, AuthResponseDto, TokenResponseDto } from '../dtos';
import { toUserResponseDto } from '../dtos/user.dto';
import { User } from '../entities';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { UnauthorizedError, BadRequestError } from '../utils/apiError';
import { MESSAGES, DEFAULT_USER_ROLE, DEFAULT_ROLE_PERMISSIONS } from '../constants';

class AuthService {
  // Login user
  login = async ({ username, password }: LoginDto): Promise<AuthResponseDto> => {
    const user = await userService.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Tài khoản đã bị khóa');
    }

    const tokens = generateTokenPair({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    });

    return {
      user: toUserResponseDto(user as User),
      tokens,
    };
  };

  // Register new user
  register = async (registerData: RegisterDto): Promise<AuthResponseDto> => {
    const user = await userService.createUser({
      ...registerData,
      role: DEFAULT_USER_ROLE,
    });

    const tokens = generateTokenPair({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: DEFAULT_ROLE_PERMISSIONS[DEFAULT_USER_ROLE] || [],
    });

    return {
      user,
      tokens,
    };
  };

  // Refresh tokens
  refreshToken = async (refreshToken: string): Promise<TokenResponseDto> => {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const tokens = generateTokenPair({
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions,
      });

      return tokens;
    } catch {
      throw new UnauthorizedError(MESSAGES.INVALID_TOKEN);
    }
  };

  // Get current user profile
  getProfile = async (userId: string): Promise<ReturnType<typeof userService.getUserById>> => {
    return userService.getUserById(userId);
  };

  // Change password
  changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {
    if (newPassword !== confirmPassword) {
      throw new BadRequestError('Mật khẩu xác nhận không khớp');
    }

    await userService.changePassword(userId, currentPassword, newPassword);
  };
}

export const authService = new AuthService();
