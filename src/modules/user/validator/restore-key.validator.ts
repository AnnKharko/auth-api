import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GraphQLError } from 'graphql';
import { UserModelService } from 'src/infrastructure/database/user/user-model.service';
import { errorMessage } from 'src/shared/error/error-messages';

@ValidatorConstraint({ name: 'RestoreKeyExist', async: true })
@Injectable()
export class RestoreKeyExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly userModelService: UserModelService) {}

  async validate(value: string) {
    const user = await this.userModelService.findOne({
      restoreKey: value,
    });

    if (user) {
      return true;
    } else {
      throw new GraphQLError(errorMessage.INVALID_RESTORE_KEY);
    }
  }
}
