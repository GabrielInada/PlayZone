import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/modules/app/app.module';
import express, { type Request, type Response } from 'express';
import serverless from 'serverless-http';

let cachedHandler: ReturnType<typeof serverless> | null = null;

async function bootstrapServerlessHandler() {
  const expressApp = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await nestApp.init();

  return serverless(expressApp);
}

export default async function handler(req: Request, res: Response) {
  if (!cachedHandler) {
    cachedHandler = await bootstrapServerlessHandler();
  }

  return cachedHandler(req, res);
}
