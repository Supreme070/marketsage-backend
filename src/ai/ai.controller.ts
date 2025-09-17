import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Headers,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';
import { IsString, IsOptional, IsArray, IsObject, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @MaxLength(4000)
  message!: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsArray()
  history?: Array<{ role: string; content: string }>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AnalysisRequestDto {
  @IsString()
  type!: 'customer' | 'campaign' | 'market' | 'performance';

  @IsObject()
  data!: Record<string, any>;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;
}

export class PredictionRequestDto {
  @IsString()
  type!: 'churn' | 'ltv' | 'conversion' | 'engagement';

  @IsString()
  targetId!: string; // customer ID, campaign ID, etc.

  @IsOptional()
  @IsObject()
  features?: Record<string, any>;
}

export class ContentGenerationDto {
  @IsString()
  type!: 'email' | 'sms' | 'social' | 'blog';

  @IsString()
  @MaxLength(200)
  prompt!: string;

  @IsOptional()
  @IsString()
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent';

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('chat')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async chat(
    @Request() req: any,
    @Body() chatMessageDto: ChatMessageDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processChat(
        req.user.id,
        chatMessageDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Chat message processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AI_CHAT_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process chat message',
      };
    }
  }

  @Post('analyze')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async analyze(
    @Request() req: any,
    @Body() analysisRequestDto: AnalysisRequestDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processAnalysis(
        req.user.id,
        analysisRequestDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Analysis request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AI_ANALYSIS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process analysis request',
      };
    }
  }

  @Post('predict')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(15, 60 * 1000) // 15 requests per minute
  @HttpCode(HttpStatus.OK)
  async predict(
    @Request() req: any,
    @Body() predictionRequestDto: PredictionRequestDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processPrediction(
        req.user.id,
        predictionRequestDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Prediction request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AI_PREDICTION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process prediction request',
      };
    }
  }

  @Post('supreme-v3')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async supremeV3(
    @Request() req: any,
    @Body() requestBody: any,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      // Handle different request types for Supreme-v3
      const { type, question, userId, context, enableTaskExecution } = requestBody;
      
      let result;
      switch (type) {
        case 'question':
          result = await this.aiService.processSupremeV3Question(
            req.user.id,
            { message: question, context, enableTaskExecution },
            correlationId,
          );
          break;
        case 'analyze':
          result = await this.aiService.processSupremeV3Analysis(
            req.user.id,
            { question, context, enableTaskExecution },
            correlationId,
          );
          break;
        case 'customer':
          result = await this.aiService.processSupremeV3Customer(
            req.user.id,
            { customers: requestBody.customers, context },
            correlationId,
          );
          break;
        default:
          result = await this.aiService.processSupremeV3Generic(
            req.user.id,
            requestBody,
            correlationId,
          );
      }

      return {
        success: true,
        data: result,
        message: 'Supreme-v3 request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'SUPREME_V3_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process Supreme-v3 request',
      };
    }
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAdminAIData(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const [stats, models, costs, operations, safetyIncidents] = await Promise.all([
        this.aiService.getAdminAIStats(),
        this.aiService.getAdminAIModels(),
        this.aiService.getAdminAICosts(),
        this.aiService.getAdminAIOperations(),
        this.aiService.getAdminSafetyIncidents(),
      ]);

      return {
        success: true,
        data: {
          stats,
          models,
          costs,
          operations,
          safetyIncidents,
        },
        message: 'Admin AI data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ADMIN_AI_DATA_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve admin AI data',
      };
    }
  }

  @Get('admin/stats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAdminAIStats(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const stats = await this.aiService.getAdminAIStats();

      return {
        success: true,
        data: stats,
        message: 'Admin AI stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ADMIN_AI_STATS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve admin AI stats',
      };
    }
  }

  @Get('admin/models')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAdminAIModels(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const models = await this.aiService.getAdminAIModels();

      return {
        success: true,
        data: models,
        message: 'Admin AI models retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ADMIN_AI_MODELS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve admin AI models',
      };
    }
  }

  @Get('admin/costs')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAdminAICosts(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const costs = await this.aiService.getAdminAICosts();

      return {
        success: true,
        data: costs,
        message: 'Admin AI costs retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ADMIN_AI_COSTS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve admin AI costs',
      };
    }
  }

  @Get('admin/operations')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAdminAIOperations(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const operations = await this.aiService.getAdminAIOperations();

      return {
        success: true,
        data: operations,
        message: 'Admin AI operations retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ADMIN_AI_OPERATIONS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve admin AI operations',
      };
    }
  }

  @Get('admin/safety-incidents')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAdminSafetyIncidents(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const safetyIncidents = await this.aiService.getAdminSafetyIncidents();

      return {
        success: true,
        data: safetyIncidents,
        message: 'Admin safety incidents retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ADMIN_SAFETY_INCIDENTS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve admin safety incidents',
      };
    }
  }

  @Get('admin/usage-analytics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAdminAIUsageAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.aiService.getAdminAIUsageAnalytics();

      return {
        success: true,
        data: analytics,
        message: 'Admin AI usage analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ADMIN_AI_USAGE_ANALYTICS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve admin AI usage analytics',
      };
    }
  }
}