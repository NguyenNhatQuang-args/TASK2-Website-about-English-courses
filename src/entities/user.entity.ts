import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { config } from '../config';
import { UserRole, DEFAULT_USER_ROLE } from '../constants';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 100 })
  fullname!: string;

  @Column({ type: 'varchar', length: 15 })
  phone!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth!: Date;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: DEFAULT_USER_ROLE,
  })
  role!: UserRole;

  @Column({ type: 'simple-array', default: '' })
  permissions!: string[];

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Flag to track if password needs hashing
  private tempPassword?: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate(): Promise<void> {
    if (this.tempPassword) {
      const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
      this.password = await bcrypt.hash(this.tempPassword, salt);
      this.tempPassword = undefined;
    }
  }

  // Method to set new password (will be hashed on update)
  setPassword(newPassword: string): void {
    this.tempPassword = newPassword;
    this.password = newPassword; // Will be hashed in BeforeUpdate
  }

  // Compare password method
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
