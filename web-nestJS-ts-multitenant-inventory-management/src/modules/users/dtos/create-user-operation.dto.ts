import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsEmail, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateUserOperationDto {
  @ApiProperty({
    description: 'Email of the user',
    type: 'string',
    uniqueItems: true,
    example: 'john.doe@example.com',
  })
  @MaxLength(320, { message: 'Email must be shorter than or equal to 320 characters' })
  @IsEmail({ domain_specific_validation: true }, { each: true, message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required and unique' })
  email: string;

  @ApiProperty({
    description: 'The ID of the role associated with user.',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'Role id should be valid' })
  @IsNotEmpty({ message: 'Role id is required' })
  roleId: string;

  @ApiProperty({
    description: 'The ID of the tenant associated with user.',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'Tenant id should be valid' })
  @IsNotEmpty({ message: 'Tenant id is required' })
  tenantId: string;
}
