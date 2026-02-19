import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const { port } = configuration();
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);

  // Deve vir ANTES do app.listen
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Remove campos extras do JSON recebido
    forbidNonWhitelisted: true, // Retorna erro se enviarem campos desconhecidos
    transform: true,            // Converte tipos (ex: string "1" vira number 1)
  }));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Playzone API')
    .setDescription('Documentação da API PlayZone')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);
  logger.log(`Backend is alive on ${await app.getUrl()}`);
}

void bootstrap();