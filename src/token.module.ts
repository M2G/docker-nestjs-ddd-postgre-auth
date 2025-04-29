import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenRepository } from '@infrastructure/repository';
import { TokenService } from '@domain/services';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Token } from '@infrastructure/models';

@Module({
  exports: [TokenService],
  imports: [SequelizeModule.forFeature([User]), SequelizeModule.forFeature([Token]), JwtModule],
  providers: [TokenRepository, TokenService],
})
export default class TokenModule {}
