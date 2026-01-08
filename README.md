# Backend API

## Mô tả
Backend API được xây dựng với TypeScript, Express.js, PostgreSQL (TypeORM) và JWT authentication.

## Cấu trúc thư mục

```
src/
├── config/          # Cấu hình ứng dụng
├── constants/       # Các hằng số dùng chung
├── controllers/     # Xử lý request/response
├── dtos/            # Data Transfer Objects
├── entities/        # TypeORM entities
├── middlewares/     # Middleware (auth, error, validation)
├── routes/          # Định nghĩa routes
├── services/        # Business logic
├── seeds/           # Dữ liệu mặc định
├── types/           # TypeScript types/interfaces
├── utils/           # Các hàm tiện ích
├── app.ts           # Express app configuration
└── index.ts         # Entry point
```

## Cài đặt

### 1. Cài đặt PostgreSQL
Đảm bảo PostgreSQL đã được cài đặt và đang chạy.

### 2. Tạo database
```sql
CREATE DATABASE task2_db;
```

### 3. Cài đặt dependencies
```bash
npm install
```

### 4. Cấu hình môi trường
Tạo file `.env` từ `.env.example` và cập nhật thông tin database.

### 5. Chạy ứng dụng
```bash
# Development mode
npm run dev

# Build production
npm run build

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký tài khoản
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh-token` - Làm mới token
- `GET /api/v1/auth/profile` - Lấy thông tin profile (Auth required)
- `PUT /api/v1/auth/change-password` - Đổi mật khẩu (Auth required)
- `POST /api/v1/auth/logout` - Đăng xuất (Auth required)

### Users (Admin only)
- `GET /api/v1/users` - Lấy danh sách users
- `GET /api/v1/users/:id` - Lấy user theo ID
- `POST /api/v1/users` - Tạo user mới
- `PUT /api/v1/users/:id` - Cập nhật user
- `DELETE /api/v1/users/:id` - Xóa user
- `PUT /api/v1/users/:id/role` - Gán role cho user
- `PUT /api/v1/users/:id/permissions` - Gán permissions cho user

### Roles (Admin only)
- `GET /api/v1/roles` - Lấy danh sách roles
- `GET /api/v1/roles/:id` - Lấy role theo ID
- `POST /api/v1/roles` - Tạo role mới
- `PUT /api/v1/roles/:id` - Cập nhật role
- `DELETE /api/v1/roles/:id` - Xóa role
- `POST /api/v1/roles/:id/permissions` - Thêm permissions vào role
- `DELETE /api/v1/roles/:id/permissions` - Xóa permissions khỏi role

### Permissions (Admin only)
- `GET /api/v1/permissions` - Lấy danh sách permissions
- `GET /api/v1/permissions/:id` - Lấy permission theo ID
- `POST /api/v1/permissions` - Tạo permission mới
- `POST /api/v1/permissions/bulk` - Tạo nhiều permissions
- `PUT /api/v1/permissions/:id` - Cập nhật permission
- `DELETE /api/v1/permissions/:id` - Xóa permission
- `GET /api/v1/permissions/resource/:resource` - Lấy permissions theo resource

## Roles mặc định
- `admin` - Quản trị viên, có toàn quyền
- `teacher` - Giáo viên, quản lý courses và lessons
- `user` - Người dùng cơ bản

## Tài khoản Admin mặc định
- **Username:** admin
- **Password:** 

## Request Examples

### Register
```json
POST /api/v1/auth/register
{
  "username": "johndoe",
  "fullname": "John Doe",
  "phone": "0987654321",
  "email": "john@example.com",
  "dateOfBirth": "1995-06-15",
  "password": "Password123"
}
```

### Login
```json
POST /api/v1/auth/login
{
  "username": "johndoe",
  "password": "Password123"
}
```

### Create Role (Admin)
```json
POST /api/v1/roles
Authorization: Bearer <access_token>
{
  "name": "moderator",
  "description": "Người điều hành",
  "permissions": ["read:users", "read:courses"]
}
```

### Assign Role to User (Admin)
```json
PUT /api/v1/users/:id/role
Authorization: Bearer <access_token>
{
  "role": "teacher"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Lỗi...",
  "errors": [
    {
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```
