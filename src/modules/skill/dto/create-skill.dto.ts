import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from 'src/utils/validators/is-unique.validator';
import { Skill } from '../entities/skill.entity';

export class CreateSkillDto {
  @IsUnique(Skill, 'name', {
    message: 'Skill with this name already exists',
  })
  @IsString({ message: 'Skill name must be a string' })
  @IsNotEmpty({ message: 'Skill name is required' })
  @ApiProperty({ example: 'TypeScript' })
  name: string;
}
