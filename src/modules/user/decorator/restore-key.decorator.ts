import { ValidationOptions, registerDecorator } from 'class-validator';
import { RestoreKeyExistValidator } from '../validator/restore-key.validator';
import { ConfirmRestorePassArgs } from '../args/restore-password.args';

export function IsRestoreKey(validationOptions?: ValidationOptions) {
  return function (object: ConfirmRestorePassArgs, propertyName: string) {
    registerDecorator({
      name: 'RestoreKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      async: true,
      validator: RestoreKeyExistValidator,
    });
  };
}
