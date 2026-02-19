import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';

async function bootstrap() {
  const config = configuration();
  const port = Number(process.env.PORT ?? config.port ?? 3000);
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);

  // Deve vir ANTES do app.listen
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Remove campos extras do JSON recebido
    forbidNonWhitelisted: true, // Retorna erro se enviarem campos desconhecidos
    transform: true,            // Converte tipos (ex: string "1" vira number 1)
  }));
  
  await app.listen(port);
  
  logger.log(`Backend is alive on ${await app.getUrl()}`);
}

bootstrap();