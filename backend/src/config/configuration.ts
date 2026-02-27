import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from '../modules/app/app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'API root is reachable' })
  getRoot() {
    return this.appService.getHealthStatus();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  getHealth() {
    return this.appService.getHealthStatus();
  }
}

const backendPort = parseInt(process.env.BACKEND_PORT ?? '3000', 10);

export default () => ({
  port: backendPort,
  dbPort: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  dbUrl: process.env.DATABASE_URL,
  backendUrl: process.env.BACKEND_URL || `http://localhost:${backendPort}`,
  jwtSecret: process.env.JWT_SECRET,
});