import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';

@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.VIEW_SYSTEM_LOGS)
  @HttpCode(HttpStatus.OK)
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }

  @Get('health')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.VIEW_SYSTEM_LOGS)
  @HttpCode(HttpStatus.OK)
  async getHealthMetrics() {
    return this.metricsService.getHealthMetrics();
  }
}