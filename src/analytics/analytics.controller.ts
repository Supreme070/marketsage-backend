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
  Logger,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('query')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async queryAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.analyticsService.queryAnalytics(req.user.id);
      return {
        success: true,
        data: analytics,
        message: 'Analytics query executed successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Analytics query error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'ANALYTICS_QUERY_FAILED',
          message: 'Failed to execute analytics query',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('query')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async executeQuery(
    @Body() queryData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.analyticsService.executeQuery(queryData, req.user.id);
      return {
        success: true,
        data: result,
        message: 'Analytics query executed successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Analytics query execution error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'ANALYTICS_QUERY_EXECUTION_FAILED',
          message: 'Failed to execute analytics query',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('predictive')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPredictiveAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const predictive = await this.analyticsService.getPredictiveAnalytics(req.user.id);
      return {
        success: true,
        data: predictive,
        message: 'Predictive analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Predictive analytics error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'PREDICTIVE_ANALYTICS_FAILED',
          message: 'Failed to retrieve predictive analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('predictive')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async generatePredictiveAnalytics(
    @Body() data: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.analyticsService.generatePredictiveAnalytics(data, req.user.id);
      return {
        success: true,
        data: result,
        message: 'Predictive analytics generated successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Predictive analytics generation error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'PREDICTIVE_ANALYTICS_GENERATION_FAILED',
          message: 'Failed to generate predictive analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('organization')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getOrganizationAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.analyticsService.getOrganizationAnalytics(req.user.organizationId);
      return {
        success: true,
        data: analytics,
        message: 'Organization analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Organization analytics error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'ORGANIZATION_ANALYTICS_FAILED',
          message: 'Failed to retrieve organization analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('campaigns')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getCampaignAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.analyticsService.getCampaignAnalytics(req.user.id);
      return {
        success: true,
        data: analytics,
        message: 'Campaign analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Campaign analytics error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'CAMPAIGN_ANALYTICS_FAILED',
          message: 'Failed to retrieve campaign analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('users')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getUserAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.analyticsService.getUserAnalytics(req.user.organizationId);
      return {
        success: true,
        data: analytics,
        message: 'User analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`User analytics error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'USER_ANALYTICS_FAILED',
          message: 'Failed to retrieve user analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('revenue')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getRevenueAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.analyticsService.getRevenueAnalytics(req.user.organizationId);
      return {
        success: true,
        data: analytics,
        message: 'Revenue analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Revenue analytics error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'REVENUE_ANALYTICS_FAILED',
          message: 'Failed to retrieve revenue analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('performance')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPerformanceAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.analyticsService.getPerformanceAnalytics(req.user.organizationId);
      return {
        success: true,
        data: analytics,
        message: 'Performance analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Performance analytics error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'PERFORMANCE_ANALYTICS_FAILED',
          message: 'Failed to retrieve performance analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('engagement')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getEngagementAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.analyticsService.getEngagementAnalytics(req.user.organizationId);
      return {
        success: true,
        data: analytics,
        message: 'Engagement analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Engagement analytics error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'ENGAGEMENT_ANALYTICS_FAILED',
          message: 'Failed to retrieve engagement analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}