import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength, NotContains } from 'class-validator';
import { IsRestoreKey } from '../decorator/restore-key.decorator';

@ArgsType()
export class ConfirmRestorePassArgs {
  @Field(() => String)
  @IsRestoreKey()
  restoreKey: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(5)
  @NotContains(' ', { message: 'Password should not contain whitespace' })
  newPassword: string;
}
