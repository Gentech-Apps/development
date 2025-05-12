import { PickType } from '@nestjs/swagger';
import { Role } from '../schema/role.schema';

export class UpdateRoleDto extends PickType(Role, ['scopes', 'isActive', 'isDeleted']) {}
