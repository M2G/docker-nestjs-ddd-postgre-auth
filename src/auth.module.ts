import { Module } from '@nestjs/common';
import UsersService from '@domain/services/users';
import { AuthControllers } from '@application/controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthRepository, RedisRepository, UsersRepository } from '@infrastructure/repository';
import User from '@infrastructure/models/user/user.model';
import { LocalStrategy } from '@application/auth/strategies/local.strategy';
import { JwtStrategy } from '@application/auth/strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService, RedisService } from '@domain/services';
import redisConfig from 'src/config';
import { ConfigModule } from '@nestjs/config';
import redisClientFactory from './config';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthControllers],
  exports: [AuthService, AuthRepository, RedisService, RedisRepository],
  imports: [SequelizeModule.forFeature([User])],
  providers: [
    LocalStrategy,
    AuthService,
    RedisService,
    RedisRepository,
    AuthRepository,
    // JwtStrategy,
    //UsersRepository,
    JwtService,
    redisClientFactory,
  ],
})
export default class AuthModule {}
