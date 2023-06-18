import { Field, ObjectType } from '@nestjs/graphql';
import { TokenDto } from '../token/dto/return-token.dto';
import { User } from 'src/infrastructure/database/user/schema/user.schema';

@ObjectType()
export class RegisteredUserDto {
  @Field(() => User)
  user: User;

  @Field(() => TokenDto)
  tokens: TokenDto;
}
