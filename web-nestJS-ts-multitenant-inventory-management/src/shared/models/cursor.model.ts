import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { decodeCursor } from '../utils/decodeCursor';

export class CursorModel {
  @IsNumber()
  version: number;

  @IsNumber()
  $skip: number;

  @IsNumber()
  $limit: number;
}

export class UnifiedApiPaginationModel {
  @ApiPropertyOptional({
    description: 'Cursor to fetch next/previous records',
    type: String,
  })
  @Transform(({ value }) => decodeCursor(value))
  @IsOptional()
  cursor?: CursorModel;
}
