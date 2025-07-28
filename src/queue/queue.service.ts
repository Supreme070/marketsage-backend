import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

export interface AITaskData {
  type: 'chat' | 'analysis' | 'prediction' | 'content-generation';
  userId: string;
  input: any;
  metadata?: Record<string, any>;
  correlationId?: string;
}

export interface EmailTaskData {
  type: 'send-single' | 'send-campaign' | 'send-transactional';
  to: string | string[];
  subject: string;
  content: string;
  templateId?: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface SMSTaskData {
  type: 'send-single' | 'send-campaign';
  to: string | string[];
  message: string;
  userId: string;
  provider?: string;
  metadata?: Record<string, any>;
}

export interface NotificationTaskData {
  type: 'create' | 'broadcast' | 'system';
  userId?: string;
  title: string;
  message: string;
  category?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('ai-tasks') private aiQueue: Queue<AITaskData>,
    @InjectQueue('email-tasks') private emailQueue: Queue<EmailTaskData>,
    @InjectQueue('sms-tasks') private smsQueue: Queue<SMSTaskData>,
    @InjectQueue('notification-tasks') private notificationQueue: Queue<NotificationTaskData>,
  ) {}

  // AI Task Methods
  async addAITask(
    data: AITaskData,
    options?: {
      priority?: number;
      delay?: number;
      attempts?: number;
    }
  ): Promise<Job<AITaskData>> {
    const job = await this.aiQueue.add('process-ai-task', data, {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
      attempts: options?.attempts || 3,
    });

    this.logger.log(`Added AI task ${job.id} of type ${data.type} for user ${data.userId}`);
    return job;
  }

  async addAIChatTask(
    userId: string,
    input: any,
    correlationId?: string,
    priority: number = 5
  ): Promise<Job<AITaskData>> {
    return this.addAITask({
      type: 'chat',
      userId,
      input,
      correlationId,
      metadata: { timestamp: new Date().toISOString() }
    }, { priority });
  }

  // Email Task Methods
  async addEmailTask(
    data: EmailTaskData,
    options?: {
      priority?: number;
      delay?: number;
    }
  ): Promise<Job<EmailTaskData>> {
    const job = await this.emailQueue.add('process-email-task', data, {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
    });

    this.logger.log(`Added email task ${job.id} of type ${data.type} for user ${data.userId}`);
    return job;
  }

  // SMS Task Methods
  async addSMSTask(
    data: SMSTaskData,
    options?: {
      priority?: number;
      delay?: number;
    }
  ): Promise<Job<SMSTaskData>> {
    const job = await this.smsQueue.add('process-sms-task', data, {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
    });

    this.logger.log(`Added SMS task ${job.id} of type ${data.type} for user ${data.userId}`);
    return job;
  }

  // Notification Task Methods
  async addNotificationTask(
    data: NotificationTaskData,
    options?: {
      priority?: number;
      delay?: number;
    }
  ): Promise<Job<NotificationTaskData>> {
    const job = await this.notificationQueue.add('process-notification-task', data, {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
    });

    this.logger.log(`Added notification task ${job.id} of type ${data.type}`);
    return job;
  }

  // Queue Status Methods
  async getQueueStats() {
    const [aiStats, emailStats, smsStats, notificationStats] = await Promise.all([
      this.getQueueStatus(this.aiQueue, 'AI'),
      this.getQueueStatus(this.emailQueue, 'Email'),
      this.getQueueStatus(this.smsQueue, 'SMS'),
      this.getQueueStatus(this.notificationQueue, 'Notification'),
    ]);

    return {
      ai: aiStats,
      email: emailStats,
      sms: smsStats,
      notification: notificationStats,
    };
  }

  private async getQueueStatus(queue: Queue, name: string) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    return {
      name,
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    };
  }

  // Job Management
  async getJob(queueName: string, jobId: string): Promise<Job | null> {
    let queue: Queue;
    
    switch (queueName) {
      case 'ai-tasks':
        queue = this.aiQueue;
        break;
      case 'email-tasks':
        queue = this.emailQueue;
        break;
      case 'sms-tasks':
        queue = this.smsQueue;
        break;
      case 'notification-tasks':
        queue = this.notificationQueue;
        break;
      default:
        return null;
    }

    return queue.getJob(jobId);
  }

  async removeJob(queueName: string, jobId: string): Promise<boolean> {
    const job = await this.getJob(queueName, jobId);
    if (job) {
      await job.remove();
      this.logger.log(`Removed job ${jobId} from queue ${queueName}`);
      return true;
    }
    return false;
  }

  async retryJob(queueName: string, jobId: string): Promise<boolean> {
    const job = await this.getJob(queueName, jobId);
    if (job) {
      await job.retry();
      this.logger.log(`Retried job ${jobId} in queue ${queueName}`);
      return true;
    }
    return false;
  }

  // Bulk Operations
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueueByName(queueName);
    if (queue) {
      await queue.pause();
      this.logger.log(`Paused queue: ${queueName}`);
    }
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueueByName(queueName);
    if (queue) {
      await queue.resume();
      this.logger.log(`Resumed queue: ${queueName}`);
    }
  }

  private getQueueByName(queueName: string): Queue | null {
    switch (queueName) {
      case 'ai-tasks':
        return this.aiQueue;
      case 'email-tasks':
        return this.emailQueue;
      case 'sms-tasks':
        return this.smsQueue;
      case 'notification-tasks':
        return this.notificationQueue;
      default:
        return null;
    }
  }
}