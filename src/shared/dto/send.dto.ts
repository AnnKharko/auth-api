import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendDto {
  @Field(() => Number)
  status: number;

  @Field(() => String)
  message: string;
}
