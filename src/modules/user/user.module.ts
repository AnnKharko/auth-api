import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { DatabaseModule } from 'src/infrastructure/database/data-base.module';
import { RestoreKeyExistValidator } from './validator/restore-key.validator';

@Module({
  imports: [DatabaseModule],
  providers: [UserResolver, UserService, RestoreKeyExistValidator],
  exports: [UserService],
})
export class UserModule {}
