import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { PermissionAction, PermissionResource } from '../../../entities/enums';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Tên quyền không được quá 100 ký tự' })
  @Matches(/^[a-z]+:[a-z]+$/, {
    message: 'Tên quyền phải có định dạng action:resource (vd: read:users)',
  })
  name?: string;

  @IsEnum(PermissionAction, { message: 'Action không hợp lệ' })
  @IsOptional()
  action?: PermissionAction;

  @IsEnum(PermissionResource, { message: 'Resource không hợp lệ' })
  @IsOptional()
  resource?: PermissionResource;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;
}
