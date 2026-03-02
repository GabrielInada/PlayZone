import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import configuration from 'src/config/configuration';

@Injectable()
export class SelfConsultService {
  private readonly logger = new Logger(SelfConsultService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async keepAlivePing() {
    try {
      const config = configuration();

      const url = config.backendUrl;
      const res = await fetch(url); // O endpoint raiz (/) retorna 200 se o backend estiver vivo
      this.logger.log(`Keep-alive ping sent to ${url} - status: ${res.status}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn('Keep-alive ping failed: ' + message);
    }
  }
}
