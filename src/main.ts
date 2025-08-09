import { NestFactory } from '@nestjs/core';
import type {
  NestFastifyApplication} from '@nestjs/platform-fastify';
import {
  FastifyAdapter
} from '@nestjs/platform-fastify';
import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import type { FastifyCorsOptions } from '@fastify/cors';
import AppModule from './app.module';


const CorsOptions: FastifyCorsOptions = {
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
  maxAge: 86400,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  origin: [
    // ? Development environment
    "http://localhost:3002",
    // * Add Production and Staging URLs here
  ],
};

async function bootstrap(): Promise<void> {
  const FastifyModule = new FastifyAdapter({ logger: true });

  FastifyModule.enableCors(CorsOptions);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, FastifyModule);
  await app.listen(8181, '0.0.0.0');
}
bootstrap();
