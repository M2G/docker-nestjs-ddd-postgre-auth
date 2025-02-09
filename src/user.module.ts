import { Module } from '@nestjs/common';
import UsersService from '@domain/services/users';
import { UserControllers } from '@application/controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisRepository, UsersRepository, MailRepository } from '@infrastructure/repository';
import User from '@infrastructure/models/user/user.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RedisService, MailService } from '@domain/services';
import { ConfigModule } from '@nestjs/config';
import { redisClientFactory } from './config';

@Module({
  controllers: [UserControllers],
  exports: [
    UsersService,
    // UsersRepository,
    RedisService,
    // RedisRepository,

    // MailRepository,
    MailService,
  ],
  imports: [SequelizeModule.forFeature([User])],
  providers: [
    RedisService,
    RedisRepository,
    redisClientFactory,

    UsersService,
    UsersRepository,

    JwtService,

    MailRepository,
    MailService,
  ],
})
export default class UsersModule {}
