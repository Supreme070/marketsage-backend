import { Controller, Get, Post, Param, Query, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('admin/security')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('stats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getSecurityStats(@Request() req: any): Promise<ApiResponse> {
    try {
      const stats = await this.securityService.getSecurityStats();
      return {
        success: true,
        data: stats,
        message: 'Security stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SECURITY_STATS_ERROR',
          message: err.message || 'Failed to fetch security stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('events')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  async getSecurityEvents(
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const limitNum = parseInt(limit, 10) || 50;
      const offsetNum = parseInt(offset, 10) || 0;
      
      const events = await this.securityService.getSecurityEvents(limitNum, offsetNum);
      return {
        success: true,
        data: events,
        message: 'Security events retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SECURITY_EVENTS_ERROR',
          message: err.message || 'Failed to fetch security events',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('access-logs')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  async getAccessLogs(
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const limitNum = parseInt(limit, 10) || 50;
      const offsetNum = parseInt(offset, 10) || 0;
      
      const logs = await this.securityService.getAccessLogs(limitNum, offsetNum);
      return {
        success: true,
        data: logs,
        message: 'Access logs retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ACCESS_LOGS_ERROR',
          message: err.message || 'Failed to fetch access logs',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('api-keys')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getApiKeys(@Request() req: any): Promise<ApiResponse> {
    try {
      const apiKeys = await this.securityService.getApiKeys();
      return {
        success: true,
        data: apiKeys,
        message: 'API keys retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'API_KEYS_ERROR',
          message: err.message || 'Failed to fetch API keys',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('threats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getThreatDetection(@Request() req: any): Promise<ApiResponse> {
    try {
      const threats = await this.securityService.getThreatDetection();
      return {
        success: true,
        data: threats,
        message: 'Threat detection data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'THREAT_DETECTION_ERROR',
          message: err.message || 'Failed to fetch threat detection data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('events/:id/resolve')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(20, 60 * 1000) // 20 resolutions per minute
  async resolveSecurityEvent(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.securityService.resolveSecurityEvent(id);
      return {
        success: true,
        data: result,
        message: 'Security event resolved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SECURITY_EVENT_RESOLVE_ERROR',
          message: err.message || 'Failed to resolve security event',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('threats/:id/block')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 blocks per minute
  async blockThreat(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.securityService.blockThreat(id);
      return {
        success: true,
        data: result,
        message: 'Threat blocked successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'THREAT_BLOCK_ERROR',
          message: err.message || 'Failed to block threat',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('api-keys/:id/revoke')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 revocations per minute
  async revokeApiKey(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.securityService.revokeApiKey(id);
      return {
        success: true,
        data: result,
        message: 'API key revoked successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'API_KEY_REVOKE_ERROR',
          message: err.message || 'Failed to revoke API key',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
