import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/schema/user.schema';
import { UserModelService } from './user/user-model.service';
import { Token, TokenSchema } from './token/schema/token.schema';
import { TokenModelService } from './token/token-model.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  providers: [UserModelService, TokenModelService],
  exports: [UserModelService, TokenModelService],
})
export class DatabaseModule {}
