import { Module } from '@nestjs/common';

import RedisService from '../../domain/cache/cache.service';
import { redisClientFactory } from './cache.client.factory';
import { RedisRepository } from './repository/redis.repository';

@Module({
  controllers: [],
  exports: [RedisService],
  imports: [],
  providers: [redisClientFactory, RedisRepository, RedisService],
})
export class RedisModule {}
