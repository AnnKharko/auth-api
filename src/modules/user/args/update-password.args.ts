import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength, NotContains } from 'class-validator';

@ArgsType()
export class UpdatePasswordArgs {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(5)
  currentPassword: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(5)
  @NotContains(' ', { message: 'Password should not contain whitespace' })
  newPassword: string;
}
