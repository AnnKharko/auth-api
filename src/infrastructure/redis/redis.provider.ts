import Redis from 'ioredis';

import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from './redis.constant';

export type RedisClient = Redis;

const redisFactory = async (
  configService: ConfigService,
): Promise<RedisClient> => {
  const port = configService.get('REDIS_PORT');
  const host = configService.get('REDIS_HOST');

  return new Redis({ port, host });
};

export const redisProviders: Provider = {
  useFactory: redisFactory,
  inject: [ConfigService],
  provide: REDIS_CLIENT,
};
