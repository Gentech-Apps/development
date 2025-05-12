import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';

export class AuthorizeModel {
  @ApiProperty({
    description: 'Company name of the tenant',
    uniqueItems: true,
  })
  @Matches(/^(?!-)(?!.*--)(?!.*[_.~,:!@#%^&])[a-zA-Z0-9-]{1,63}(?<!-)$/, {
    message:
      'Company names should only contain alphanumeric characters, hyphens (not at the beginning or end), and underscores.',
  })
  @MaxLength(20, { message: 'Company name must be shorter than or equal to 20 characters' })
  @IsString({ message: 'Company name must be a string' })
  @IsNotEmpty({ message: 'Company name is required' })
  companyName: string;

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
    description: 'Password of the user',
    type: 'string',
    example: 'User@1234',
  })
  @MaxLength(30, { message: 'Password must be shorter than or equal to 30 characters' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
