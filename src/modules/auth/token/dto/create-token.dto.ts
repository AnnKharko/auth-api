import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateTokenDto {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  user: string;
}
