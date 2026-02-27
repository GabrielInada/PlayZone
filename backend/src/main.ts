import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverless from 'serverless-http';

let cachedHandler: ((req: any, res: any) => Promise<any>) | null = null;

async function createApp() {
  const app = await NestFactory.create(AppModule);

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

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    const app = await createApp();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    cachedHandler = serverless(expressApp) as (req: any, res: any) => Promise<any>;
  }

  return cachedHandler(req, res);
}

if (!process.env.VERCEL) {
  void bootstrap();
}