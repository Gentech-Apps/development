import { IntersectionType, PickType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class CreateTenantOperationDto extends IntersectionType(
  CreateTenantDto,
  PickType(CreateUserDto, ['email']),
) {}
