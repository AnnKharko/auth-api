import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenDto {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
