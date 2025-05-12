import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsEnum, MaxLength } from 'class-validator';
import { CountryCodeEnum, LanguageCodeEnum, CurrencyCodeEnum } from '../utils';

export class CreateTenantDto {
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
    description: 'Country code associated with the tenant',
    example: 'AF',
    enum: CountryCodeEnum,
  })
  @IsEnum(CountryCodeEnum, { message: 'Country code must be from the Enum' })
  @IsNotEmpty({ message: 'Country code is required' })
  country: string;

  @ApiProperty({
    description: 'Secondary language associated with the tenant',
    example: 'jpn',
    enum: LanguageCodeEnum,
  })
  @IsEnum(LanguageCodeEnum, { message: 'Secondary language must be from the Enum' })
  @IsNotEmpty({ message: 'Secondary language is required' })
  secondaryLanguage: string;

  @ApiProperty({
    description: 'Currency associated with the tenant',
    example: 'AFN',
    enum: CurrencyCodeEnum,
  })
  @IsEnum(CurrencyCodeEnum, { message: 'Currency must be from the Enum' })
  @IsNotEmpty({ message: 'Currency is required' })
  currency: string;
}
