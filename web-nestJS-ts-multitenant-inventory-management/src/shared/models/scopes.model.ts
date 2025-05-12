import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { ScopeEntityEnum } from '../enums/scopes.enum';

export class ScopePermissionsModel {
  @ApiPropertyOptional({
    description: 'User will have control over the self data',
    example: true,
  })
  @IsBoolean({ message: 'Self must be boolean' })
  self?: boolean;

  @ApiPropertyOptional({
    description: 'User will have control over the others data too.',
    example: true,
  })
  @IsBoolean({ message: 'All must be boolean' })
  all?: boolean;
}

export class ScopesModel {
  @ApiPropertyOptional({
    description: 'Name of the entity',
    example: ScopeEntityEnum.Tenants,
    enum: ScopeEntityEnum,
  })
  @IsEnum(ScopeEntityEnum, { message: 'Entity must be from the Enum' })
  @IsNotEmpty({ message: 'Entity is required' })
  entity: string;

  @ApiPropertyOptional({
    description: 'Read scope of the entity',
    example: { self: true, all: false },
    type: ScopePermissionsModel,
  })
  @IsObject({ message: 'Read object should contain at least on permission', each: true })
  read: ScopePermissionsModel;

  @ApiPropertyOptional({
    description: 'Write scope of the entity',
    example: { self: true, all: false },
    type: ScopePermissionsModel,
  })
  @IsObject({ message: 'Write object should contain at least on permission', each: true })
  @IsOptional()
  write?: ScopePermissionsModel;
}
