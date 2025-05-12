import { ApiProperty, PickType } from '@nestjs/swagger';
import { ActivityLog } from '../schema/activity-log.schema';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { HttpMethods } from '../../../enums/http-methods.enum';

export class CreateActivityLogDto extends PickType(ActivityLog, [
  'tenantId',
  'userId',
  'entity',
  'body',
  'param',
  'query',
]) {
  @ApiProperty({
    description: 'The HTTP method of the request (e.g., GET, POST)',
    enum: HttpMethods,
    example: 'POST',
  })
  @IsEnum(HttpMethods, { message: 'Method must be a valid HTTP method' })
  @IsNotEmpty({ message: 'User id is required' })
  method: string;

  @ApiProperty({
    description: 'The request headers',
    type: 'object',
    additionalProperties: true,
  })
  @IsNotEmpty({ message: 'Headers is required' })
  headers: Record<string, unknown>;

  @ApiProperty({
    description: 'The HTTP status code returned',
    example: 200,
  })
  @IsNotEmpty({ message: 'status code is required' })
  statusCode: number;

  @ApiProperty({
    description: 'The API endpoint path',
    example: '/api/v1/users',
  })
  @IsString({ message: 'Path must be a string' })
  @IsNotEmpty({ message: 'Path is required' })
  path: string;
}
