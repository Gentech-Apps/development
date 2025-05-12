import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { EmailTemplateTypeEnum } from '../enums/template.enum';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

export class UnifiedEmailModel implements ISendMailOptions {
  @MaxLength(320, { message: 'Each to email must be shorter than or equal to 320 characters' })
  @IsEmail({}, { each: true, message: 'Each to email must be valid' })
  @IsNotEmpty({ message: 'Each to email is required' })
  @IsArray()
  to: string | Address | Array<string | Address>;

  @MaxLength(320, { message: 'Each cc email must be shorter than or equal to 320 characters' })
  @IsEmail({}, { each: true, message: 'Each cc email must be valid' })
  @IsNotEmpty({ message: 'Each cc email is required' })
  @IsArray()
  @IsOptional()
  cc?: string | Address | Array<string | Address>;

  @MaxLength(320, { message: 'Each bcc email must be shorter than or equal to 320 characters' })
  @IsEmail({}, { each: true, message: 'Each bcc email must be valid' })
  @IsNotEmpty({ message: 'Each bcc email is required' })
  @IsArray()
  @IsOptional()
  bcc?: string | Address | Array<string | Address>;

  @MaxLength(320, { message: 'From email must be shorter than or equal to 320 characters' })
  @IsEmail({}, { message: 'From email must be valid' })
  @IsNotEmpty({ message: 'From email is required' })
  @IsOptional()
  from?: string | Address;

  @IsString({ message: 'Subject must be string.' })
  @IsNotEmpty({ message: 'Subject is required' })
  subject: string;

  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];

  @IsObject({ message: 'Content must be object that includes [key: value] pairs' })
  @IsOptional()
  content?: Record<string, unknown>;

  @IsEnum(EmailTemplateTypeEnum, { message: 'Email type must be from enum' })
  @ValidateNested({ each: true })
  @IsNotEmpty({ message: 'Email type is required' })
  emailTemplateType: string;
}
