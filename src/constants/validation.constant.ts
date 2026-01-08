// Regex patterns for validation
export const REGEX_PATTERNS = {
  // Email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Phone number Vietnam (10-11 digits, starting with 0)
  PHONE_VN: /^(0[3|5|7|8|9])+([0-9]{8})$/,
  
  // Password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  // Username: alphanumeric, underscore, 3-30 chars
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  
  // Full name: Vietnamese characters allowed
  FULLNAME: /^[a-zA-ZÀ-ỹ\s]{2,100}$/,
};

// Validation messages
export const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: 'Tên đăng nhập là bắt buộc',
  USERNAME_INVALID: 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới (3-30 ký tự)',
  PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_WEAK: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 8 ký tự',
  EMAIL_REQUIRED: 'Email là bắt buộc',
  EMAIL_INVALID: 'Email không hợp lệ',
  PHONE_INVALID: 'Số điện thoại không hợp lệ',
  FULLNAME_REQUIRED: 'Họ và tên là bắt buộc',
  FULLNAME_INVALID: 'Họ và tên không hợp lệ',
  DOB_REQUIRED: 'Ngày sinh là bắt buộc',
  DOB_INVALID: 'Ngày sinh không hợp lệ',
  ROLE_INVALID: 'Vai trò không hợp lệ',
};

// Field lengths
export const FIELD_LENGTHS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  FULLNAME_MIN: 2,
  FULLNAME_MAX: 100,
  EMAIL_MAX: 255,
  PHONE_MIN: 10,
  PHONE_MAX: 11,
};
