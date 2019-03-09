import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator';

export function ValidateIfNotEmpty(
  type: string,
  validationOptions?: ValidationOptions
) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'validateIfNotEmpty',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'undefined') {
            return true;
          }
          if (Object.prototype.toString.call(value).slice(8, -1) === type) {
            return true;
          }
          return false;
        },
        defaultMessage (args: ValidationArguments) {
          return `${propertyName} must be ${type} or undefined`;
        }
      }
    });
  };
}
