import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UnifiedIdentifiableModel {
  @ApiPropertyOptional({
    description: 'Unique identifier for the entity',
    example: '5f93855d942f74000025f075',
    type: 'string',
  })
  @IsString({ message: 'Id must be a string' })
  _id?: string;
}
