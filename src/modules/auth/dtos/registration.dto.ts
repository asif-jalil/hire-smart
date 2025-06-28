import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RolesEnum } from 'src/constants/role.enum';
import { User } from 'src/modules/user/user.entity';
import { Trim } from 'src/utils/transformers/trim.decorator';
import { IsUnique } from 'src/utils/validators/is-unique.validator';
import { ValidationMessages } from 'src/utils/validators/validation-message';

const NON_ADMIN_ROLES = Object.values(RolesEnum).filter((role) => role !== RolesEnum.ADMIN);

export class CandidatePreferenceDto {
  @IsString({ message: 'Preferred location must be string' })
  @IsNotEmpty({ message: 'Preferred location is required' })
  @ApiProperty()
  preferredLocation: string;

  @IsInt({ message: 'Expected salary must be number' })
  @IsNotEmpty({ message: 'Expected salary is required' })
  @ApiProperty()
  expectedSalary: number;
}

export class RegisterDto {
  @IsOptional()
  @Trim()
  @ApiProperty()
  name?: string;

  @IsUnique(User, 'email', { message: 'User already exists' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Trim()
  @ApiProperty()
  email: string;

  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  @MaxLength(64, { message: ValidationMessages.maxLength('Password', 64) })
  @MinLength(6, { message: ValidationMessages.minLength('Password', 6) })
  @IsNotEmpty({ message: 'Password is required' })
  @Trim()
  @ApiProperty()
  password: string;

  @IsEnum(NON_ADMIN_ROLES, { message: `Role is limited to ${NON_ADMIN_ROLES.join(', ')}` })
  @IsNotEmpty({ message: 'Role is required' })
  @Trim()
  @ApiProperty({ enum: NON_ADMIN_ROLES, default: RolesEnum.CANDIDATE })
  role: RolesEnum;

  @ValidateIf((o: RegisterDto) => o.role === RolesEnum.CANDIDATE)
  @IsNotEmptyObject({}, { message: 'Candidate preference is required' })
  @ValidateNested()
  @Type(() => CandidatePreferenceDto)
  @ApiPropertyOptional({
    type: () => CandidatePreferenceDto,
    description: 'Candidate preference details (only for role = candidate)',
  })
  candidatePreference?: CandidatePreferenceDto;
}
