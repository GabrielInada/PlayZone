global['crypto'] = require('crypto'); // Necessário para Node 18+ TypeORM

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';

async function bootstrap() {
  // 1. Carrega configurações
  const config = configuration();
  const port = config.port || 3000; // Usa a porta da config ou 3000 como padrão
  const logger = new Logger('NestApplication');

  // 2. Cria a aplicação
  const app = await NestFactory.create(AppModule);

  // 3. CONFIGURAÇÃO IMPORTANTE: Pipes globais (DTOs)
  // Deve vir ANTES do app.listen
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Remove campos extras do JSON recebido
    forbidNonWhitelisted: true, // Retorna erro se enviarem campos desconhecidos
    transform: true,            // Converte tipos (ex: string "1" vira number 1)
  }));

  // 4. Inicia o servidor (APENAS UMA VEZ)
  await app.listen(port);
  
  logger.log(`Backend is alive on ${await app.getUrl()}`);
}

bootstrap();