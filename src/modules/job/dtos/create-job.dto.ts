import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Trim } from 'src/utils/transformers/trim.decorator';

export class CreateJobDto {
  @IsString({ message: 'Title must be string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Trim()
  @ApiProperty({ example: 'Frontend Developer' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @Trim()
  @ApiProperty({ example: 'We are hiring a frontend developer with React experience.' })
  description: string;

  @IsString({ message: 'Job location must be string' })
  @IsNotEmpty({ message: 'Job location is required' })
  @Trim()
  @ApiProperty({ example: 'Dhaka' })
  location: string;

  @IsInt({ message: 'Min salary must be number' })
  @Min(0, { message: 'Minimum salary must be a positive integer' })
  @ApiProperty({ example: 40000 })
  minSalary: number;

  @IsInt({ message: 'Max salary must be number' })
  @Min(0, { message: 'Maximum salary must be a positive integer' })
  @IsOptional()
  @ApiPropertyOptional({ example: 60000 })
  maxSalary?: number;

  @IsArray({ message: 'Skill IDs must be an array' })
  @IsInt({ each: true, message: 'Skill IDs must be numbers' })
  @ArrayNotEmpty({ message: 'At least one skill is required' })
  @ApiProperty({ type: [Number], description: 'List of skill IDs' })
  skillIds: number[];
}
