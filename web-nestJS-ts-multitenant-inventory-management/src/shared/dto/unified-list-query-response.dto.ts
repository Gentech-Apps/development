import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UnifiedListQueryResponseDto<T> {
  @ApiProperty({
    description: 'Record details',
  })
  @IsArray()
  data: T | T[];

  @ApiPropertyOptional({
    description: 'Total number of records.',
  })
  @IsOptional()
  @IsNumber()
  totalCount?: number;

  @ApiPropertyOptional({
    description: 'Pagination cursor',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsString()
  @IsOptional()
  next?: string;

  @IsString()
  @IsOptional()
  prev?: string;
}
