import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import AppController from './app.controller';
import AppService from './app.service';

@Module({
  controllers: [AppController],
  imports: [DatabaseModule],
  providers: [AppService],
})
export default class AppModule {}
