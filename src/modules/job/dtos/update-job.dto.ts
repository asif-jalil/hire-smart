import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Trim } from 'src/utils/transformers/trim.decorator';

export class UpdateJobDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @Trim()
  @ApiPropertyOptional({ example: 'Updated Job Title' })
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @Trim()
  @ApiPropertyOptional({ example: 'Updated job description' })
  description?: string;

  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  @Trim()
  @ApiPropertyOptional({ example: 'Dhaka' })
  location?: string;

  @IsInt({ message: 'Minimum salary must be an integer' })
  @Min(0, { message: 'Minimum salary must be at least 0' })
  @IsOptional()
  @ApiPropertyOptional({ example: 45000 })
  minSalary?: number;

  @IsInt({ message: 'Maximum salary must be an integer' })
  @Min(0, { message: 'Maximum salary must be at least 0' })
  @IsOptional()
  @ApiPropertyOptional({ example: 70000 })
  maxSalary?: number;

  @IsArray({ message: 'Skill IDs must be an array' })
  @IsInt({ each: true, message: 'Skill IDs must be numbers' })
  @ArrayNotEmpty({ message: 'At least one skill is required' })
  @IsOptional()
  @ApiPropertyOptional({ type: [Number], description: 'List of skill IDs' })
  skillIds?: number[];
}
