import { Field, ObjectType } from '@nestjs/graphql';
import { TokenDto } from '../token/dto/return-token.dto';

@ObjectType()
export class TokensWithRandomRecordsDto {
  @Field(() => [PostObjectDto])
  randomRecords: PostObjectDto[];

  @Field(() => TokenDto)
  tokens: TokenDto;
}

@ObjectType()
export class PostObjectDto {
  @Field(() => Number)
  userId: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  body: string;
}
