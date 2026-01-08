import { UserResponseDto } from './user.dto';

// DTO for login request
export interface LoginDto {
  username: string;
  password: string;
}

// DTO for register request (same as CreateUserDto but without role)
export interface RegisterDto {
  username: string;
  fullname: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

// DTO for refresh token request
export interface RefreshTokenDto {
  refreshToken: string;
}

// DTO for auth response (login/register)
export interface AuthResponseDto {
  user: UserResponseDto;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// DTO for token response
export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

// DTO for change password
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
