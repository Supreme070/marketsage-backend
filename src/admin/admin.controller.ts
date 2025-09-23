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

  @Get('dashboard')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Request() req: any): Promise<ApiResponse> {
    try {
      const dashboardData = await this.adminService.getDashboard();
      
      return {
        success: true,
        data: dashboardData,
        message: 'Admin dashboard data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'DASHBOARD_FETCH_ERROR',
          message: err.message || 'Failed to fetch dashboard data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('users')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getUsers(@Request() req: any): Promise<ApiResponse> {
    try {
      const usersData = await this.adminService.getUsers();
      
      return {
        success: true,
        data: usersData,
        message: 'Users data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USERS_FETCH_ERROR',
          message: err.message || 'Failed to fetch users data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('organizations')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getOrganizations(@Request() req: any): Promise<ApiResponse> {
    try {
      const organizationsData = await this.adminService.getOrganizations();
      
      return {
        success: true,
        data: organizationsData,
        message: 'Organizations data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATIONS_FETCH_ERROR',
          message: err.message || 'Failed to fetch organizations data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('system')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getSystemInfo(@Request() req: any): Promise<ApiResponse> {
    try {
      const systemData = await this.adminService.getSystemInfo();
      
      return {
        success: true,
        data: systemData,
        message: 'System information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SYSTEM_INFO_FETCH_ERROR',
          message: err.message || 'Failed to fetch system information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('logs')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getLogs(@Request() req: any): Promise<ApiResponse> {
    try {
      const logsData = await this.adminService.getLogs();
      
      return {
        success: true,
        data: logsData,
        message: 'Logs retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'LOGS_FETCH_ERROR',
          message: err.message || 'Failed to fetch logs',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('maintenance')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getMaintenanceInfo(@Request() req: any): Promise<ApiResponse> {
    try {
      const maintenanceData = await this.adminService.getMaintenanceInfo();
      
      return {
        success: true,
        data: maintenanceData,
        message: 'Maintenance information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'MAINTENANCE_INFO_FETCH_ERROR',
          message: err.message || 'Failed to fetch maintenance information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('backups')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getBackups(@Request() req: any): Promise<ApiResponse> {
    try {
      const backupsData = await this.adminService.getBackups();
      
      return {
        success: true,
        data: backupsData,
        message: 'Backups information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'BACKUPS_FETCH_ERROR',
          message: err.message || 'Failed to fetch backups information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('security')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getSecurityInfo(@Request() req: any): Promise<ApiResponse> {
    try {
      const securityData = await this.adminService.getSecurityInfo();
      
      return {
        success: true,
        data: securityData,
        message: 'Security information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SECURITY_INFO_FETCH_ERROR',
          message: err.message || 'Failed to fetch security information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
