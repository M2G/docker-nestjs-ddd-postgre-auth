import { Module, NestModule, MiddlewareConsumer, forwardRef } from '@nestjs/common';
// import { DatabaseModule } from '@infrastructure/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import LoggerMiddleware from '@application/middleware';
import { YcI18nModule } from './yc-i18n/yc-i18n.module';
import AppController from './app.controller';
import AppService from './app.service';
// import { UsersController } from '@application/controllers/users/users.controllers';
// import { UserService } from '@domain/services/users/user.service';
import UsersModule from './user.module';
import RedisModule from './redis.module';
import { OrdersModule } from './test/order.module';
import { PaymentModule } from './test/payment.module';
import { UserService } from '@domain/services';
import UserRepository from '@infrastructure/repository/user/user.repository';
import User from '@infrastructure/models/user';
import { LocalStrategy } from '@application/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import AuthModule from './auth.module';
//import { RedisService } from './config/redis';

@Module({
  controllers: [AppController],
  imports: [
    RedisModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
    SequelizeModule.forRoot({
      autoLoadModels: true,
      database: 'test_db',
      dialect: 'postgres',
      host: 'postgres',
      password: 'postgres',
      port: 5432,
      synchronize: true,
      username: 'postgres',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve(__dirname, '../../src/locales/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang']),
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      // typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
    YcI18nModule,
    OrdersModule,
    PaymentModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    AppService,
    // LocalStrategy,
    // UserRepository,
    // ProductRepo,
    // ProductService,
    // UserService
  ],
  exports: [],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
