import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async getHealthMetrics() {
    return this.metricsService.getHealthMetrics();
  }
}