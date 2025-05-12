import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { RoleScopePermissionsModel } from '../../../modules/roles/schema/role.schema';
import { isMissingOrEmpty } from '../../utils/typecheck';

@ValidatorConstraint({ async: false })
class ReadWritePermissionsValidator implements ValidatorConstraintInterface {
  validate(scope: { read: RoleScopePermissionsModel; write?: RoleScopePermissionsModel }) {
    if (isMissingOrEmpty(scope)) return false;
    const { read, write } = scope[0];

    if (write && (!read || read.self !== true)) {
      return false;
    }

    if (write?.all === true && read?.all !== true) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const { read, write } = args.object as {
      read: RoleScopePermissionsModel;
      write?: RoleScopePermissionsModel;
    };

    if (write && (!read || read.self !== true)) {
      return 'Write access requires self-read permission';
    }

    if (write?.all === true && read?.all !== true) {
      return 'Global write access requires global read access';
    }

    return 'Invalid permissions configuration';
  }
}

export function ReadWritePermissions(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ReadWritePermissionsValidator,
    });
  };
}
