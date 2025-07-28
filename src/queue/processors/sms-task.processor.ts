import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SMSTaskData } from '../queue.service';

@Processor('sms-tasks')
export class SMSTaskProcessor {
  private readonly logger = new Logger(SMSTaskProcessor.name);

  @Process('process-sms-task')
  async handleSMSTask(job: Job<SMSTaskData>) {
    this.logger.log(`Processing SMS task ${job.id} of type ${job.data.type} for user ${job.data.userId}`);
    
    try {
      const startTime = Date.now();
      let result: any;

      switch (job.data.type) {
        case 'send-single':
          result = await this.processSingleSMS(job.data);
          break;
        case 'send-campaign':
          result = await this.processCampaignSMS(job.data);
          break;
        default:
          throw new Error(`Unknown SMS task type: ${job.data.type}`);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`SMS task ${job.id} completed in ${duration}ms`);

      return {
        success: true,
        result,
        duration,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`SMS task ${job.id} failed: ${err.message}`);
      throw error;
    }
  }

  private async processSingleSMS(data: SMSTaskData): Promise<any> {
    this.logger.debug(`Sending single SMS to ${data.to} via ${data.provider || 'default'}`);
    
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      messageId: `sms_${Date.now()}`,
      status: 'sent',
      recipient: data.to,
      provider: data.provider || 'africastalking',
      length: data.message.length,
    };
  }

  private async processCampaignSMS(data: SMSTaskData): Promise<any> {
    this.logger.debug(`Sending campaign SMS to ${Array.isArray(data.to) ? data.to.length : 1} recipients`);
    
    // Simulate campaign SMS processing
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const recipients = Array.isArray(data.to) ? data.to : [data.to];
    
    return {
      campaignId: `sms_camp_${Date.now()}`,
      status: 'sent',
      recipientCount: recipients.length,
      provider: data.provider || 'africastalking',
      deliveryRate: 0.92,
      estimatedCost: recipients.length * 0.05, // $0.05 per SMS
    };
  }
}