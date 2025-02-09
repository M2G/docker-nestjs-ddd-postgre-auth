import { Module } from '@nestjs/common';
import { RedisRepository } from '@infrastructure/repository';
import { RedisService, TaskService } from '@domain/services';
import { SequelizeModule } from '@nestjs/sequelize';
import User from './infrastructure/models/user';
import { redisClientFactory } from './config';

@Module({
  exports: [RedisService, TaskService],
  imports: [SequelizeModule.forFeature([User])],
  providers: [RedisService, RedisRepository, redisClientFactory, TaskService],
})
export default class TaskModule {}
