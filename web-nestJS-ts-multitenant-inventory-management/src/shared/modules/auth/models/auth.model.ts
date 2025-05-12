import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { EXPIRATION_TIME } from '../utils/constants';
import { ApiProperty } from '@nestjs/swagger';

export class AuthModel {
  @ApiProperty({
    description: 'The access token for the authenticated user.',
    type: 'string',
    example: 'string',
    format: 'jwt',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token for the authenticated user.',
    type: 'string',
    example: 'string',
    format: 'jwt',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({
    description: 'The expiration time of the access token in milliseconds.',
    type: 'number',
    example: EXPIRATION_TIME,
  })
  @IsInt()
  expireTime: number = EXPIRATION_TIME;
}
