import { Module } from '@nestjs/common';
import { TokenRepository } from '@infrastructure/repository';
import { TokenService } from '@domain/services';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Token } from '@infrastructure/models';

@Module({
  exports: [TokenService],
  imports: [SequelizeModule.forFeature([User]), SequelizeModule.forFeature([Token])],
  providers: [TokenRepository, TokenService],
})
export default class TokenModule {}
