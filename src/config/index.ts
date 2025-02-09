import redisClientFactory from './redis-client.factory';
import type { RedisClient } from './redis-client.type';
import { REDIS_CLIENT } from './redis-client.type';

export type { RedisClient };
export { redisClientFactory, REDIS_CLIENT };
