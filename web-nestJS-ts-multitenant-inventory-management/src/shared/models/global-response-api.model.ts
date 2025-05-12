import { ApiProperty } from '@nestjs/swagger';

export class GlobalResponseApiModel {
  statusCode?: number;

  @ApiProperty({
    description: 'Error message or object',
    required: true,
    example: ['string'],
  })
  message: string[] | unknown;

  @ApiProperty({
    description: 'Timestamp of the error',
    required: true,
  })
  timestamp: string;

  @ApiProperty({
    description: 'API endpoint that triggered the error',
    required: true,
  })
  path: string;
}

export class GlobalExceptionResponseApiModel extends GlobalResponseApiModel {}
