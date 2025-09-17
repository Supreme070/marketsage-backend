import { Controller, Get, Post, Body, Param, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('admin/messages')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getMessagesData(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const [queueStats, failedMessages, providerHealth, metrics] = await Promise.all([
        this.messagesService.getMessageQueueStats(),
        this.messagesService.getFailedMessages(),
        this.messagesService.getProviderHealth(),
        this.messagesService.getMessageMetrics(),
      ]);

      return {
        success: true,
        data: {
          queueStats,
          failedMessages,
          providerHealth,
          metrics,
        },
        message: 'Messages data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'MESSAGES_DATA_ERROR',
          message: err.message || 'Failed to fetch messages data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('queues')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getQueueStats(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const queueStats = await this.messagesService.getMessageQueueStats();
      
      return {
        success: true,
        data: queueStats,
        message: 'Queue stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'QUEUE_STATS_ERROR',
          message: err.message || 'Failed to fetch queue stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('failed')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getFailedMessages(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const failedMessages = await this.messagesService.getFailedMessages();
      
      return {
        success: true,
        data: failedMessages,
        message: 'Failed messages retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'FAILED_MESSAGES_ERROR',
          message: err.message || 'Failed to fetch failed messages',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('providers')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getProviderHealth(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const providerHealth = await this.messagesService.getProviderHealth();
      
      return {
        success: true,
        data: providerHealth,
        message: 'Provider health retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'PROVIDER_HEALTH_ERROR',
          message: err.message || 'Failed to fetch provider health',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('metrics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getMessageMetrics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const metrics = await this.messagesService.getMessageMetrics();
      
      return {
        success: true,
        data: metrics,
        message: 'Message metrics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'MESSAGE_METRICS_ERROR',
          message: err.message || 'Failed to fetch message metrics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('failed/:id/retry')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(20, 60 * 1000) // 20 retries per minute
  async retryFailedMessage(
    @Param('id') messageId: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.messagesService.retryFailedMessage(messageId);
      
      return {
        success: true,
        data: result,
        message: 'Message retry initiated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'MESSAGE_RETRY_ERROR',
          message: err.message || 'Failed to retry message',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('queues/:name/clear')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 clears per minute
  async clearQueue(
    @Param('name') queueName: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.messagesService.clearQueue(queueName);
      
      return {
        success: true,
        data: result,
        message: 'Queue cleared successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'QUEUE_CLEAR_ERROR',
          message: err.message || 'Failed to clear queue',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('queues/:name/pause')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 pauses per minute
  async pauseQueue(
    @Param('name') queueName: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.messagesService.pauseQueue(queueName);
      
      return {
        success: true,
        data: result,
        message: 'Queue paused successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'QUEUE_PAUSE_ERROR',
          message: err.message || 'Failed to pause queue',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('queues/:name/resume')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 resumes per minute
  async resumeQueue(
    @Param('name') queueName: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.messagesService.resumeQueue(queueName);
      
      return {
        success: true,
        data: result,
        message: 'Queue resumed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'QUEUE_RESUME_ERROR',
          message: err.message || 'Failed to resume queue',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
