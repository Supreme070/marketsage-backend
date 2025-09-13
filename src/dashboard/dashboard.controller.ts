import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  async getDashboardData(@Request() req: any): Promise<ApiResponse> {
    try {
      const dashboardData = await this.dashboardService.getDashboardData(req.user.id);
      
      return {
        success: true,
        data: dashboardData,
        message: 'Dashboard data retrieved successfully',
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

  @Get('decision-support')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  async getDecisionSupportData(@Request() req: any): Promise<ApiResponse> {
    try {
      const decisionData = await this.dashboardService.getDecisionSupportData(req.user.id);
      
      return {
        success: true,
        data: decisionData,
        message: 'Decision support data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'DECISION_SUPPORT_FETCH_ERROR',
          message: err.message || 'Failed to fetch decision support data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
