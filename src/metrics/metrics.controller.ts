import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

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

  @Get('admin/system/stats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getAdminSystemStats(): Promise<ApiResponse> {
    try {
      const stats = await this.metricsService.getAdminSystemStats();
      return {
        success: true,
        data: stats,
        message: 'Admin system stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SYSTEM_STATS_ERROR',
          message: err.message || 'Failed to fetch system stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('admin/system/services')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getAdminSystemServices(): Promise<ApiResponse> {
    try {
      const services = await this.metricsService.getAdminSystemServices();
      return {
        success: true,
        data: services,
        message: 'Admin system services retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SYSTEM_SERVICES_ERROR',
          message: err.message || 'Failed to fetch system services',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('admin/system/infrastructure')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getAdminSystemInfrastructure(): Promise<ApiResponse> {
    try {
      const infrastructure = await this.metricsService.getAdminSystemInfrastructure();
      return {
        success: true,
        data: infrastructure,
        message: 'Admin system infrastructure retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SYSTEM_INFRASTRUCTURE_ERROR',
          message: err.message || 'Failed to fetch system infrastructure',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}