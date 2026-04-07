import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

export class UpdateUserRoleDto {
  @IsInt({ message: 'ID người dùng không được để trống' })
  @IsPositive({ message: 'ID người dùng phải lớn hơn 0' })
  @IsNotEmpty({ message: 'ID người dùng không được trống' })
  userId: number;

  @IsEnum(UserRole, {
    message: `Vai trò người dùng phải là một trong các giá trị: STAFF, MANAGER`,
  })
  @IsNotEmpty({ message: 'Vai trò người dùng không được để trống' })
  role: UserRole;
}
