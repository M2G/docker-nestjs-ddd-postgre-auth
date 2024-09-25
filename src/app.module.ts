import { Module } from '@nestjs/common';
// import { DatabaseModule } from '@infrastructure/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import AppController from './app.controller';
import AppService from './app.service';
// import { UsersController } from '@application/controllers/users/users.controllers';
// import { UserService } from '@domain/services/users/user.service';
import UserModule from './user.module';

@Module({
  controllers: [AppController],
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'test_db',
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
  ],
  providers: [AppService],
})
export default class AppModule {}
