import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/data-base.module';
import { CoreModule } from './modules/core/core.module';
import { JwtModule } from './infrastructure/jwt/jwt.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { MailModule } from './modules/mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CoreModule,
    UserModule,
    AuthModule,
    DatabaseModule,
    JwtModule,
    MailModule,
    EventEmitterModule.forRoot(),
    RedisModule,
  ],
})
export class AppModule {}
