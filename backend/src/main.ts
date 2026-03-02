import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function createApp() {
  const { requestBodyLimit } = configuration();
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: requestBodyLimit }));
  app.use(urlencoded({ extended: true, limit: requestBodyLimit }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Playzone API')
    .setDescription('Documentação da API PlayZone')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return app;
}

async function bootstrap() {
  const { port } = configuration();
  const logger = new Logger('NestApplication');
  const app = await createApp();
  
  await app.listen(port);
  logger.log(`Backend is alive on ${await app.getUrl()}`);
}

void bootstrap();