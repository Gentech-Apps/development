import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenModel {
  @ApiProperty({
    description: 'The refresh token for the authenticated user.',
    type: 'string',
    example: 'string',
    format: 'jwt',
  })
  @IsString({ message: 'Refresh token should be string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
