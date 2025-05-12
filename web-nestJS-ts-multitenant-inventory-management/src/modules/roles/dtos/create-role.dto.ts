import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Role, RoleScopesModel } from '../schema/role.schema';
import { Type } from 'class-transformer';
import { ReadWritePermissions } from '../../../shared/decorators/validators/readWritePermission';
import { HasDependentEntityPermissions } from '../../../shared/decorators/validators/hasDependentEntityPermissions ';

export class CreateRoleDto extends PickType(Role, ['tenantId', 'nameLocale']) {
  @ApiProperty({ description: 'Role name', type: 'string', example: 'Super Admin' })
  @MaxLength(120, { message: 'Role must be shorter than or equal to 120 characters' })
  @IsString({ message: 'Role name must be a string' })
  @IsNotEmpty({ message: 'Role name is required' })
  name: string;

  @ApiProperty({
    description: 'Scopes of the role',
    type: [RoleScopesModel],
  })
  @Type(() => RoleScopesModel)
  @ValidateNested({ each: true })
  @ReadWritePermissions()
  @HasDependentEntityPermissions()
  @IsArray({ message: 'Scopes must be an array' })
  @IsNotEmpty({ message: 'At least one scope is required' })
  scopes: RoleScopesModel[];
}
