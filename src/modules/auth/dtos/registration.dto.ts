import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { RolesEnum } from 'src/constants/role.enum';
import { User } from 'src/modules/user/user.entity';
import { Trim } from 'src/utils/transformers/trim.decorator';
import { IsUnique } from 'src/utils/validators/is-unique.validator';
import { ValidationMessages } from 'src/utils/validators/validation-message';

const NON_ADMIN_ROLES = Object.values(RolesEnum).filter((role) => role !== RolesEnum.ADMIN);

export class RegisterDto {
  @IsOptional()
  @Trim()
  @ApiProperty()
  name?: string;

  @IsUnique(User, 'email', { message: 'User already exists' })
  @IsNotEmpty({ message: 'Email is required' })
  @Trim()
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  @MaxLength(64, { message: ValidationMessages.maxLength('Password', 64) })
  @MinLength(6, { message: ValidationMessages.minLength('Password', 6) })
  @Trim()
  @ApiProperty()
  password: string;

  @IsEnum(NON_ADMIN_ROLES, { message: 'Invalid role' })
  @ValidateIf((o: RegisterDto) => o.role !== RolesEnum.ADMIN)
  @IsNotEmpty({ message: 'Role is required' })
  @IsOptional()
  @Trim()
  @ApiProperty({ enum: NON_ADMIN_ROLES, default: RolesEnum.CANDIDATE })
  role: RolesEnum;
}
