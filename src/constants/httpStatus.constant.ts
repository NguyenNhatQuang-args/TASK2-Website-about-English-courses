// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// API Response Messages
export const MESSAGES = {
  // Success messages
  SUCCESS: 'Thành công',
  CREATED: 'Tạo thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',

  // Auth messages
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  TOKEN_REFRESHED: 'Token đã được làm mới',

  // Error messages
  INTERNAL_ERROR: 'Lỗi hệ thống, vui lòng thử lại sau',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  UNAUTHORIZED: 'Bạn chưa đăng nhập',
  FORBIDDEN: 'Bạn không có quyền truy cập',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USER_EXISTS: 'Người dùng đã tồn tại',
  EMAIL_EXISTS: 'Email đã được sử dụng',
  INVALID_CREDENTIALS: 'Thông tin đăng nhập không chính xác',
  INVALID_TOKEN: 'Token không hợp lệ',
  TOKEN_EXPIRED: 'Token đã hết hạn',
  ROLE_NOT_FOUND: 'Không tìm thấy vai trò',
  ROLE_EXISTS: 'Vai trò đã tồn tại',
  PERMISSION_NOT_FOUND: 'Không tìm thấy quyền',
  PERMISSION_EXISTS: 'Quyền đã tồn tại',
};
