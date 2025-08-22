import { Module } from '@nestjs/common';
import { RedisRepository } from '@infrastructure/repository';
import { RedisService } from '@domain/services';
import { redisClientFactory } from './config';

@Module({
  exports: [RedisService],
  providers: [redisClientFactory, RedisRepository, RedisService],
})
export default class RedisModule {}
