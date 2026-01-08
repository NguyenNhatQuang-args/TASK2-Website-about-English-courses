import { DataSource } from 'typeorm';
import { config, isDevelopment } from './index';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  synchronize: isDevelopment(), // Auto sync in development only
  logging: isDevelopment(),
  entities: [User, Role, Permission],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL (Supabase) connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};
