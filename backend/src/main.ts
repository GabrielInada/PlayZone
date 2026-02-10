import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';
import configuration from './config/configuration';

const logger = new Logger('NestApplication');

async function bootstrap() {
  const config = configuration();
  const { port } = config;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log('Backend is alive on ', await app.getUrl());
}

void bootstrap();
