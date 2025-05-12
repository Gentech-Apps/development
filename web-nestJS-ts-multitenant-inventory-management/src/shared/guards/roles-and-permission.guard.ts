import {
  Injectable,
  CanActivate,
  Logger,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { RolesService } from '../../modules/roles/roles.service';
import { ApiKeysService } from '../../modules/api-keys/api-keys.service';
import { hasPermissions } from '../utils/has-permission';
import { isMissing, notMissing } from '../utils/typecheck';
import { DEFAULT_ROLES } from '../enums/default-roles.enum';
import { ScopesModel } from '../models/scopes.model';

@Injectable()
export class RolesAndPermissionGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly apiKeysService: ApiKeysService,
    private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let scopes: ScopesModel[];

    if (notMissing(request.user)) {
      const { user_id, tenant_id: tenantId } = request.user;
      const user = await this.usersService.findOneUser({ id: user_id, tenantId });
      const role = await this.rolesService.findOneRole({ id: user.roleId, tenantId });

      scopes = role.scopes;
    } else {
      const key = request.headers['x-account-key'];
      //fetching api key record with given key from headers
      const apiKeyResult = await this.apiKeysService.findAllApiKeys({
        stages: [{ $match: { key } }],
      });

      if (isMissing(apiKeyResult.data[0])) {
        this.logger.verbose(
          JSON.stringify({
            context: 'ApiKeysService',
            message: 'Api key not found',
            resource: ApiKeysService.name,
          }),
        );
        throw new UnauthorizedException('Invalid API key');
      }

      // fetching either master admin or super admin with the given tenant id
      const { tenantId } = apiKeyResult.data[0];
      const rolesResult = await this.rolesService.findAllRoles({
        stages: [
          {
            $match: {
              tenantId,
              $or: [{ name: DEFAULT_ROLES.MASTER_ADMIN }, { name: DEFAULT_ROLES.SUPER_ADMIN }],
            },
          },
        ],
      });

      if (isMissing(rolesResult.data[0])) {
        this.logger.verbose(
          JSON.stringify({
            context: 'RolesAndPermissionGuard',
            message: 'Record not found',
            resource: RolesAndPermissionGuard.name,
          }),
        );
        throw new NotFoundException('Record not found');
      }

      // Fetch users with the matched role
      const usersResult = await this.usersService.findAllUsers({
        stages: [{ $match: { roleId: rolesResult.data[0]._id } }],
      });
      if (isMissing(usersResult.data[0])) {
        this.logger.verbose(
          JSON.stringify({
            context: 'RolesAndPermissionGuard',
            message: 'Record not found',
            resource: RolesAndPermissionGuard.name,
          }),
        );
        throw new NotFoundException('Record not found');
      }

      // Assign the user ID and tenant ID to the request
      request.user = { user_id: usersResult.data[0]._id, tenant_id: tenantId };

      scopes = apiKeyResult.data[0].scopes;
    }

    const result = await hasPermissions(scopes, request.user.user_id, request);

    if (!result) {
      this.logger.verbose(
        JSON.stringify({
          context: 'RolesAndPermissionGuard',
          message: 'Forbidden: You do not have sufficient permissions',
          resource: RolesAndPermissionGuard.name,
        }),
      );
      throw new ForbiddenException('Forbidden: You do not have sufficient permissions');
    }
    return result;
  }
}
