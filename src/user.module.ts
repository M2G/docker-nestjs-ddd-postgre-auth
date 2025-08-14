import { Module } from '@nestjs/common';
import { UserControllers } from '@application/controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import { // RedisRepository,
  UsersRepository,
 // MailRepository
} from '@infrastructure/repository';
import User from '@infrastructure/models/user/user.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  //RedisService, MailService,
  UserService } from '@domain/services';
import { ConfigModule } from '@nestjs/config';
import RedisService from '@domain/services/cache/redis.service';
import MailService from '@domain/services/mail/mail.service';
import MailRepository from '@infrastructure/repository/mail/mail.repository';
import RedisRepository from '@infrastructure/repository/cache/redis.repository';
import { redisClientFactory } from './config';

@Module({
  controllers: [UserControllers],
  exports: [UserService, RedisService, MailService,
   // YcI18nService
  ],
  imports: [SequelizeModule.forFeature([User])],
  providers: [
    // YcI18nService,
    RedisService,
    RedisRepository,
    redisClientFactory,

    UserService,
    UsersRepository,

    JwtService,

    MailRepository,
    MailService,
  ],
})
export default class UsersModule {}
