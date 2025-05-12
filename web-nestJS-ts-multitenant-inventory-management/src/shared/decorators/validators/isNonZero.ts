import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNonZeroConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'number' && value !== 0;
  }

  defaultMessage() {
    return 'skip must be a non-zero number';
  }
}

export function IsNonZero(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNonZeroConstraint,
    });
  };
}
