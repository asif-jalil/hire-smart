import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Trim } from 'src/utils/transformers/trim.decorator';

class SkillDto {
  @IsString({ message: 'Skill name must be a string' })
  @IsNotEmpty({ message: 'Skill name is required' })
  @Trim()
  @ApiProperty({ example: 'TypeScript' })
  name: string;
}

export class CreateBulkSkillsDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: 'Skills must at least one item' })
  @IsArray({ message: 'Skills must be an array' })
  @Type(() => SkillDto)
  @ApiProperty({
    type: [SkillDto],
    example: [{ name: 'TypeScript' }, { name: 'GraphQL' }],
  })
  skills: SkillDto[];
}
