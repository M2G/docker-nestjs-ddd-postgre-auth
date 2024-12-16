import { Module } from '@nestjs/common';
import UsersService from '@domain/services/users';
import { UserControllers } from '@application/controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisRepository, UsersRepository } from '@infrastructure/repository';
import User from '@infrastructure/models/user/user.model';
import { LocalStrategy } from '@application/auth/strategies/local.strategy';
import { JwtStrategy } from '@application/auth/strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RedisService } from '@domain/services';
import redisConfig from 'src/config';
import { ConfigModule } from '@nestjs/config';
import redisClientFactory from './config';

@Module({
  controllers: [UserControllers],
  exports: [UsersService, UsersRepository, RedisService, RedisRepository],
  imports: [
    SequelizeModule.forFeature([User]),
    /*JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),*/
  ],
  providers: [
    UsersService,
    UsersRepository,
    RedisService,
    RedisRepository,
    // JwtStrategy,
    //UsersRepository,
    JwtService,
    //LocalStrategy,
    redisClientFactory,
  ],
})
export default class UsersModule {}
