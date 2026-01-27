import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionAction, PermissionResource } from './enums';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({
    type: 'enum',
    enum: PermissionAction,
    nullable: true,
  })
  action!: PermissionAction | null;

  @Column({
    type: 'enum',
    enum: PermissionResource,
    nullable: true,
  })
  resource!: PermissionResource | null;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
