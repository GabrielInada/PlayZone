global['crypto'] = require('crypto');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';
import configuration from './config/configuration';
import { ValidationPipe } from '@nestjs/common'; //

const logger = new Logger('NestApplication');

async function bootstrap() {
  const config = configuration();
  const { port } = config;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log('Backend is alive on ', await app.getUrl());

app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO (segurança)
    forbidNonWhitelisted: true, // Dá erro se enviarem campos extras
    transform: true, // Converte tipos automaticamente (ex: string "1" vira number 1)
  }));

  await app.listen(3000);

}

void bootstrap();
