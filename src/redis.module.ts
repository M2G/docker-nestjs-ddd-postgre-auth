import { Module } from '@nestjs/common';
//import { RedisRepository } from '@infrastructure/repository';
//import { RedisService } from '@domain/services';
import { redisClientFactory } from './config';
import RedisRepository from '@infrastructure/repository/cache/redis.repository';
import RedisService from '@domain/services/cache/redis.service';

@Module({
  exports: [RedisService],
  providers: [redisClientFactory, RedisRepository, RedisService],
})
export default class RedisModule {}
