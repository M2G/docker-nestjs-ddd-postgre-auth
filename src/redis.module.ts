import { Module } from '@nestjs/common';
import redisClientFactory from 'src/config';
import RedisRepository from '@infrastructure/repository/cache';
import { RedisService } from '@domain/services';

@Module({
  providers: [redisClientFactory, RedisRepository, RedisService],
  exports: [RedisService],
})
export default class RedisModule {}
