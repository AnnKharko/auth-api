import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { DatabaseModule } from 'src/infrastructure/database/data-base.module';
import { JwtModule } from 'src/infrastructure/jwt/jwt.module';

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [TokenModule, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
