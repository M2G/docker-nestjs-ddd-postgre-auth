import { Module } from '@nestjs/common';
//import { RedisRepository } from '@infrastructure/repository';
import { //RedisService,

  TaskService } from '@domain/services';
import { SequelizeModule } from '@nestjs/sequelize';
import User from './infrastructure/models/user';
import { redisClientFactory } from './config';
import RedisRepository from './infrastructure/repository/cache/redis.repository';
import RedisService from './domain/services/cache/redis.service';

@Module({
  exports: [RedisService, TaskService],
  imports: [SequelizeModule.forFeature([User])],
  providers: [RedisService, RedisRepository, redisClientFactory, TaskService],
})
export default class TaskModule {}
