import { Module, NestModule, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import LoggerMiddleware from '@application/middleware';
import { YcI18nModule } from './yc-i18n/yc-i18n.module';
import UsersModule from './user.module';
import RedisModule from './redis.module';
import AuthModule from './auth.module';
import MailModule from './mail.module';
import TaskModule from './task.module';
import TokenModule from './token.module';
import TestModule from './test.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: {
          expiresIn: '60s',
        },
      }),
      inject: [ConfigService],
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
        // path: path.resolve(__dirname, '../../src/locales/'),
        path: path.join(__dirname, '../../src/locales/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang']),
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      // typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
    }),

    MailModule,
    RedisModule,
    YcI18nModule,
    UsersModule,
    TaskModule,
    AuthModule,
    TokenModule,
    TestModule,
  ],
})
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}

export default AppModule;
