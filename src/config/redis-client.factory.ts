/*eslint-disable*/

/*import { registerAs } from '@nestjs/config';

export const REDIS_CONFIG_KEY = 'redis';

export default registerAs(REDIS_CONFIG_KEY, () => {
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);
  let tls;
  if (port === 6380) {
    tls = {};
  }
  return {
    // host: process.env.REDIS_HOST || 'localhost',
    //port,
    //username: process.env.REDIS_USERNAME || '',
    //password: process.env.REDIS_PASSWORD || '',
    //db: parseInt(process.env.REDIS_DB || '0', 10),
    host: 'redis',
    port: Number(process.env.CONTAINER_PORT_REDIS),
    tls,
  };
});
*/

import type { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisClient, REDIS_CLIENT } from './redis-client.type';

const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({
      socket: {
        host: 'redis',
        port: Number(process.env.CONTAINER_PORT_REDIS),
      },
    });
    if (!client.isOpen) {
      await client.connect();
    }
    return client;
  },
};

export default redisClientFactory;
