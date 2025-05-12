import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../schema/user.schema';
import { IsString, IsNotEmpty, MaxLength, IsMongoId, IsEmail } from 'class-validator';

export class CreateUserDto extends PickType(User, [
  'tenantId',
  'nameLocale',
  'profileImage',
  'password',
]) {
  @ApiProperty({
    description: 'Name in primary language as per the tenant configs (i.e. default English)',
    type: 'string',
    example: 'John Doe',
  })
  @MaxLength(120, { message: 'Name must be shorter than or equal to 120 characters' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

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
}
