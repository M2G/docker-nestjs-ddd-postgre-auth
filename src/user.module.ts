import { Module } from '@nestjs/common';
import UsersService from '@domain/services/users';
import { UsersController } from '@application/controllers/users/users.controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import User from './infrastructure/models/user.model';
//import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import UserRepository from '@infrastructure/repository/user/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    // JwtStrategy
  ],
  exports: [UsersService],
})
export default class UsersModule {}
