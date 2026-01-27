import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ClassModule } from './modules/class/class.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { CommonListModule } from './modules/common-list/common-list.module';

// Entities
import { 
  User, 
  Role, 
  Permission, 
  Course, 
  Class, 
  ClassStudent, 
  Lesson, 
  LessonDetail 
} from './entities';
import { CommonList } from './modules/common-list/common-list.entity';

@Module({
  imports: [
    // 1. Cấu hình biến môi trường (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Kết nối Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Role, Permission, Course, Class, ClassStudent, Lesson, LessonDetail, CommonList],
        synchronize: false, // Use migrations instead
        autoLoadEntities: true,
        ssl: configService.get<string>('NODE_ENV') === 'production' 
             ? { rejectUnauthorized: false } 
             : false,
      }),
    }),

    // 3. Đăng ký các Modules
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    ClassModule,
    LessonsModule,
    CommonListModule,
  ],
})
export class AppModule {}