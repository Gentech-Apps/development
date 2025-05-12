import {
  ROLES_WITH_PERMISSIONS,
  ROLES_WITH_PERMISSIONS_SEEDER,
} from '../../../shared/constants/role-permissions';
import { ApiControllerTag } from '../../../swagger/tags';
import { TenantDocument } from '../schema/tenant.schema';

export const getRolesScope = (tenant: TenantDocument) => {
  const entities = Object.values(ApiControllerTag);
  const { _id, companyName } = tenant;
  const roles = companyName === 'app' ? ROLES_WITH_PERMISSIONS_SEEDER : ROLES_WITH_PERMISSIONS;
  return Object.keys(roles).map((role) => {
    return {
      name: role,
      tenantId: _id,
      scopes: entities.map((entity) => ({
        entity,
        read: roles[role].read,
        write: roles[role].write,
      })),
    };
  });
};
