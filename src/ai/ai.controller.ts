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
  Logger,
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
import * as aiDtos from './dto/ai.dto';

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
  private readonly logger = new Logger(AIController.name);

  constructor(private readonly aiService: AIService) {}

  @Get('intelligence')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @HttpCode(HttpStatus.OK)
  async getIntelligence(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const intelligence = await this.aiService.getIntelligence(req.user.id);
      return {
        success: true,
        data: intelligence,
        message: 'AI intelligence retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get intelligence error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'INTELLIGENCE_RETRIEVAL_FAILED',
          message: 'Failed to retrieve AI intelligence',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('intelligence')
  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  async createIntelligence(
    @Body() data: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const intelligence = await this.aiService.createIntelligence(data, req.user.id);
      return {
        success: true,
        data: intelligence,
        message: 'AI intelligence created successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Create intelligence error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'INTELLIGENCE_CREATION_FAILED',
          message: 'Failed to create AI intelligence',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

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

  @Get('supreme-v3')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getSupremeV3(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getSupremeV3(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Supreme V3 data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'SUPREME_V3_RETRIEVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve Supreme V3 data',
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

  // ========================================
  // ADVANCED AI FEATURES - PHASE 4 ENDPOINTS
  // ========================================

  // Autonomous Segmentation
  @Get('autonomous-segmentation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAutonomousSegmentation(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getAutonomousSegmentation(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Autonomous segmentation data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AUTONOMOUS_SEGMENTATION_RETRIEVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve autonomous segmentation data',
      };
    }
  }

  @Post('autonomous-segmentation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  async autonomousSegmentation(
    @Request() req: any,
    @Body() segmentationDto: aiDtos.AutonomousSegmentationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processAutonomousSegmentation(
        req.user.id,
        segmentationDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Autonomous segmentation request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AUTONOMOUS_SEGMENTATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process autonomous segmentation request',
      };
    }
  }

  // Customer Journey Optimization
  @Get('customer-journey-optimization')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getCustomerJourneyOptimization(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getCustomerJourneyOptimization(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Customer journey optimization data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'CUSTOMER_JOURNEY_OPTIMIZATION_RETRIEVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve customer journey optimization data',
      };
    }
  }

  @Post('customer-journey-optimization')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(15, 60 * 1000) // 15 requests per minute
  @HttpCode(HttpStatus.OK)
  async customerJourneyOptimization(
    @Request() req: any,
    @Body() journeyDto: aiDtos.CustomerJourneyOptimizationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processCustomerJourneyOptimization(
        req.user.id,
        journeyDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Customer journey optimization request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'CUSTOMER_JOURNEY_OPTIMIZATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process customer journey optimization request',
      };
    }
  }

  // Competitor Analysis
  @Post('competitor-analysis')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(12, 60 * 1000) // 12 requests per minute
  @HttpCode(HttpStatus.OK)
  async competitorAnalysis(
    @Request() req: any,
    @Body() competitorDto: aiDtos.CompetitorAnalysisDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processCompetitorAnalysis(
        req.user.id,
        competitorDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Competitor analysis request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'COMPETITOR_ANALYSIS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process competitor analysis request',
      };
    }
  }

  // Predictive Analytics
  @Get('predictive-analytics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getPredictiveAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getPredictiveAnalytics(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Predictive analytics data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PREDICTIVE_ANALYTICS_RETRIEVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve predictive analytics data',
      };
    }
  }

  @Post('predictive-analytics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(8, 60 * 1000) // 8 requests per minute
  @HttpCode(HttpStatus.OK)
  async predictiveAnalytics(
    @Request() req: any,
    @Body() predictiveDto: aiDtos.PredictiveAnalyticsDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processPredictiveAnalytics(
        req.user.id,
        predictiveDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Predictive analytics request processed successfully',
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
        message: 'Failed to process predictive analytics request',
      };
    }
  }

  // Personalization Engine
  @Post('personalization-engine')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async personalizationEngine(
    @Request() req: any,
    @Body() personalizationDto: aiDtos.PersonalizationEngineDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processPersonalizationEngine(
        req.user.id,
        personalizationDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Personalization engine request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERSONALIZATION_ENGINE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process personalization engine request',
      };
    }
  }

  // Brand Reputation Management
  @Post('brand-reputation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(5, 60 * 1000) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  async brandReputation(
    @Request() req: any,
    @Body() brandDto: aiDtos.BrandReputationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processBrandReputation(
        req.user.id,
        brandDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Brand reputation analysis request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'BRAND_REPUTATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process brand reputation analysis request',
      };
    }
  }

  // Revenue Optimization
  @Post('revenue-optimization')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(6, 60 * 1000) // 6 requests per minute
  @HttpCode(HttpStatus.OK)
  async revenueOptimization(
    @Request() req: any,
    @Body() revenueDto: aiDtos.RevenueOptimizationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processRevenueOptimization(
        req.user.id,
        revenueDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Revenue optimization request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REVENUE_OPTIMIZATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process revenue optimization request',
      };
    }
  }

  // Cross-Channel Intelligence
  @Post('cross-channel-intelligence')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(15, 60 * 1000) // 15 requests per minute
  @HttpCode(HttpStatus.OK)
  async crossChannelIntelligence(
    @Request() req: any,
    @Body() channelDto: aiDtos.CrossChannelIntelligenceDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processCrossChannelIntelligence(
        req.user.id,
        channelDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Cross-channel intelligence request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'CROSS_CHANNEL_INTELLIGENCE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process cross-channel intelligence request',
      };
    }
  }

  // Customer Success Automation
  @Post('customer-success-automation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(18, 60 * 1000) // 18 requests per minute
  @HttpCode(HttpStatus.OK)
  async customerSuccessAutomation(
    @Request() req: any,
    @Body() successDto: aiDtos.CustomerSuccessAutomationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processCustomerSuccessAutomation(
        req.user.id,
        successDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Customer success automation request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'CUSTOMER_SUCCESS_AUTOMATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process customer success automation request',
      };
    }
  }

  // SEO Content Marketing
  @Post('seo-content-marketing')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(25, 60 * 1000) // 25 requests per minute
  @HttpCode(HttpStatus.OK)
  async seoContentMarketing(
    @Request() req: any,
    @Body() seoDto: aiDtos.SEOContentMarketingDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processSEOContentMarketing(
        req.user.id,
        seoDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'SEO content marketing request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'SEO_CONTENT_MARKETING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process SEO content marketing request',
      };
    }
  }

  // Social Media Management
  @Post('social-media-management')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async socialMediaManagement(
    @Request() req: any,
    @Body() socialDto: aiDtos.SocialMediaManagementDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processSocialMediaManagement(
        req.user.id,
        socialDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Social media management request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'SOCIAL_MEDIA_MANAGEMENT_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process social media management request',
      };
    }
  }

  // Multimodal Intelligence
  @Post('multimodal-intelligence')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  async multimodalIntelligence(
    @Request() req: any,
    @Body() multimodalDto: aiDtos.MultimodalIntelligenceDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processMultimodalIntelligence(
        req.user.id,
        multimodalDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Multimodal intelligence request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'MULTIMODAL_INTELLIGENCE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process multimodal intelligence request',
      };
    }
  }

  // Federated Learning
  @Post('federated-learning')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(3, 60 * 1000) // 3 requests per minute
  @HttpCode(HttpStatus.OK)
  async federatedLearning(
    @Request() req: any,
    @Body() federatedDto: aiDtos.FederatedLearningDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processFederatedLearning(
        req.user.id,
        federatedDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Federated learning request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'FEDERATED_LEARNING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process federated learning request',
      };
    }
  }

  // Autonomous Execution
  @Post('autonomous-execution')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(5, 60 * 1000) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  async autonomousExecution(
    @Request() req: any,
    @Body() executionDto: aiDtos.AutonomousExecutionDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processAutonomousExecution(
        req.user.id,
        executionDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Autonomous execution request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AUTONOMOUS_EXECUTION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process autonomous execution request',
      };
    }
  }

  // Performance Monitoring
  @Post('performance-monitoring')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(40, 60 * 1000) // 40 requests per minute
  @HttpCode(HttpStatus.OK)
  async performanceMonitoring(
    @Request() req: any,
    @Body() monitoringDto: aiDtos.PerformanceMonitoringDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processPerformanceMonitoring(
        req.user.id,
        monitoringDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Performance monitoring request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERFORMANCE_MONITORING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process performance monitoring request',
      };
    }
  }

  // Governance
  @Post('governance')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(8, 60 * 1000) // 8 requests per minute
  @HttpCode(HttpStatus.OK)
  async governance(
    @Request() req: any,
    @Body() governanceDto: aiDtos.GovernanceDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processGovernance(
        req.user.id,
        governanceDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Governance analysis request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'GOVERNANCE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process governance analysis request',
      };
    }
  }

  // Error Handling
  @Post('error-handling')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async errorHandling(
    @Request() req: any,
    @Body() errorDto: aiDtos.ErrorHandlingDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processErrorHandling(
        req.user.id,
        errorDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Error handling request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ERROR_HANDLING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process error handling request',
      };
    }
  }

  // Edge Computing
  @Post('edge-computing')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(12, 60 * 1000) // 12 requests per minute
  @HttpCode(HttpStatus.OK)
  async edgeComputing(
    @Request() req: any,
    @Body() edgeDto: aiDtos.EdgeComputingDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processEdgeComputing(
        req.user.id,
        edgeDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Edge computing request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'EDGE_COMPUTING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process edge computing request',
      };
    }
  }

  // Database Optimization
  @Post('database-optimization')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(6, 60 * 1000) // 6 requests per minute
  @HttpCode(HttpStatus.OK)
  async databaseOptimization(
    @Request() req: any,
    @Body() dbDto: aiDtos.DatabaseOptimizationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processDatabaseOptimization(
        req.user.id,
        dbDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Database optimization request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'DATABASE_OPTIMIZATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process database optimization request',
      };
    }
  }

  // Bulk Operations
  @Post('bulk-operations')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(2, 60 * 1000) // 2 requests per minute
  @HttpCode(HttpStatus.OK)
  async bulkOperations(
    @Request() req: any,
    @Body() bulkDto: aiDtos.BulkOperationsDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processBulkOperations(
        req.user.id,
        bulkDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Bulk operations request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'BULK_OPERATIONS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process bulk operations request',
      };
    }
  }

  // Delegation
  @Post('delegation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(25, 60 * 1000) // 25 requests per minute
  @HttpCode(HttpStatus.OK)
  async delegation(
    @Request() req: any,
    @Body() delegationDto: aiDtos.DelegationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processDelegation(
        req.user.id,
        delegationDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Delegation request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'DELEGATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process delegation request',
      };
    }
  }

  // Approval
  @Post('approval')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async approval(
    @Request() req: any,
    @Body() approvalDto: aiDtos.ApprovalDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processApproval(
        req.user.id,
        approvalDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Approval request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'APPROVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process approval request',
      };
    }
  }

  // Deployment
  @Post('deployment')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(3, 60 * 1000) // 3 requests per minute
  @HttpCode(HttpStatus.OK)
  async deployment(
    @Request() req: any,
    @Body() deploymentDto: aiDtos.DeploymentDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processDeployment(
        req.user.id,
        deploymentDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Deployment request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'DEPLOYMENT_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process deployment request',
      };
    }
  }

  // Content Generation
  @Get('content-generation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getContentGeneration(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getContentGeneration(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Content generation data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'CONTENT_GENERATION_RETRIEVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve content generation data',
      };
    }
  }

  @Post('content-generation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async generateContent(
    @Request() req: any,
    @Body() contentDto: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.generateContent(req.user.id, contentDto);
      return {
        success: true,
        data: result,
        message: 'Content generated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'CONTENT_GENERATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to generate content',
      };
    }
  }

  // Autonomous A/B Testing
  @Get('autonomous-ab-testing')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAutonomousABTesting(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getAutonomousABTesting(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Autonomous A/B testing data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AUTONOMOUS_AB_TESTING_RETRIEVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve autonomous A/B testing data',
      };
    }
  }

  @Post('autonomous-ab-testing')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  async createAutonomousABTest(
    @Request() req: any,
    @Body() abTestDto: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.createAutonomousABTest(req.user.id, abTestDto);
      return {
        success: true,
        data: result,
        message: 'Autonomous A/B test created successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'AUTONOMOUS_AB_TESTING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to create autonomous A/B test',
      };
    }
  }

  // Feedback
  @Get('feedback')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async getFeedback(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.getFeedback(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Feedback data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'FEEDBACK_RETRIEVAL_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to retrieve feedback data',
      };
    }
  }

  @Post('feedback')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async feedback(
    @Request() req: any,
    @Body() feedbackDto: aiDtos.FeedbackDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processFeedback(
        req.user.id,
        feedbackDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Feedback request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'FEEDBACK_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process feedback request',
      };
    }
  }

  // Health Check
  @Post('health-check')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(60, 60 * 1000) // 60 requests per minute
  @HttpCode(HttpStatus.OK)
  async healthCheck(
    @Request() req: any,
    @Body() healthDto: aiDtos.HealthCheckDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processHealthCheck(
        req.user.id,
        healthDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Health check request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'HEALTH_CHECK_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process health check request',
      };
    }
  }

  // Integration
  @Post('integration')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(15, 60 * 1000) // 15 requests per minute
  @HttpCode(HttpStatus.OK)
  async integration(
    @Request() req: any,
    @Body() integrationDto: aiDtos.IntegrationDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processIntegration(
        req.user.id,
        integrationDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Integration request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'INTEGRATION_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process integration request',
      };
    }
  }

  // ML Training
  @Post('ml-training')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(2, 60 * 1000) // 2 requests per minute
  @HttpCode(HttpStatus.OK)
  async mlTraining(
    @Request() req: any,
    @Body() mlDto: aiDtos.MLTrainingDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processMLTraining(
        req.user.id,
        mlDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'ML training request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'ML_TRAINING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process ML training request',
      };
    }
  }

  // Permissions
  @Post('permissions')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(40, 60 * 1000) // 40 requests per minute
  @HttpCode(HttpStatus.OK)
  async permissions(
    @Request() req: any,
    @Body() permissionsDto: aiDtos.PermissionsDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processPermissions(
        req.user.id,
        permissionsDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Permissions request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'PERMISSIONS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process permissions request',
      };
    }
  }

  // Queue Management
  @Post('queue')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  @HttpCode(HttpStatus.OK)
  async queue(
    @Request() req: any,
    @Body() queueDto: aiDtos.QueueDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processQueue(
        req.user.id,
        queueDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Queue management request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'QUEUE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process queue management request',
      };
    }
  }

  // RAG (Retrieval Augmented Generation)
  @Post('rag')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  @HttpCode(HttpStatus.OK)
  async rag(
    @Request() req: any,
    @Body() ragDto: aiDtos.RAGDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processRAG(
        req.user.id,
        ragDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'RAG request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'RAG_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process RAG request',
      };
    }
  }

  // Reports
  @Post('reports')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(10, 60 * 1000) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  async reports(
    @Request() req: any,
    @Body() reportsDto: aiDtos.ReportsDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processReports(
        req.user.id,
        reportsDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Reports request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'REPORTS_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process reports request',
      };
    }
  }

  // Strategic
  @Post('strategic')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(5, 60 * 1000) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  async strategic(
    @Request() req: any,
    @Body() strategicDto: aiDtos.StrategicDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processStrategic(
        req.user.id,
        strategicDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Strategic analysis request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'STRATEGIC_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process strategic analysis request',
      };
    }
  }

  // Testing
  @Post('testing')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(25, 60 * 1000) // 25 requests per minute
  @HttpCode(HttpStatus.OK)
  async testing(
    @Request() req: any,
    @Body() testingDto: aiDtos.TestingDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processTesting(
        req.user.id,
        testingDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Testing request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'TESTING_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process testing request',
      };
    }
  }

  // Workflow
  @Post('workflow')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.USE_AI_FEATURES)
  @RateLimit(15, 60 * 1000) // 15 requests per minute
  @HttpCode(HttpStatus.OK)
  async workflow(
    @Request() req: any,
    @Body() workflowDto: aiDtos.WorkflowDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<ApiResponse> {
    try {
      const result = await this.aiService.processWorkflow(
        req.user.id,
        workflowDto,
        correlationId,
      );

      return {
        success: true,
        data: result,
        message: 'Workflow request processed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: 'WORKFLOW_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        message: 'Failed to process workflow request',
      };
    }
  }
}