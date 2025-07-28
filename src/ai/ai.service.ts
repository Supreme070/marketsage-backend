import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { ChatMessageDto, AnalysisRequestDto, PredictionRequestDto, ContentGenerationDto } from './ai.controller';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(private readonly queueService: QueueService) {}

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
}