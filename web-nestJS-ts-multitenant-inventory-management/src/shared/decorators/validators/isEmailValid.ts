import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isMissingOrEmpty, isString } from '../../utils/typecheck';

@ValidatorConstraint({ async: false })
export class IsEmailValidConstraint implements ValidatorConstraintInterface {
  validate(email: any) {
    // More complex validation logic, e.g., DNS lookup, MX record check
    return !isMissingOrEmpty(email) && isString(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  defaultMessage() {
    return 'Email must be valid';
  }
}

export function IsEmailValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsEmailValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailValidConstraint,
    });
  };
}
