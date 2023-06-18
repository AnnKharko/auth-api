import { Module } from '@nestjs/common';
import { redisProviders } from './redis.provider';
import { RedisService } from './redis.service';
import { RedisInitializer } from './redis-initializer';

@Module({
  providers: [redisProviders, RedisService, RedisInitializer],
  exports: [redisProviders, RedisService],
})
export class RedisModule {}
