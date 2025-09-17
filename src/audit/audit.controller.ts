import { Controller, Get, Post, Body, Query, UseGuards, Request, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('admin/audit')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('stats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getAuditStats(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const stats = await this.auditService.getAuditStats();
      
      return {
        success: true,
        data: stats,
        message: 'Audit stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'AUDIT_STATS_ERROR',
          message: err.message || 'Failed to fetch audit stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('logs')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getAuditLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('type') type: string = 'admin-actions',
    @Query('action') action: string,
    @Query('resource') resource: string,
    @Query('userId') userId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('search') search: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const filters = {
        action,
        resource,
        userId,
        dateFrom,
        dateTo,
        search,
      };

      const pagination = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        type,
      };

      const result = await this.auditService.getAuditLogs(filters, pagination);
      
      return {
        success: true,
        data: result,
        message: 'Audit logs retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'AUDIT_LOGS_ERROR',
          message: err.message || 'Failed to fetch audit logs',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('export')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 exports per minute
  async exportAuditLogs(
    @Query('type') type: string = 'admin-actions',
    @Query('action') action: string,
    @Query('resource') resource: string,
    @Query('userId') userId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('search') search: string,
    @Res() res: Response,
    @Request() req: any,
  ) {
    try {
      const filters = {
        action,
        resource,
        userId,
        dateFrom,
        dateTo,
        search,
      };

      const csvData = await this.auditService.exportAuditLogs(filters);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvData);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        success: false,
        error: {
          code: err.name || 'AUDIT_EXPORT_ERROR',
          message: err.message || 'Failed to export audit logs',
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  @Post('log')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(100, 60 * 1000) // 100 audit log creations per minute
  async createAuditLog(
    @Body() auditData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.auditService.createAuditLog(auditData);
      
      return {
        success: true,
        data: result,
        message: 'Audit log created successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'AUDIT_LOG_CREATE_ERROR',
          message: err.message || 'Failed to create audit log',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
