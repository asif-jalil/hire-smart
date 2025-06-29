import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Trim } from 'src/utils/transformers/trim.decorator';

export class ApplyJobDto {
  @IsString({ message: 'Cover letter should be text' })
  @IsOptional()
  @Trim()
  @ApiPropertyOptional({ example: 'I am very excited about this role...' })
  coverLetter?: string;

  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsNotEmpty({ message: 'Resume URL is required' })
  @Trim()
  @ApiProperty({ example: 'https://example.com/resume.pdf' })
  resumeUrl: string;
}
