import { Injectable, OnModuleInit } from '@nestjs/common';
import { fetchData } from 'src/shared/util/axios.util';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { getArrayOfNumbers } from 'src/shared/util/get-array-of-numbers.util';

@Injectable()
export class RedisInitializer implements OnModuleInit {
  private initialized = false;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (!this.initialized) {
      await this.initializeRedis();
      this.initialized = true;
    }
  }

  async initializeRedis() {
    await this.fetchRecordsFromExternalAPI();
  }

  async fetchRecordsFromExternalAPI(): Promise<void> {
    const baseUrl = this.configService.get('FETCH_DATA_URL');

    await this.help(baseUrl);
  }

  async help(baseUrl: string) {
    try {
      const ids = getArrayOfNumbers(5);
      const promises = ids.map(async (id: number) => {
        try {
          const response = await fetchData(`${baseUrl}/${id}/posts`);
          return response;
        } catch (error) {
          return null;
        }
      });

      const responses = await Promise.allSettled(promises);

      const records = responses.map((response) => {
        if (response.status === 'fulfilled') {
          return response.value;
        } else {
          return null;
        }
      });

      await Promise.all(
        ids.map(async (id) => {
          if (records[id]) {
            await this.redisService.setPosts(records[id], id);
          }
        }),
      );
    } catch (error) {
      console.error('Error generating records:', error);
    }
  }
}
