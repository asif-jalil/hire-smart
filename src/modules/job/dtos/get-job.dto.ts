import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export enum PostedBy {
  ME = 'me',
  OTHERS = 'others',
  ALL = 'all',
}

export class GetJobDto {
  @ApiPropertyOptional({ description: 'Full-text search on title, description, location' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Full-text search on title, description, location' })
  @IsOptional()
  @IsString()
  postedBy?: string;
}
