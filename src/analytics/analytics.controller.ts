import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Headers,
} from '@nestjs/common';
import { AnalyticsService, AnalyticsQuery } from './analytics.service';
import { ReportingService, ReportConfig } from './reporting.service';
import { PerformanceAnalyticsService } from './performance-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';
import { IsString, IsOptional, IsArray, IsObject, IsDateString, IsEnum } from 'class-validator';

// DTOs for Analytics
export class AnalyticsQueryDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsEnum(['hour', 'day', 'week', 'month', 'quarter', 'year'])
  granularity!: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

  @IsArray()
  @IsString({ each: true })
  metrics!: string[];

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groupBy?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  orderBy?: Array<{ field: string; direction: 'asc' | 'desc' }>;
}

export class ReportConfigDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsEnum(['campaign', 'user', 'organization', 'financial', 'performance', 'custom'])
  type!: 'campaign' | 'user' | 'organization' | 'financial' | 'performance' | 'custom';

  @IsEnum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'manual'])
  schedule!: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'manual';

  @IsEnum(['pdf', 'excel', 'csv', 'json'])
  format!: 'pdf' | 'excel' | 'csv' | 'json';

  @IsArray()
  @IsString({ each: true })
  recipients!: string[];

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @IsArray()
  @IsString({ each: true })
  metrics!: string[];
}

export class GenerateReportDto {
  @IsOptional()
  @IsEnum(['pdf', 'excel', 'csv', 'json'])
  format?: 'pdf' | 'excel' | 'csv' | 'json';

  @IsOptional()
  @IsObject()
  dateRange?: { startDate: string; endDate: string };

  @IsOptional()
  @IsObject()
  customFilters?: Record<string, any>;
}

export class PredictiveAnalyticsDto {
  @IsEnum(['revenue', 'growth', 'churn', 'performance'])
  predictionType!: 'revenue' | 'growth' | 'churn' | 'performance';

  @IsEnum(['week', 'month', 'quarter', 'year'])
  timeHorizon!: 'week' | 'month' | 'quarter' | 'year';
}

@Controller('analytics')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly reportingService: ReportingService,
    private readonly performanceAnalyticsService: PerformanceAnalyticsService,
  ) {}

  // ========================================
  // ANALYTICS ENDPOINTS
  // ========================================

  @Post('query')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async executeAnalyticsQuery(
    @Request() req: any,
    @Body() queryDto: AnalyticsQueryDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const query: AnalyticsQuery = {
        ...queryDto,
        startDate: new Date(queryDto.startDate),
        endDate: new Date(queryDto.endDate),
        organizationId: queryDto.organizationId || req.user.organizationId,
        userId: queryDto.userId || req.user.id,
      };

      const result = await this.analyticsService.executeAnalyticsQuery(query);

      return {
        success: true,
        data: result,
        message: 'Analytics query executed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ANALYTICS_QUERY_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to execute analytics query',
      };
    }
  }

  @Get('campaign/:campaignId')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getCampaignAnalytics(
    @Request() req: any,
    @Param('campaignId') campaignId: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.analyticsService.getCampaignAnalytics(
        campaignId,
        req.user.organizationId,
        req.user.id,
      );

      return {
        success: true,
        data: result,
        message: 'Campaign analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'CAMPAIGN_ANALYTICS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve campaign analytics',
      };
    }
  }

  @Get('user/:userId')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getUserAnalytics(
    @Request() req: any,
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.analyticsService.getUserAnalytics(
        userId,
        req.user.organizationId,
      );

      return {
        success: true,
        data: result,
        message: 'User analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'USER_ANALYTICS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve user analytics',
      };
    }
  }

  @Get('organization')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async getOrganizationAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.analyticsService.getOrganizationAnalytics(
        req.user.organizationId,
      );

      return {
        success: true,
        data: result,
        message: 'Organization analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ORGANIZATION_ANALYTICS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve organization analytics',
      };
    }
  }

  @Get('realtime')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(60, 60 * 1000) // 60 requests per minute
  @HttpCode(HttpStatus.OK)
  async getRealTimeAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.analyticsService.getRealTimeAnalytics(
        req.user.organizationId,
        req.user.id,
      );

      return {
        success: true,
        data: result,
        message: 'Real-time analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REALTIME_ANALYTICS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve real-time analytics',
      };
    }
  }

  @Post('predictive')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  async generatePredictiveAnalytics(
    @Request() req: any,
    @Body() predictiveDto: PredictiveAnalyticsDto,
  ): Promise<ApiResponse> {
    try {
      const result = await this.analyticsService.generatePredictiveAnalytics(
        req.user.organizationId,
        req.user.id,
        predictiveDto.predictionType,
        predictiveDto.timeHorizon,
      );

      return {
        success: true,
        data: result,
        message: 'Predictive analytics generated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PREDICTIVE_ANALYTICS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate predictive analytics',
      };
    }
  }

  // ========================================
  // REPORTING ENDPOINTS
  // ========================================

  @Post('reports/config')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_REPORTS)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.CREATED)
  async createReportConfig(
    @Request() req: any,
    @Body() configDto: ReportConfigDto,
  ): Promise<ApiResponse> {
    try {
      const config = await this.reportingService.createReportConfig({
        ...configDto,
        organizationId: req.user.organizationId,
        userId: req.user.id,
        isActive: true,
      });

      return {
        success: true,
        data: config,
        message: 'Report configuration created successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REPORT_CONFIG_CREATE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to create report configuration',
      };
    }
  }

  @Get('reports/configs')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_REPORTS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getReportConfigs(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const configs = await this.reportingService.getReportConfigs(
        req.user.organizationId,
        req.user.id,
      );

      return {
        success: true,
        data: configs,
        message: 'Report configurations retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REPORT_CONFIGS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve report configurations',
      };
    }
  }

  @Post('reports/generate/:configId')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.GENERATE_REPORTS)
  @RateLimit(5, 60 * 1000) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  async generateReport(
    @Request() req: any,
    @Param('configId') configId: string,
    @Body() generateDto: GenerateReportDto,
  ): Promise<ApiResponse> {
    try {
      const result = await this.reportingService.generateReport(
        configId,
        req.user.id,
        req.user.organizationId,
        {
          format: generateDto.format,
          dateRange: generateDto.dateRange ? {
            startDate: new Date(generateDto.dateRange.startDate),
            endDate: new Date(generateDto.dateRange.endDate),
          } : undefined,
          customFilters: generateDto.customFilters,
        },
      );

      return {
        success: true,
        data: result,
        message: 'Report generated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REPORT_GENERATE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate report',
      };
    }
  }

  @Get('reports/history/:configId')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_REPORTS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getReportHistory(
    @Request() req: any,
    @Param('configId') configId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ApiResponse> {
    try {
      const result = await this.reportingService.getReportHistory(
        configId,
        req.user.organizationId,
        { page: page || 1, limit: limit || 20 },
      );

      return {
        success: true,
        data: result,
        message: 'Report history retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REPORT_HISTORY_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve report history',
      };
    }
  }

  @Get('reports/templates')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_REPORTS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getReportTemplates(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const templates = await this.reportingService.getReportTemplates();

      return {
        success: true,
        data: templates,
        message: 'Report templates retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REPORT_TEMPLATES_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve report templates',
      };
    }
  }

  @Post('reports/schedule/:configId')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_REPORTS)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  async scheduleReport(
    @Request() req: any,
    @Param('configId') configId: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.reportingService.scheduleReport(
        configId,
        req.user.id,
        req.user.organizationId,
      );

      return {
        success: true,
        data: result,
        message: 'Report scheduled successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REPORT_SCHEDULE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to schedule report',
      };
    }
  }

  @Get('reports/scheduled')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_REPORTS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getScheduledReports(
    @Request() req: any,
    @Query('status') status?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.reportingService.getScheduledReports(
        req.user.organizationId,
        status as any,
      );

      return {
        success: true,
        data: result,
        message: 'Scheduled reports retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'SCHEDULED_REPORTS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve scheduled reports',
      };
    }
  }

  // ========================================
  // PERFORMANCE ANALYTICS ENDPOINTS
  // ========================================

  @Get('performance/metrics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(60, 60 * 1000) // 60 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPerformanceMetrics(
    @Request() req: any,
    @Query('timeRange') timeRange?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.performanceAnalyticsService.getPerformanceMetrics(
        req.user.organizationId,
        (timeRange as any) || 'day',
      );

      return {
        success: true,
        data: result,
        message: 'Performance metrics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERFORMANCE_METRICS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve performance metrics',
      };
    }
  }

  @Post('performance/report')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(5, 60 * 1000) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  async generatePerformanceReport(
    @Request() req: any,
    @Body() period: { startDate: string; endDate: string },
  ): Promise<ApiResponse> {
    try {
      const result = await this.performanceAnalyticsService.generatePerformanceReport(
        req.user.organizationId,
        req.user.id,
        {
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate),
        },
      );

      return {
        success: true,
        data: result,
        message: 'Performance report generated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERFORMANCE_REPORT_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate performance report',
      };
    }
  }

  @Get('performance/alerts')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(60, 60 * 1000) // 60 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPerformanceAlerts(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.performanceAnalyticsService.getActiveAlerts(
        req.user.organizationId,
      );

      return {
        success: true,
        data: result,
        message: 'Performance alerts retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERFORMANCE_ALERTS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve performance alerts',
      };
    }
  }

  @Get('performance/benchmarks')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPerformanceBenchmarks(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.performanceAnalyticsService.getPerformanceBenchmarks(
        req.user.organizationId,
      );

      return {
        success: true,
        data: result,
        message: 'Performance benchmarks retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERFORMANCE_BENCHMARKS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve performance benchmarks',
      };
    }
  }

  @Get('performance/dashboard')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  @RateLimit(60, 60 * 1000) // 60 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPerformanceDashboard(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.performanceAnalyticsService.getPerformanceDashboard(
        req.user.organizationId,
        req.user.id,
      );

      return {
        success: true,
        data: result,
        message: 'Performance dashboard retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERFORMANCE_DASHBOARD_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve performance dashboard',
      };
    }
  }

  @Post('performance/alerts/:alertId/acknowledge')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_ALERTS)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async acknowledgeAlert(
    @Request() req: any,
    @Param('alertId') alertId: string,
  ): Promise<ApiResponse> {
    try {
      await this.performanceAnalyticsService.acknowledgeAlert(
        alertId,
        req.user.id,
        req.user.organizationId,
      );

      return {
        success: true,
        data: { alertId },
        message: 'Alert acknowledged successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ALERT_ACKNOWLEDGE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to acknowledge alert',
      };
    }
  }

  @Post('performance/alerts/:alertId/resolve')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.MANAGE_ALERTS)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async resolveAlert(
    @Request() req: any,
    @Param('alertId') alertId: string,
    @Body() resolution?: { resolution: string },
  ): Promise<ApiResponse> {
    try {
      await this.performanceAnalyticsService.resolveAlert(
        alertId,
        req.user.id,
        req.user.organizationId,
        resolution?.resolution,
      );

      return {
        success: true,
        data: { alertId },
        message: 'Alert resolved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ALERT_RESOLVE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to resolve alert',
      };
    }
  }
}
