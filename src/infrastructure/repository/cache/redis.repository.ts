import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClient, REDIS_CLIENT } from 'src/config/redis-client.type';
import { UserEntity as User } from '@domain/entities';

interface ICacheRepository {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  delete: (key: string) => Promise<void>;
  setWithExpiry: (key: string, value: string, expiry: number) => Promise<void>;
}

@Injectable()
export default class RedisRepository implements OnModuleDestroy, ICacheRepository {
  public constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  /**
   * Close redis connection on shutdown
   */
  onModuleDestroy() {
    void this.redis.disconnect();
  }

  get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string): Promise<string | any> {
    await this.redis.set(key, value);
  }

  delete(key: string): any {
    return this.redis.del(key);
  }

  setWithExpiry(key: string, value: string, expiry: number): any {
    return this.redis.set(key, value, { EX: expiry });
  }
}
