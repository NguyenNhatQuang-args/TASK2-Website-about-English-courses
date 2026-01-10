// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Nếu chưa có thì cài: npm i @nestjs/config
import { ClassModule } from './modules/class/class.module';
import { User } from './entities/user.entity'; // Trỏ đúng đường dẫn User entity của bạn
import { Class } from './modules/class/class.entity';

@Module({
  imports: [
    // 1. Cấu hình biến môi trường (.env)
    ConfigModule.forRoot(),

    // 2. Kết nối Database (Lấy thông tin từ .env)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Tự động đọc link từ file .env
      entities: [User, Class],      // Khai báo các bảng
      synchronize: true,            // Tự động tạo bảng (chỉ dùng cho dev)
      autoLoadEntities: true,
    }),

    // 3. Đăng ký Module của bạn
    ClassModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}