import { Request } from 'express';
import { RoleScopesModel } from '../../modules/roles/schema/role.schema';
import { HttpMethods } from '../enums/http-methods.enum';
import { getMatchingEntity } from './get-matching-entity';
import { ScopesModel } from '../models/scopes.model';

export async function hasPermissions(
  scopes: ScopesModel[],
  userId: string,
  request: Request,
): Promise<boolean> {
  const { method, route, params } = request;
  const entity = getMatchingEntity(route.path);
  const paramId = params.id;

  const scope = scopes.find((scope) => scope.entity === entity);

  if (!scope) return false;

  const isSelf = userId === paramId;

  let hasPermission = false;

  switch (method) {
    case HttpMethods.GET:
      hasPermission = hasEntityPermission(scope, isSelf);
      break;

    case HttpMethods.POST:
    case HttpMethods.PUT:
    case HttpMethods.PATCH:
    case HttpMethods.DELETE:
      if (isSelf) {
        hasPermission = scope.read.self && scope.write?.self;
      } else {
        hasPermission = scope.write?.all;
      }
      break;

    default:
      hasPermission = false;
      break;
  }

  return hasPermission;
}

function hasEntityPermission(permission: RoleScopesModel, isSelf: boolean): boolean {
  return isSelf ? permission.read.self : permission.read.all;
}
