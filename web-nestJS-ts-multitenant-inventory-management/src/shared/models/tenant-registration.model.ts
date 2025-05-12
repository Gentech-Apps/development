import { IntersectionType, PickType } from '@nestjs/swagger';
import { CreateTenantDto } from '../../modules/tenants/dtos/create-tenant.dto';
import { CreateUserDto } from '../../modules/users/dtos/create-user.dto';

export class TenantRegistrationModel extends IntersectionType(
  CreateTenantDto,
  PickType(CreateUserDto, ['email']),
) {}
