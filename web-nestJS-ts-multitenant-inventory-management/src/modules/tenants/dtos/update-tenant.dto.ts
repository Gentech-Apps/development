import { PickType } from '@nestjs/swagger';
import { Tenant } from '../schema/tenant.schema';

export class UpdateTenantDto extends PickType(Tenant, [
  'country',
  'secondaryLanguage',
  'currency',
  'isActive',
  'isDeleted',
]) {}
