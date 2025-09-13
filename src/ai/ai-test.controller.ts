import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { ChatMessageDto } from './ai.controller';
import { ApiResponse } from '../types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';

@Controller('ai-test')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class AITestController {
  constructor(private readonly aiService: AIService) {}

  @Get('ping')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.CONFIGURE_AI_SETTINGS)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  async ping(): Promise<{ message: string }> {
    return { message: 'AI Test Controller is working!' };
  }

  @Post('chat')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.CONFIGURE_AI_SETTINGS)
  @RateLimit(5, 60 * 1000) // 5 test requests per minute
  @HttpCode(HttpStatus.OK)
  async testChat(
    @Body() chatMessageDto: ChatMessageDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      // Use a test user ID for testing
      const testUserId = 'test-user-123';
      
      const result = await this.aiService.processChat(
        testUserId,
        chatMessageDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Chat message processed successfully (test mode)',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AI_TEST_CHAT_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process chat message',
      };
    }
  }

  @Get('queue-stats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.CONFIGURE_AI_SETTINGS)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async getQueueStats(): Promise<ApiResponse> {
    try {
      const stats = await this.aiService['queueService'].getQueueStats();
      
      return {
        success: true,
        data: stats,
        message: 'Queue statistics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'QUEUE_STATS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to get queue statistics',
      };
    }
  }

  @Post('job-status')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.CONFIGURE_AI_SETTINGS)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getJobStatus(
    @Body() body: { queueName: string; jobId: string },
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getJobStatus(body.queueName, body.jobId);
      
      return {
        success: true,
        data: result,
        message: 'Job status retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'JOB_STATUS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to get job status',
      };
    }
  }
}