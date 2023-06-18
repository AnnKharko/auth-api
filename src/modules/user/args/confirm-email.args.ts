import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, NotContains } from 'class-validator';

@ArgsType()
export class ConfirmEmailArgs {
  @Field(() => String)
  @IsNotEmpty()
  userId: string;

  @Field(() => String)
  @Length(6)
  @NotContains(' ', { message: 'Invalid code' })
  code: string;
}
