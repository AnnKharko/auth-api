import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  NotContains,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @NotContains(' ', { message: 'Password should not contain whitespace' })
  @Field(() => String)
  password: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  phone?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  age?: number;
}
