import {
  Controller,
  Post,
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
}