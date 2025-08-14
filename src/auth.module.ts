import { Module } from '@nestjs/common';
import { AuthControllers } from '@application/controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthRepository,
  // RedisRepository
} from '@infrastructure/repository';
import User from '@infrastructure/models/user/user.model';
import { LocalStrategy, JwtStrategy } from '@application/auth/strategies';
import { JwtService } from '@nestjs/jwt';
import {
  AuthService,
  // RedisService
} from '@domain/services';
import RedisService from '@domain/services/cache/redis.service';
import RedisRepository from '@infrastructure/repository/cache/redis.repository';
import { redisClientFactory } from './config';

@Module({
  controllers: [AuthControllers],
  exports: [AuthService, RedisService],
  imports: [SequelizeModule.forFeature([User])],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    RedisService,
    RedisRepository,
    AuthRepository,
    JwtService,
    redisClientFactory,
  ],
})
export default class AuthModule {}
