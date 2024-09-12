import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { User } from './infrastructure/models/user.model';
import { Token } from './infrastructure/models/token.model';

@Module({
  controllers: [AppController],
  imports: [DatabaseModule, SequelizeModule.forFeature([User, Token])],
  providers: [AppService],
})
export class AppModule {}
