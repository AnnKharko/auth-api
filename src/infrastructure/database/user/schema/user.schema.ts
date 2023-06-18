import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../../../../modules/user/enum/user-role.enum';
import { Transform } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID, { nullable: true })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Field(() => String, { nullable: true })
  @Prop()
  phone?: string;

  @Field(() => Number, { nullable: true })
  @Prop()
  age?: number;

  @Field(() => UserRole)
  @Prop({ default: UserRole.USER })
  role: UserRole;

  @Field(() => Date) // { defaultValue: Date.now() }
  @Prop()
  createdAt: Date;

  @Field(() => Date)
  @Prop()
  updatedAt?: Date;

  @Field(() => Boolean)
  @Prop({ default: false })
  confirmedEmail?: boolean;

  @Field(() => String, { nullable: true })
  @Prop()
  restoreKey: string;

  @Field(() => String, { nullable: true })
  @Prop()
  confirmEmailCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
