import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAnalytics(@Request() req: any): Promise<ApiResponse> {
    try {
      const analyticsData = await this.adminService.getAnalytics();
      
      return {
        success: true,
        data: analyticsData,
        message: 'Admin analytics data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ADMIN_ANALYTICS_FETCH_ERROR',
          message: err.message || 'Failed to fetch admin analytics data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('analytics/users')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getUsersAnalytics(@Request() req: any): Promise<ApiResponse> {
    try {
      const usersData = await this.adminService.getUsersAnalytics();
      
      return {
        success: true,
        data: usersData,
        message: 'Users analytics data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USERS_ANALYTICS_FETCH_ERROR',
          message: err.message || 'Failed to fetch users analytics data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('analytics/revenue')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getRevenueAnalytics(@Request() req: any): Promise<ApiResponse> {
    try {
      const revenueData = await this.adminService.getRevenueAnalytics();
      
      return {
        success: true,
        data: revenueData,
        message: 'Revenue analytics data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'REVENUE_ANALYTICS_FETCH_ERROR',
          message: err.message || 'Failed to fetch revenue analytics data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('analytics/platform')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPlatformMetrics(@Request() req: any): Promise<ApiResponse> {
    try {
      const platformData = await this.adminService.getPlatformMetrics();
      
      return {
        success: true,
        data: platformData,
        message: 'Platform metrics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'PLATFORM_METRICS_FETCH_ERROR',
          message: err.message || 'Failed to fetch platform metrics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
