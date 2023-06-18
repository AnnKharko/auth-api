import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { User } from '../../user/schema/user.schema';

export type TokenDocument = HydratedDocument<Token>;

@ObjectType()
@Schema({ timestamps: true })
export class Token {
  @Field(() => ID, { nullable: true })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop()
  accessToken: string;

  @Field(() => String)
  @Prop({ unique: true })
  refreshToken: string;

  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Date)
  @Prop()
  updatedAt?: Date;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
