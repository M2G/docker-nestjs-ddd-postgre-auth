import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    new FastifyAdapter(),

    { cors: true });
  await app.listen(8181, '0.0.0.0');
}
bootstrap();
