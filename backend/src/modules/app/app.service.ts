import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealthStatus() {
    return { status: 'ok', message: 'Backend is alive!' };
  }
}
