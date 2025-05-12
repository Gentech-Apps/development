import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false })
export class IsArrayOfStringsConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    // More complex validation logic, e.g., DNS lookup, MX record check
    return (
      Array.isArray(value) &&
      value.every(
        (item) => typeof item === 'string' && item.trim() !== '' && Types.ObjectId.isValid(item),
      ) &&
      checkDedupe(value)
    );
  }
}

const checkDedupe = (value: string[]): boolean => {
  const setOfIds = new Set(value.map((item) => item));
  return setOfIds.size === value.length;
};

export function IsArrayOfStrings(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsArrayOfStrings',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsArrayOfStringsConstraint,
    });
  };
}
