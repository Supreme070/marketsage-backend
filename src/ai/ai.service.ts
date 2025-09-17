import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessageDto, AnalysisRequestDto, PredictionRequestDto, ContentGenerationDto } from './ai.controller';
import * as aiDtos from './dto/ai.dto';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly prisma: PrismaService,
  ) {}

  async processChat(
    userId: string,
    chatMessageDto: ChatMessageDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing chat request for user ${userId}`);

      // Add chat task to the queue with high priority
      const job = await this.queueService.addAIChatTask(
        userId,
        {
          message: chatMessageDto.message,
          context: chatMessageDto.context,
          history: chatMessageDto.history || [],
          metadata: chatMessageDto.metadata,
        },
        correlationId,
        8, // High priority for chat
      );

      // For real-time chat, we wait for the job to complete
      const result = await job.finished();

      this.logger.log(`Chat request completed for user ${userId}, job ${job.id}`);
      
      return {
        jobId: job.id,
        response: result.result.response,
        tokens: result.result.tokens,
        model: result.result.model,
        processingTime: result.duration,
        correlationId: result.result.correlationId,
      };
    } catch (error) {
      this.logger.error(`Failed to process chat for user ${userId}:`, error);
      throw error;
    }
  }

  async processAnalysis(
    userId: string,
    analysisRequestDto: AnalysisRequestDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing analysis request for user ${userId}, type: ${analysisRequestDto.type}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: analysisRequestDto.type,
          data: analysisRequestDto.data,
          parameters: analysisRequestDto.parameters,
        },
        correlationId,
        metadata: {
          requestType: analysisRequestDto.type,
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 5, // Medium priority
        attempts: 3,
      });

      // For analysis, we can return the job ID and let client poll for results
      // or wait for completion based on analysis complexity
      const isComplexAnalysis = ['market', 'performance'].includes(analysisRequestDto.type);
      
      if (isComplexAnalysis) {
        // Return job ID for polling
        return {
          jobId: job.id,
          status: 'processing',
          estimatedTime: '30-60 seconds',
          message: 'Analysis is being processed. Use the job ID to check status.',
        };
      } else {
        // Wait for simpler analysis to complete
        const result = await job.finished();
        
        return {
          jobId: job.id,
          analysis: result.result.analysis,
          confidence: result.result.confidence,
          insights: result.result.insights,
          processingTime: result.duration,
        };
      }
    } catch (error) {
      this.logger.error(`Failed to process analysis for user ${userId}:`, error);
      throw error;
    }
  }

  async processPrediction(
    userId: string,
    predictionRequestDto: PredictionRequestDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing prediction request for user ${userId}, type: ${predictionRequestDto.type}`);

      const job = await this.queueService.addAITask({
        type: 'prediction',
        userId,
        input: {
          predictionType: predictionRequestDto.type,
          targetId: predictionRequestDto.targetId,
          features: predictionRequestDto.features,
        },
        correlationId,
        metadata: {
          predictionType: predictionRequestDto.type,
          targetId: predictionRequestDto.targetId,
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6, // Medium-high priority
        attempts: 2,
      });

      // Predictions usually take time, return job ID for polling
      return {
        jobId: job.id,
        status: 'processing',
        predictionType: predictionRequestDto.type,
        targetId: predictionRequestDto.targetId,
        estimatedTime: '10-30 seconds',
        message: 'Prediction is being processed. Use the job ID to check status.',
      };
    } catch (error) {
      this.logger.error(`Failed to process prediction for user ${userId}:`, error);
      throw error;
    }
  }

  async processContentGeneration(
    userId: string,
    contentGenerationDto: ContentGenerationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing content generation for user ${userId}, type: ${contentGenerationDto.type}`);

      const job = await this.queueService.addAITask({
        type: 'content-generation',
        userId,
        input: {
          contentType: contentGenerationDto.type,
          prompt: contentGenerationDto.prompt,
          tone: contentGenerationDto.tone || 'professional',
          context: contentGenerationDto.context,
        },
        correlationId,
        metadata: {
          contentType: contentGenerationDto.type,
          tone: contentGenerationDto.tone,
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 4, // Medium priority
        attempts: 2,
      });

      // For content generation, wait for completion as users expect immediate results
      const result = await job.finished();

      this.logger.log(`Content generation completed for user ${userId}, job ${job.id}`);
      
      return {
        jobId: job.id,
        content: result.result.content,
        wordCount: result.result.wordCount,
        tone: result.result.tone,
        contentType: contentGenerationDto.type,
        processingTime: result.duration,
      };
    } catch (error) {
      this.logger.error(`Failed to process content generation for user ${userId}:`, error);
      throw error;
    }
  }

  // Helper method to check job status
  async getJobStatus(queueName: string, jobId: string) {
    try {
      const job = await this.queueService.getJob(queueName, jobId);
      
      if (!job) {
        return { error: 'Job not found' };
      }

      const isCompleted = await job.isCompleted();
      const isActive = await job.isActive();
      const isFailed = await job.isFailed();
      const isWaiting = await job.isWaiting();

      let status = 'unknown';
      let result = null;

      if (isCompleted) {
        status = 'completed';
        result = job.returnvalue;
      } else if (isFailed) {
        status = 'failed';
        result = { error: job.failedReason };
      } else if (isActive) {
        status = 'processing';
      } else if (isWaiting) {
        status = 'waiting';
      }

      return {
        jobId,
        status,
        result,
        progress: job.progress,
        createdAt: new Date(job.timestamp),
        processedOn: job.processedOn ? new Date(job.processedOn) : null,
        finishedOn: job.finishedOn ? new Date(job.finishedOn) : null,
      };
    } catch (error) {
      this.logger.error(`Failed to get job status for ${jobId}:`, error);
      throw error;
    }
  }

  // Supreme-v3 Methods
  async processSupremeV3Question(
    userId: string,
    requestData: { message: string; context?: any; enableTaskExecution?: boolean },
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing Supreme-v3 question for user ${userId}`);

      // Mock response for now - replace with actual AI processing
      const mockResponse = {
        answer: `Supreme-AI v3 Response: ${requestData.message}\n\nThis is a mock response. The Supreme-AI engine is processing your request with advanced African market intelligence and cultural adaptation algorithms.`,
        confidence: 0.85,
        processingTime: 1200,
        source: 'supreme-v3-engine',
        taskExecution: requestData.enableTaskExecution ? {
          executed: true,
          summary: 'Supreme-AI task executed successfully',
          details: 'Advanced automation protocols activated'
        } : null
      };

      return mockResponse;
    } catch (error) {
      this.logger.error(`Failed to process Supreme-v3 question for user ${userId}:`, error);
      throw error;
    }
  }

  async processSupremeV3Analysis(
    userId: string,
    requestData: { question: string; context?: any; enableTaskExecution?: boolean },
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing Supreme-v3 analysis for user ${userId}`);

      // Mock analysis response
      const mockAnalysis = {
        analysis: `Supreme-AI Analysis: ${requestData.question}\n\nComprehensive market analysis completed using advanced African fintech intelligence algorithms. Key insights include cultural adaptation strategies, mobile-first optimization, and localized engagement patterns.`,
        insights: [
          'Cultural adaptation score: 92%',
          'Mobile optimization potential: High',
          'Local market penetration: 78%',
          'Engagement optimization: +35%'
        ],
        recommendations: [
          'Implement mobile-first design patterns',
          'Adapt messaging for local cultural context',
          'Optimize for African payment preferences',
          'Enhance accessibility features'
        ],
        confidence: 0.88,
        processingTime: 2100,
        source: 'supreme-v3-analytics'
      };

      return mockAnalysis;
    } catch (error) {
      this.logger.error(`Failed to process Supreme-v3 analysis for user ${userId}:`, error);
      throw error;
    }
  }

  async processSupremeV3Customer(
    userId: string,
    requestData: { customers: any[]; context?: any },
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing Supreme-v3 customer analysis for user ${userId}`);

      // Mock customer analysis
      const mockCustomerAnalysis = {
        analysis: 'Supreme-AI Customer Intelligence Analysis',
        segments: [
          { name: 'High-Value Customers', count: requestData.customers.length * 0.15, characteristics: ['High engagement', 'Premium features'] },
          { name: 'At-Risk Customers', count: requestData.customers.length * 0.08, characteristics: ['Low activity', 'Payment issues'] },
          { name: 'Growth Potential', count: requestData.customers.length * 0.25, characteristics: ['Moderate usage', 'Engagement opportunities'] }
        ],
        insights: [
          'Customer lifetime value trending upward',
          'Churn risk identified in 8% of base',
          'Growth opportunities in mobile segment',
          'Personalization potential: High'
        ],
        recommendations: [
          'Implement retention campaigns for at-risk segment',
          'Develop mobile-first features',
          'Create personalized content strategies',
          'Optimize payment flow for African markets'
        ],
        confidence: 0.82,
        processingTime: 1800,
        source: 'supreme-v3-customer-intelligence'
      };

      return mockCustomerAnalysis;
    } catch (error) {
      this.logger.error(`Failed to process Supreme-v3 customer analysis for user ${userId}:`, error);
      throw error;
    }
  }

  async processSupremeV3Generic(
    userId: string,
    requestData: any,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing Supreme-v3 generic request for user ${userId}`);

      // Generic Supreme-v3 response
      const mockGenericResponse = {
        answer: 'Supreme-AI v3 Generic Processing Complete',
        data: requestData,
        processingTime: 1500,
        source: 'supreme-v3-generic',
        confidence: 0.75
      };

      return mockGenericResponse;
    } catch (error) {
      this.logger.error(`Failed to process Supreme-v3 generic request for user ${userId}:`, error);
      throw error;
    }
  }

  // Admin-specific methods
  async getAdminAIStats() {
    try {
      // Get AI usage statistics from queue service
      const queueStats = await this.queueService.getQueueStats();
      
      // Mock AI usage stats - in a real implementation, these would come from AI usage tracking
      const totalRequests = queueStats.ai.completed + queueStats.ai.failed;
      const requestsToday = Math.floor(totalRequests * 0.15); // Mock: 15% of total requests today
      const requestsThisMonth = Math.floor(totalRequests * 0.8); // Mock: 80% of total requests this month
      
      return {
        totalRequests,
        requestsToday,
        requestsThisMonth,
        totalCost: 1250.75, // Mock cost data
        costToday: 45.20,
        costThisMonth: 890.30,
        averageResponseTime: 2.3,
        successRate: 97.8,
        activeModels: 4,
        safetyIncidents: 2,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin AI stats: ${err.message}`);
      throw error;
    }
  }

  async getAdminAIModels() {
    try {
      // Mock AI models data - in a real implementation, these would come from AI model management
      return [
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          provider: 'openai',
          status: 'active',
          version: '4.0-turbo',
          requests: 15420,
          cost: 1250.75,
          averageResponseTime: 1.8,
          errorRate: 0.2,
          accuracy: 94.5,
          lastUsed: new Date().toISOString(),
          capabilities: ['chat', 'analysis', 'content-generation'],
        },
        {
          id: 'claude-3-opus',
          name: 'Claude 3 Opus',
          provider: 'anthropic',
          status: 'active',
          version: '3.0-opus',
          requests: 8920,
          cost: 890.30,
          averageResponseTime: 2.1,
          errorRate: 0.1,
          accuracy: 96.2,
          lastUsed: new Date(Date.now() - 3600000).toISOString(),
          capabilities: ['analysis', 'reasoning', 'content-generation'],
        },
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          provider: 'google',
          status: 'maintenance',
          version: '1.5-pro',
          requests: 5430,
          cost: 320.15,
          averageResponseTime: 2.8,
          errorRate: 0.5,
          accuracy: 92.8,
          lastUsed: new Date(Date.now() - 7200000).toISOString(),
          capabilities: ['multimodal', 'analysis', 'prediction'],
        },
        {
          id: 'custom-model',
          name: 'Custom MarketSage Model',
          provider: 'custom',
          status: 'active',
          version: '2.1',
          requests: 2340,
          cost: 150.20,
          averageResponseTime: 1.5,
          errorRate: 0.1,
          accuracy: 98.1,
          lastUsed: new Date(Date.now() - 1800000).toISOString(),
          capabilities: ['market-analysis', 'customer-insights', 'campaign-optimization'],
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin AI models: ${err.message}`);
      throw error;
    }
  }

  async getAdminAICosts() {
    try {
      // Mock cost breakdown data
      return [
        {
          provider: 'OpenAI',
          model: 'GPT-4 Turbo',
          requests: 15420,
          cost: 1250.75,
          percentage: 45.2,
          trend: 'up',
          trendValue: 12.5,
        },
        {
          provider: 'Anthropic',
          model: 'Claude 3 Opus',
          requests: 8920,
          cost: 890.30,
          percentage: 32.1,
          trend: 'stable',
          trendValue: 0.8,
        },
        {
          provider: 'Google',
          model: 'Gemini Pro',
          requests: 5430,
          cost: 320.15,
          percentage: 11.6,
          trend: 'down',
          trendValue: -5.2,
        },
        {
          provider: 'Custom',
          model: 'MarketSage Model',
          requests: 2340,
          cost: 150.20,
          percentage: 5.4,
          trend: 'up',
          trendValue: 8.3,
        },
        {
          provider: 'OpenAI',
          model: 'GPT-3.5 Turbo',
          requests: 1890,
          cost: 89.40,
          percentage: 3.2,
          trend: 'down',
          trendValue: -15.7,
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin AI costs: ${err.message}`);
      throw error;
    }
  }

  async getAdminSafetyIncidents() {
    try {
      // Mock safety incidents data
      return [
        {
          id: 'SAFETY-001',
          type: 'content_violation',
          severity: 'medium',
          description: 'Inappropriate content detected in user-generated prompt',
          model: 'GPT-4 Turbo',
          user: 'user-123',
          organization: 'Acme Corp',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'resolved',
          action: 'Content filtered and user warned',
          details: {
            prompt: 'Generate content about...',
            violationType: 'inappropriate_language',
            confidence: 0.89,
          },
        },
        {
          id: 'SAFETY-002',
          type: 'safety_filter',
          severity: 'low',
          description: 'Safety filter triggered for potentially harmful request',
          model: 'Claude 3 Opus',
          user: 'user-456',
          organization: 'Globex Inc',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'investigating',
          action: 'Request blocked pending review',
          details: {
            prompt: 'Help me with...',
            filterType: 'harmful_content',
            confidence: 0.76,
          },
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin safety incidents: ${err.message}`);
      throw error;
    }
  }

  async getAdminAIOperations() {
    try {
      // Mock AI operations data
      return [
        {
          id: 'OP-001',
          type: 'chat',
          model: 'GPT-4 Turbo',
          organization: 'Acme Corp',
          user: 'john.doe@acme.com',
          prompt: 'Help me analyze customer feedback data...',
          response: 'Based on the customer feedback analysis...',
          status: 'completed',
          startTime: new Date(Date.now() - 1800000).toISOString(),
          endTime: new Date(Date.now() - 1795000).toISOString(),
          cost: 0.15,
          tokens: {
            input: 450,
            output: 320,
            total: 770,
          },
          safetyChecks: {
            passed: true,
            flags: [],
          },
        },
        {
          id: 'OP-002',
          type: 'analysis',
          model: 'Claude 3 Opus',
          organization: 'Globex Inc',
          user: 'jane.smith@globex.com',
          prompt: 'Analyze campaign performance metrics...',
          response: 'Campaign analysis shows strong performance...',
          status: 'completed',
          startTime: new Date(Date.now() - 3600000).toISOString(),
          endTime: new Date(Date.now() - 3590000).toISOString(),
          cost: 0.28,
          tokens: {
            input: 680,
            output: 520,
            total: 1200,
          },
          safetyChecks: {
            passed: true,
            flags: [],
          },
        },
        {
          id: 'OP-003',
          type: 'content_generation',
          model: 'Custom MarketSage Model',
          organization: 'TechStart Inc',
          user: 'mike.chen@techstart.com',
          prompt: 'Generate email campaign content for product launch...',
          response: 'Here\'s compelling email content for your product launch...',
          status: 'running',
          startTime: new Date(Date.now() - 300000).toISOString(),
          endTime: null,
          cost: 0.0,
          tokens: {
            input: 200,
            output: 0,
            total: 200,
          },
          safetyChecks: {
            passed: true,
            flags: [],
          },
        },
        {
          id: 'OP-004',
          type: 'prediction',
          model: 'Gemini Pro',
          organization: 'DataCorp',
          user: 'sarah.johnson@datacorp.com',
          prompt: 'Predict customer churn probability...',
          response: 'Customer churn prediction analysis...',
          status: 'failed',
          startTime: new Date(Date.now() - 5400000).toISOString(),
          endTime: new Date(Date.now() - 5380000).toISOString(),
          cost: 0.0,
          tokens: {
            input: 150,
            output: 0,
            total: 150,
          },
          safetyChecks: {
            passed: false,
            flags: ['data_privacy_concern'],
          },
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin AI operations: ${err.message}`);
      throw error;
    }
  }

  async getAdminAIUsageAnalytics() {
    try {
      // Mock usage analytics data
      return {
        byModel: [
          { model: 'GPT-4 Turbo', requests: 15420, percentage: 45 },
          { model: 'Claude 3 Opus', requests: 8920, percentage: 26 },
          { model: 'Gemini Pro', requests: 5430, percentage: 16 },
          { model: 'Custom Model', requests: 2340, percentage: 7 },
          { model: 'GPT-3.5 Turbo', requests: 1890, percentage: 6 },
        ],
        byType: [
          { type: 'CHAT', requests: 8430, percentage: 45 },
          { type: 'ANALYSIS', requests: 6240, percentage: 33 },
          { type: 'CONTENT_GENERATION', requests: 2890, percentage: 15 },
          { type: 'PREDICTION', requests: 1340, percentage: 7 },
        ],
        peakUsage: {
          peakHour: '2:00 PM - 3:00 PM',
          peakDay: 'Wednesday',
          avgQueueTime: '0.8s',
          capacityUsed: 78,
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin AI usage analytics: ${err.message}`);
      throw error;
    }
  }

  // ========================================
  // ADVANCED AI FEATURES - PHASE 4
  // ========================================

  // Autonomous Segmentation
  async processAutonomousSegmentation(
    userId: string,
    segmentationDto: aiDtos.AutonomousSegmentationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing autonomous segmentation for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'autonomous-segmentation',
          criteria: segmentationDto.criteria,
          minSegmentSize: segmentationDto.minSegmentSize || 10,
          features: segmentationDto.features || [],
        },
        correlationId,
        metadata: {
          requestType: 'autonomous-segmentation',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '15-30 seconds',
        message: 'Autonomous segmentation is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process autonomous segmentation for user ${userId}:`, error);
      throw error;
    }
  }

  // Customer Journey Optimization
  async processCustomerJourneyOptimization(
    userId: string,
    journeyDto: aiDtos.CustomerJourneyOptimizationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing customer journey optimization for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'customer-journey-optimization',
          customerId: journeyDto.customerId,
          touchpoints: journeyDto.touchpoints || [],
          goals: journeyDto.goals || {},
        },
        correlationId,
        metadata: {
          requestType: 'customer-journey-optimization',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 7,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '20-40 seconds',
        message: 'Customer journey optimization is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process customer journey optimization for user ${userId}:`, error);
      throw error;
    }
  }

  // Competitor Analysis
  async processCompetitorAnalysis(
    userId: string,
    competitorDto: aiDtos.CompetitorAnalysisDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing competitor analysis for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'competitor-analysis',
          competitor: competitorDto.competitor,
          metrics: competitorDto.metrics || ['market-share', 'pricing', 'features'],
          timeframe: competitorDto.timeframe || { start: '2024-01-01', end: '2024-12-31' },
        },
        correlationId,
        metadata: {
          requestType: 'competitor-analysis',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 5,
        attempts: 3,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '30-60 seconds',
        message: 'Competitor analysis is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process competitor analysis for user ${userId}:`, error);
      throw error;
    }
  }

  // Predictive Analytics
  async processPredictiveAnalytics(
    userId: string,
    predictiveDto: aiDtos.PredictiveAnalyticsDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing predictive analytics for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'prediction',
        userId,
        input: {
          predictionType: predictiveDto.modelType,
          inputData: predictiveDto.inputData,
          forecastDays: predictiveDto.forecastDays || 30,
        },
        correlationId,
        metadata: {
          requestType: 'predictive-analytics',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 8,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '25-45 seconds',
        message: 'Predictive analytics is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process predictive analytics for user ${userId}:`, error);
      throw error;
    }
  }

  // Personalization Engine
  async processPersonalizationEngine(
    userId: string,
    personalizationDto: aiDtos.PersonalizationEngineDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing personalization engine for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'personalization-engine',
          userId: personalizationDto.userId,
          preferences: personalizationDto.preferences || {},
          contentTypes: personalizationDto.contentTypes || ['email', 'sms', 'social'],
        },
        correlationId,
        metadata: {
          requestType: 'personalization-engine',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '10-20 seconds',
        message: 'Personalization engine is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process personalization engine for user ${userId}:`, error);
      throw error;
    }
  }

  // Brand Reputation Management
  async processBrandReputation(
    userId: string,
    brandDto: aiDtos.BrandReputationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing brand reputation for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'brand-reputation',
          brandName: brandDto.brandName,
          platforms: brandDto.platforms || ['twitter', 'facebook', 'instagram', 'linkedin'],
          timeframe: brandDto.timeframe || { start: '2024-01-01', end: '2024-12-31' },
        },
        correlationId,
        metadata: {
          requestType: 'brand-reputation',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 5,
        attempts: 3,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '45-90 seconds',
        message: 'Brand reputation analysis is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process brand reputation for user ${userId}:`, error);
      throw error;
    }
  }

  // Revenue Optimization
  async processRevenueOptimization(
    userId: string,
    revenueDto: aiDtos.RevenueOptimizationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing revenue optimization for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'revenue-optimization',
          strategy: revenueDto.strategy,
          parameters: revenueDto.parameters || {},
          riskTolerance: revenueDto.riskTolerance || 50,
        },
        correlationId,
        metadata: {
          requestType: 'revenue-optimization',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 9,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '30-60 seconds',
        message: 'Revenue optimization is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process revenue optimization for user ${userId}:`, error);
      throw error;
    }
  }

  // Cross-Channel Intelligence
  async processCrossChannelIntelligence(
    userId: string,
    channelDto: aiDtos.CrossChannelIntelligenceDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing cross-channel intelligence for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'cross-channel-intelligence',
          channels: channelDto.channels,
          metrics: channelDto.metrics || {},
          timeframe: channelDto.timeframe || '30d',
        },
        correlationId,
        metadata: {
          requestType: 'cross-channel-intelligence',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '20-40 seconds',
        message: 'Cross-channel intelligence is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process cross-channel intelligence for user ${userId}:`, error);
      throw error;
    }
  }

  // Customer Success Automation
  async processCustomerSuccessAutomation(
    userId: string,
    successDto: aiDtos.CustomerSuccessAutomationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing customer success automation for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'customer-success-automation',
          customerId: successDto.customerId,
          actions: successDto.actions || [],
          triggers: successDto.triggers || {},
        },
        correlationId,
        metadata: {
          requestType: 'customer-success-automation',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 7,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '15-30 seconds',
        message: 'Customer success automation is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process customer success automation for user ${userId}:`, error);
      throw error;
    }
  }

  // SEO Content Marketing
  async processSEOContentMarketing(
    userId: string,
    seoDto: aiDtos.SEOContentMarketingDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing SEO content marketing for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'content-generation',
        userId,
        input: {
          contentType: 'seo-content',
          topic: seoDto.topic,
          keywords: seoDto.keywords || [],
          targetAudience: seoDto.targetAudience || 'general',
        },
        correlationId,
        metadata: {
          requestType: 'seo-content-marketing',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 4,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '20-40 seconds',
        message: 'SEO content marketing is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process SEO content marketing for user ${userId}:`, error);
      throw error;
    }
  }

  // Social Media Management
  async processSocialMediaManagement(
    userId: string,
    socialDto: aiDtos.SocialMediaManagementDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing social media management for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'content-generation',
        userId,
        input: {
          contentType: 'social-media',
          platform: socialDto.platform,
          content: socialDto.content || {},
          schedule: socialDto.schedule || {},
        },
        correlationId,
        metadata: {
          requestType: 'social-media-management',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 4,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '15-30 seconds',
        message: 'Social media management is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process social media management for user ${userId}:`, error);
      throw error;
    }
  }

  // Multimodal Intelligence
  async processMultimodalIntelligence(
    userId: string,
    multimodalDto: aiDtos.MultimodalIntelligenceDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing multimodal intelligence for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'multimodal-intelligence',
          type: multimodalDto.type,
          data: multimodalDto.data,
          analysisType: multimodalDto.analysisType || 'comprehensive',
        },
        correlationId,
        metadata: {
          requestType: 'multimodal-intelligence',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 8,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '30-60 seconds',
        message: 'Multimodal intelligence is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process multimodal intelligence for user ${userId}:`, error);
      throw error;
    }
  }

  // Federated Learning
  async processFederatedLearning(
    userId: string,
    federatedDto: aiDtos.FederatedLearningDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing federated learning for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'federated-learning',
          modelId: federatedDto.modelId,
          parameters: federatedDto.parameters || {},
          privacyMode: federatedDto.privacyMode || true,
        },
        correlationId,
        metadata: {
          requestType: 'federated-learning',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 9,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '60-120 seconds',
        message: 'Federated learning is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process federated learning for user ${userId}:`, error);
      throw error;
    }
  }

  // Autonomous Execution
  async processAutonomousExecution(
    userId: string,
    executionDto: aiDtos.AutonomousExecutionDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing autonomous execution for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'autonomous-execution',
          taskType: executionDto.taskType,
          parameters: executionDto.parameters,
          requireApproval: executionDto.requireApproval || false,
        },
        correlationId,
        metadata: {
          requestType: 'autonomous-execution',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 10,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '10-30 seconds',
        message: 'Autonomous execution is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process autonomous execution for user ${userId}:`, error);
      throw error;
    }
  }

  // Performance Monitoring
  async processPerformanceMonitoring(
    userId: string,
    monitoringDto: aiDtos.PerformanceMonitoringDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing performance monitoring for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'performance-monitoring',
          metricType: monitoringDto.metricType,
          thresholds: monitoringDto.thresholds || {},
          alerts: monitoringDto.alerts || [],
        },
        correlationId,
        metadata: {
          requestType: 'performance-monitoring',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 5,
        attempts: 3,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '5-15 seconds',
        message: 'Performance monitoring is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process performance monitoring for user ${userId}:`, error);
      throw error;
    }
  }

  // Governance
  async processGovernance(
    userId: string,
    governanceDto: aiDtos.GovernanceDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing governance for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'governance',
          policyType: governanceDto.policyType,
          rules: governanceDto.rules || {},
          enforceCompliance: governanceDto.enforceCompliance || true,
        },
        correlationId,
        metadata: {
          requestType: 'governance',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 8,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '20-40 seconds',
        message: 'Governance analysis is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process governance for user ${userId}:`, error);
      throw error;
    }
  }

  // Error Handling
  async processErrorHandling(
    userId: string,
    errorDto: aiDtos.ErrorHandlingDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing error handling for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'error-handling',
          errorType: errorDto.errorType,
          context: errorDto.context || {},
          recoveryStrategy: errorDto.recoveryStrategy || 'automatic',
        },
        correlationId,
        metadata: {
          requestType: 'error-handling',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 9,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '5-15 seconds',
        message: 'Error handling is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process error handling for user ${userId}:`, error);
      throw error;
    }
  }

  // Edge Computing
  async processEdgeComputing(
    userId: string,
    edgeDto: aiDtos.EdgeComputingDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing edge computing for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'edge-computing',
          location: edgeDto.location,
          requirements: edgeDto.requirements || {},
          latencyThreshold: edgeDto.latencyThreshold || 100,
        },
        correlationId,
        metadata: {
          requestType: 'edge-computing',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 7,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '15-30 seconds',
        message: 'Edge computing is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process edge computing for user ${userId}:`, error);
      throw error;
    }
  }

  // Database Optimization
  async processDatabaseOptimization(
    userId: string,
    dbDto: aiDtos.DatabaseOptimizationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing database optimization for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'database-optimization',
          operation: dbDto.operation,
          parameters: dbDto.parameters || {},
          analyzeOnly: dbDto.analyzeOnly || false,
        },
        correlationId,
        metadata: {
          requestType: 'database-optimization',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '30-60 seconds',
        message: 'Database optimization is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process database optimization for user ${userId}:`, error);
      throw error;
    }
  }

  // Bulk Operations
  async processBulkOperations(
    userId: string,
    bulkDto: aiDtos.BulkOperationsDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing bulk operations for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'bulk-operations',
          operationType: bulkDto.operationType,
          items: bulkDto.items,
          options: bulkDto.options || {},
        },
        correlationId,
        metadata: {
          requestType: 'bulk-operations',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 3,
        attempts: 3,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '60-180 seconds',
        message: 'Bulk operations are being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process bulk operations for user ${userId}:`, error);
      throw error;
    }
  }

  // Delegation
  async processDelegation(
    userId: string,
    delegationDto: aiDtos.DelegationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing delegation for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'delegation',
          taskId: delegationDto.taskId,
          assigneeId: delegationDto.assigneeId,
          instructions: delegationDto.instructions || {},
        },
        correlationId,
        metadata: {
          requestType: 'delegation',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '5-15 seconds',
        message: 'Delegation is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process delegation for user ${userId}:`, error);
      throw error;
    }
  }

  // Approval
  async processApproval(
    userId: string,
    approvalDto: aiDtos.ApprovalDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing approval for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'approval',
          requestId: approvalDto.requestId,
          status: approvalDto.status,
          comments: approvalDto.comments || '',
        },
        correlationId,
        metadata: {
          requestType: 'approval',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 8,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '5-10 seconds',
        message: 'Approval is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process approval for user ${userId}:`, error);
      throw error;
    }
  }

  // Deployment
  async processDeployment(
    userId: string,
    deploymentDto: aiDtos.DeploymentDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing deployment for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'deployment',
          environment: deploymentDto.environment,
          configuration: deploymentDto.configuration || {},
          rollbackOnFailure: deploymentDto.rollbackOnFailure || true,
        },
        correlationId,
        metadata: {
          requestType: 'deployment',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 9,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '30-90 seconds',
        message: 'Deployment is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process deployment for user ${userId}:`, error);
      throw error;
    }
  }

  // Feedback
  async processFeedback(
    userId: string,
    feedbackDto: aiDtos.FeedbackDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing feedback for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'feedback',
          feedbackType: feedbackDto.feedbackType,
          data: feedbackDto.data,
          userId: feedbackDto.userId || userId,
        },
        correlationId,
        metadata: {
          requestType: 'feedback',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 4,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '10-20 seconds',
        message: 'Feedback is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process feedback for user ${userId}:`, error);
      throw error;
    }
  }

  // Health Check
  async processHealthCheck(
    userId: string,
    healthDto: aiDtos.HealthCheckDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing health check for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'health-check',
          components: healthDto.components || ['ai', 'database', 'queue', 'redis'],
          detailed: healthDto.detailed || false,
        },
        correlationId,
        metadata: {
          requestType: 'health-check',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 10,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '5-15 seconds',
        message: 'Health check is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process health check for user ${userId}:`, error);
      throw error;
    }
  }

  // Integration
  async processIntegration(
    userId: string,
    integrationDto: aiDtos.IntegrationDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing integration for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'integration',
          integrationType: integrationDto.integrationType,
          configuration: integrationDto.configuration || {},
          testMode: integrationDto.testMode || false,
        },
        correlationId,
        metadata: {
          requestType: 'integration',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 7,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '20-40 seconds',
        message: 'Integration is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process integration for user ${userId}:`, error);
      throw error;
    }
  }

  // ML Training
  async processMLTraining(
    userId: string,
    mlDto: aiDtos.MLTrainingDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing ML training for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'ml-training',
          modelType: mlDto.modelType,
          trainingData: mlDto.trainingData,
          hyperparameters: mlDto.hyperparameters || {},
        },
        correlationId,
        metadata: {
          requestType: 'ml-training',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 8,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '120-300 seconds',
        message: 'ML training is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process ML training for user ${userId}:`, error);
      throw error;
    }
  }

  // Permissions
  async processPermissions(
    userId: string,
    permissionsDto: aiDtos.PermissionsDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing permissions for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'permissions',
          userId: permissionsDto.userId,
          permissions: permissionsDto.permissions,
          resource: permissionsDto.resource || 'ai',
        },
        correlationId,
        metadata: {
          requestType: 'permissions',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 9,
        attempts: 1,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '5-10 seconds',
        message: 'Permissions are being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process permissions for user ${userId}:`, error);
      throw error;
    }
  }

  // Queue Management
  async processQueue(
    userId: string,
    queueDto: aiDtos.QueueDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing queue management for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'queue-management',
          queueName: queueDto.queueName,
          options: queueDto.options || {},
          priority: queueDto.priority || 5,
        },
        correlationId,
        metadata: {
          requestType: 'queue-management',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '10-20 seconds',
        message: 'Queue management is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process queue management for user ${userId}:`, error);
      throw error;
    }
  }

  // RAG (Retrieval Augmented Generation)
  async processRAG(
    userId: string,
    ragDto: aiDtos.RAGDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing RAG for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'rag',
          query: ragDto.query,
          sources: ragDto.sources || [],
          maxResults: ragDto.maxResults || 5,
        },
        correlationId,
        metadata: {
          requestType: 'rag',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '15-30 seconds',
        message: 'RAG is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process RAG for user ${userId}:`, error);
      throw error;
    }
  }

  // Reports
  async processReports(
    userId: string,
    reportsDto: aiDtos.ReportsDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing reports for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'reports',
          reportType: reportsDto.reportType,
          parameters: reportsDto.parameters || {},
          format: reportsDto.format || 'json',
        },
        correlationId,
        metadata: {
          requestType: 'reports',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 5,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '30-60 seconds',
        message: 'Reports are being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process reports for user ${userId}:`, error);
      throw error;
    }
  }

  // Strategic
  async processStrategic(
    userId: string,
    strategicDto: aiDtos.StrategicDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing strategic analysis for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'strategic',
          strategyType: strategicDto.strategyType,
          context: strategicDto.context || {},
          priority: strategicDto.priority || 3,
        },
        correlationId,
        metadata: {
          requestType: 'strategic',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 8,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '45-90 seconds',
        message: 'Strategic analysis is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process strategic analysis for user ${userId}:`, error);
      throw error;
    }
  }

  // Testing
  async processTesting(
    userId: string,
    testingDto: aiDtos.TestingDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing testing for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'testing',
          testType: testingDto.testType,
          testData: testingDto.testData,
          expectedResults: testingDto.expectedResults || {},
        },
        correlationId,
        metadata: {
          requestType: 'testing',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '20-40 seconds',
        message: 'Testing is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process testing for user ${userId}:`, error);
      throw error;
    }
  }

  // Workflow
  async processWorkflow(
    userId: string,
    workflowDto: aiDtos.WorkflowDto,
    correlationId?: string,
  ) {
    try {
      this.logger.log(`Processing workflow for user ${userId}`);

      const job = await this.queueService.addAITask({
        type: 'analysis',
        userId,
        input: {
          analysisType: 'workflow',
          workflowType: workflowDto.workflowType,
          configuration: workflowDto.configuration || {},
          autoExecute: workflowDto.autoExecute || false,
        },
        correlationId,
        metadata: {
          requestType: 'workflow',
          timestamp: new Date().toISOString(),
        },
      }, {
        priority: 7,
        attempts: 2,
      });

      return {
        jobId: job.id,
        status: 'processing',
        estimatedTime: '25-50 seconds',
        message: 'Workflow is being processed',
      };
    } catch (error) {
      this.logger.error(`Failed to process workflow for user ${userId}:`, error);
      throw error;
    }
  }
}