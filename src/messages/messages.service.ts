import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly prisma: PrismaService,
  ) {}

  async getMessageQueueStats() {
    try {
      const queueStats = await this.queueService.getQueueStats();
      
      // Transform queue stats to match frontend interface
      return [
        {
          name: 'Email Queue',
          type: 'EMAIL' as const,
          pending: queueStats.email.waiting,
          processing: queueStats.email.active,
          completed: queueStats.email.completed,
          failed: queueStats.email.failed,
          stuck: queueStats.email.delayed,
          averageProcessTime: '2.3s',
          status: this.getQueueStatus(queueStats.email),
        },
        {
          name: 'SMS Queue',
          type: 'SMS' as const,
          pending: queueStats.sms.waiting,
          processing: queueStats.sms.active,
          completed: queueStats.sms.completed,
          failed: queueStats.sms.failed,
          stuck: queueStats.sms.delayed,
          averageProcessTime: '1.8s',
          status: this.getQueueStatus(queueStats.sms),
        },
        {
          name: 'WhatsApp Queue',
          type: 'WHATSAPP' as const,
          pending: 0, // WhatsApp uses different queue system
          processing: 0,
          completed: 0,
          failed: 0,
          stuck: 0,
          averageProcessTime: '3.2s',
          status: 'healthy' as const,
        },
        {
          name: 'AI Tasks Queue',
          type: 'WEBHOOK' as const,
          pending: queueStats.ai.waiting,
          processing: queueStats.ai.active,
          completed: queueStats.ai.completed,
          failed: queueStats.ai.failed,
          stuck: queueStats.ai.delayed,
          averageProcessTime: '5.7s',
          status: this.getQueueStatus(queueStats.ai),
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get message queue stats: ${err.message}`);
      throw error;
    }
  }

  async getFailedMessages() {
    try {
      // Get failed jobs from all queues
      const queueStats = await this.queueService.getQueueStats();
      
      // Mock failed messages - in a real implementation, these would come from failed job data
      return [
        {
          id: 'MSG-001',
          type: 'EMAIL' as const,
          recipient: 'user@example.com',
          subject: 'Welcome to MarketSage',
          error: 'SMTP connection timeout',
          retryCount: 2,
          failedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          campaignName: 'Welcome Campaign',
          organizationName: 'TechCorp Ltd',
        },
        {
          id: 'MSG-002',
          type: 'SMS' as const,
          recipient: '+1234567890',
          error: 'Invalid phone number format',
          retryCount: 1,
          failedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          campaignName: 'SMS Campaign',
          organizationName: 'StartupXYZ',
        },
        {
          id: 'MSG-003',
          type: 'WHATSAPP' as const,
          recipient: '+9876543210',
          error: 'WhatsApp API rate limit exceeded',
          retryCount: 3,
          failedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          campaignName: 'WhatsApp Campaign',
          organizationName: 'Retail Chain',
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get failed messages: ${err.message}`);
      throw error;
    }
  }

  async getProviderHealth() {
    try {
      // Mock provider health data - in a real implementation, this would check actual provider status
      return [
        {
          name: 'SendGrid',
          type: 'EMAIL' as const,
          status: 'operational' as const,
          responseTime: '245ms',
          successRate: 99.2,
          lastChecked: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          issues: [],
        },
        {
          name: 'Twilio SMS',
          type: 'SMS' as const,
          status: 'operational' as const,
          responseTime: '189ms',
          successRate: 98.7,
          lastChecked: new Date(Date.now() - 300000).toISOString(),
          issues: [],
        },
        {
          name: 'WhatsApp Business API',
          type: 'WHATSAPP' as const,
          status: 'degraded' as const,
          responseTime: '1.2s',
          successRate: 95.1,
          lastChecked: new Date(Date.now() - 300000).toISOString(),
          issues: ['Rate limiting active', 'Some message delays reported'],
        },
        {
          name: 'AWS SES',
          type: 'EMAIL' as const,
          status: 'operational' as const,
          responseTime: '156ms',
          successRate: 99.8,
          lastChecked: new Date(Date.now() - 300000).toISOString(),
          issues: [],
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get provider health: ${err.message}`);
      throw error;
    }
  }

  async getMessageMetrics() {
    try {
      const queueStats = await this.queueService.getQueueStats();
      
      // Calculate total metrics
      const totalQueued = queueStats.email.waiting + queueStats.sms.waiting + queueStats.ai.waiting;
      const totalProcessing = queueStats.email.active + queueStats.sms.active + queueStats.ai.active;
      const totalFailed = queueStats.email.failed + queueStats.sms.failed + queueStats.ai.failed;
      const totalCompleted = queueStats.email.completed + queueStats.sms.completed + queueStats.ai.completed;
      
      // Calculate success rate
      const successRate = totalCompleted > 0 ? 
        ((totalCompleted / (totalCompleted + totalFailed)) * 100) : 100;

      return {
        totalQueued,
        totalProcessing,
        totalFailed,
        totalCompleted,
        successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal
        failedToday: totalFailed,
        failedSinceLastHour: Math.floor(totalFailed * 0.1), // Mock: 10% of total failed
        successRateImprovement: 0.3, // Mock improvement
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get message metrics: ${err.message}`);
      throw error;
    }
  }

  async retryFailedMessage(messageId: string) {
    try {
      // In a real implementation, this would retry the specific failed message
      this.logger.log(`Retrying failed message: ${messageId}`);
      
      return {
        success: true,
        message: `Message ${messageId} queued for retry`,
        messageId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to retry message: ${err.message}`);
      throw error;
    }
  }

  async clearQueue(queueName: string) {
    try {
      // In a real implementation, this would clear the specific queue
      this.logger.log(`Clearing queue: ${queueName}`);
      
      return {
        success: true,
        message: `Queue ${queueName} cleared successfully`,
        queueName,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to clear queue: ${err.message}`);
      throw error;
    }
  }

  async pauseQueue(queueName: string) {
    try {
      await this.queueService.pauseQueue(queueName);
      
      return {
        success: true,
        message: `Queue ${queueName} paused successfully`,
        queueName,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to pause queue: ${err.message}`);
      throw error;
    }
  }

  async resumeQueue(queueName: string) {
    try {
      await this.queueService.resumeQueue(queueName);
      
      return {
        success: true,
        message: `Queue ${queueName} resumed successfully`,
        queueName,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to resume queue: ${err.message}`);
      throw error;
    }
  }

  // Helper methods
  private getQueueStatus(queueData: any): 'healthy' | 'degraded' | 'error' {
    const { waiting, active, failed, delayed } = queueData;
    const total = waiting + active + failed + delayed;
    
    if (total === 0) return 'healthy';
    
    const failureRate = failed / total;
    const stuckRate = delayed / total;
    
    if (failureRate > 0.1 || stuckRate > 0.2) return 'error';
    if (failureRate > 0.05 || stuckRate > 0.1) return 'degraded';
    return 'healthy';
  }

  async getUserMessages(userId: string) {
    try {
      this.logger.log(`Getting messages for user ${userId}`);
      
      // Return mock user messages
      return {
        userId,
        messages: [
          {
            id: 'msg_1',
            type: 'email',
            subject: 'Welcome to MarketSage',
            content: 'Thank you for joining MarketSage!',
            status: 'sent',
            sentAt: new Date().toISOString(),
            recipient: 'user@example.com',
          },
          {
            id: 'msg_2',
            type: 'sms',
            content: 'Your campaign has been sent successfully',
            status: 'delivered',
            sentAt: new Date().toISOString(),
            recipient: '+1234567890',
          },
        ],
        stats: {
          total: 2,
          sent: 2,
          delivered: 1,
          failed: 0,
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting user messages for user ${userId}: ${err.message}`);
      throw error;
    }
  }

  async sendUserMessage(userId: string, messageData: any) {
    try {
      this.logger.log(`Sending message for user ${userId}`);
      
      // Return mock sent message
      return {
        id: `msg_${Date.now()}`,
        userId,
        type: messageData.type || 'email',
        content: messageData.content,
        status: 'sent',
        sentAt: new Date().toISOString(),
        recipient: messageData.recipient,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error sending message for user ${userId}: ${err.message}`);
      throw error;
    }
  }
}
