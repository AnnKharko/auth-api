import { Redis } from 'ioredis';

import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constant';
import { PostObjectDto } from 'src/modules/auth/dto/token-with-random-records.dto';
import { getRandomElements } from 'src/shared/util/get-random-elements.util';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}
  async setPosts(posts: [any], id: number) {
    const redisKey = `user:${id}`;
    await this.redisClient.unlink([redisKey]);

    const fieldValues = posts.reduce((acc, post) => {
      const postId = post.id.toString();
      delete post.id;
      acc.push(postId, JSON.stringify(post));
      return acc;
    }, []);

    await this.redisClient.hmset(redisKey, fieldValues, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Posts saved for userId:${id}`);
      }
    });
  }

  async getRandomRecords(count: number): Promise<PostObjectDto[]> {
    const keys: string[] = await this.redisClient.keys('user:*');

    const randomKeys: string[] = getRandomElements(keys, count);

    const pipeline = this.redisClient.pipeline();

    randomKeys.forEach((key) => {
      pipeline.hgetall(key);
    });

    const records = await pipeline.exec();

    const randomRecords = records
      .map((result) => result[1])
      .filter((value) => value !== undefined) as PostObjectDto[];

    return Object.values(randomRecords);
  }
}
