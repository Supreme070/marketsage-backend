import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailTaskData } from '../queue.service';

@Processor('email-tasks')
export class EmailTaskProcessor {
  private readonly logger = new Logger(EmailTaskProcessor.name);

  @Process('process-email-task')
  async handleEmailTask(job: Job<EmailTaskData>) {
    this.logger.log(`Processing email task ${job.id} of type ${job.data.type} for user ${job.data.userId}`);
    
    try {
      const startTime = Date.now();
      let result: any;

      switch (job.data.type) {
        case 'send-single':
          result = await this.processSingleEmail(job.data);
          break;
        case 'send-campaign':
          result = await this.processCampaignEmail(job.data);
          break;
        case 'send-transactional':
          result = await this.processTransactionalEmail(job.data);
          break;
        default:
          throw new Error(`Unknown email task type: ${job.data.type}`);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Email task ${job.id} completed in ${duration}ms`);

      return {
        success: true,
        result,
        duration,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Email task ${job.id} failed: ${err.message}`);
      throw error;
    }
  }

  private async processSingleEmail(data: EmailTaskData): Promise<any> {
    this.logger.debug(`Sending single email to ${data.to}`);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      messageId: `msg_${Date.now()}`,
      status: 'sent',
      recipient: data.to,
      subject: data.subject,
    };
  }

  private async processCampaignEmail(data: EmailTaskData): Promise<any> {
    this.logger.debug(`Sending campaign email to ${Array.isArray(data.to) ? data.to.length : 1} recipients`);
    
    // Simulate campaign processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const recipients = Array.isArray(data.to) ? data.to : [data.to];
    
    return {
      campaignId: `camp_${Date.now()}`,
      status: 'sent',
      recipientCount: recipients.length,
      subject: data.subject,
      deliveryRate: 0.95,
    };
  }

  private async processTransactionalEmail(data: EmailTaskData): Promise<any> {
    this.logger.debug(`Sending transactional email to ${data.to}`);
    
    // Simulate transactional email processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      messageId: `txn_${Date.now()}`,
      status: 'sent',
      recipient: data.to,
      subject: data.subject,
      type: 'transactional',
    };
  }
}