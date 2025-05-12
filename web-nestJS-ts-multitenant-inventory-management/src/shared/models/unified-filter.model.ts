import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsDateString, IsMongoId } from 'class-validator';

export class UnifiedApiFilterModel {
  @ApiPropertyOptional({
    description:
      'Filter allows you to retrieve records that were updated on or after the specified date and time',
    type: 'string',
    example: process.env.APP_DEFAULT_DATE,
  })
  @IsDateString(
    { strictSeparator: true, strict: true },
    { message: 'From date string must be in ISO format' },
  )
  @IsOptional()
  updatedAt?: string;

  @ApiPropertyOptional({
    description: 'Filter allows you to retrieve records based on their deletion status',
    type: 'boolean',
  })
  @IsBoolean({ message: 'isDeleted must be a boolean' })
  @Type(() => Boolean)
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'The ID of the tenant',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'Tenant id should be valid' })
  @IsOptional()
  tenantId?: string;
}
