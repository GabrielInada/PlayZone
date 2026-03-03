import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Saúde')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint raiz' })
  @ApiResponse({ status: 200, description: 'Raiz da API está acessível' })
  getRoot() {
    return this.appService.getHealthStatus();
  }

  @Get('health')
  @ApiOperation({ summary: 'Verifica status de saúde da API' })
  @ApiResponse({ status: 200, description: 'API está saudável' })
  getHealth() {
    return this.appService.getHealthStatus();
  }
}
