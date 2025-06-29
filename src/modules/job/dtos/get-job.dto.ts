import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetJobDto {
  @ApiPropertyOptional({ description: 'Full-text search on title, description, location' })
  @IsOptional()
  @IsString()
  search?: string;
}
