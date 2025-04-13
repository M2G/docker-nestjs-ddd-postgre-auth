import type { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisClient, REDIS_CLIENT } from './redis-client.type';

const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({
      socket: {
        host: 'redis',
        //host: 'localhost', // for local testing
        port: Number(process.env.CONTAINER_PORT_REDIS) || 6379,
      },
    });
    if (!client.isOpen) {
      await client.connect();
    }
    return client;
  },
};

export default redisClientFactory;
