import { Field, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { UserRole } from 'src/modules/user/enum/user-role.enum';

@ObjectType()
export class CurrentUserDto {
  @Field(() => String)
  id: Types.ObjectId;

  @Field(() => String)
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => String)
  password: string;

  @Field(() => String)
  tokenId: string;
}
