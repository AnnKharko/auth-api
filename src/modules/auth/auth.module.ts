import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TokenModule } from './token/token.module';
import { UserModule } from 'src/modules/user/user.module';
import { DatabaseModule } from 'src/infrastructure/database/data-base.module';
import { redisProviders } from 'src/infrastructure/redis/redis.provider';
import { RedisModule } from 'src/infrastructure/redis/redis.module';

@Module({
  imports: [TokenModule, UserModule, DatabaseModule, RedisModule],
  providers: [AuthResolver, AuthService, redisProviders],
})
export class AuthModule {}
