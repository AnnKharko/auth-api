import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, NotContains } from 'class-validator';

@ArgsType()
export class LoginArgs {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @NotContains(' ', { message: 'Password should not contain whitespace' })
  @Field(() => String)
  password: string;
}
