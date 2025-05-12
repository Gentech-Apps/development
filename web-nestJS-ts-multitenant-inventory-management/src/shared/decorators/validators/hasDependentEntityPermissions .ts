import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RoleDocument, RoleScopesModel } from '../../../modules/roles/schema/role.schema';
import { ENTITY_DEPENDENCY_PERMISSION } from '../../constants/dependency-permission.constant';

@ValidatorConstraint({ async: false })
export class HasDependentEntityPermissionsConstraint implements ValidatorConstraintInterface {
  validate(scopes: RoleScopesModel[]) {
    let result = true;
    for (const scope of scopes) {
      const entityPermission = ENTITY_DEPENDENCY_PERMISSION.find(
        (permission) => permission.entity === scope.entity,
      );

      if (entityPermission) {
        const scopeResult = entityPermission.dependencies.every((dependency) => {
          const dependencyEntity = dependency.entity;
          const dependencyPermission = scopes.find((scope) => scope.entity === dependencyEntity);

          if (!dependencyPermission || dependencyPermission.read.all === false) {
            return false;
          }
          return true;
        });

        if (!scopeResult) {
          result = false;
          break;
        }
      }
    }
    return result;
  }

  defaultMessage(args?: ValidationArguments): string {
    const roles = args.object as RoleDocument;
    const requiredEntities: string[] = [];
    const scopes = roles.scopes;

    scopes.forEach((scope) => {
      const entityPermission = ENTITY_DEPENDENCY_PERMISSION.find(
        (permission) => permission.entity === scope.entity,
      );

      if (entityPermission && Array.isArray(entityPermission.dependencies)) {
        entityPermission.dependencies.forEach((dependency) => {
          const dependencyEntity = dependency.entity;
          const dependencyPermission = scopes.find((scope) => scope.entity === dependencyEntity);

          if (!dependencyPermission || dependencyPermission.read.all === false) {
            if (dependency.entity) {
              if (!requiredEntities.find((e) => e === dependency.entity))
                requiredEntities.push(dependency.entity);
            }
          }
        });
      }
    });

    if (requiredEntities.length > 0) {
      const commonMessage = 'You need read`s all permission for ';

      if (requiredEntities.length === 1) {
        return commonMessage + requiredEntities + ' entity';
      }
      return commonMessage + 'following entities: ' + requiredEntities.join(', ');
    }
  }
}

export function HasDependentEntityPermissions(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'HasDependentEntityPermissions',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: HasDependentEntityPermissionsConstraint,
    });
  };
}
