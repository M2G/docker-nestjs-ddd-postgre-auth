import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import AppController from './app.controller';
import AppService from './app.service';
import { UsersController } from '@application/controllers/users/users.controllers';
import { UserService } from '@domain/services/users/user.service';

@Module({
  controllers: [AppController, UsersController],
  imports: [DatabaseModule],
  providers: [AppService, UserService],
})
export default class AppModule {}
