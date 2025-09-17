import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessageDto, AnalysisRequestDto, PredictionRequestDto, ContentGenerationDto } from './ai.controller';

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
}