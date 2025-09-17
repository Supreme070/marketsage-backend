import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppBusinessConfig } from '@prisma/client';

export interface WhatsAppProviderConfig {
  provider: string;
  businessAccountId: string;
  phoneNumberId: string;
  accessToken: string;
  webhookUrl: string;
  verifyToken: string;
  phoneNumber?: string;
  displayName?: string;
}

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: {
    message: string;
    code?: string;
  };
  cost?: number;
  provider?: string;
}

export interface WhatsAppTemplate {
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DISABLED';
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  language: string;
  components: {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    text?: string;
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    buttons?: {
      type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
      text: string;
      url?: string;
      phone_number?: string;
    }[];
  }[];
}

export interface WhatsAppProviderInterface {
  name: string;
  sendMessage(phoneNumber: string, message: string | WhatsAppTemplate, config: WhatsAppProviderConfig): Promise<WhatsAppResult>;
  validatePhoneNumber(phoneNumber: string): boolean;
  testConnection(config: WhatsAppProviderConfig): Promise<boolean>;
  getTemplates(config: WhatsAppProviderConfig): Promise<WhatsAppTemplate[]>;
  submitTemplate(config: WhatsAppProviderConfig, template: any): Promise<WhatsAppResult>;
}

@Injectable()
export class WhatsAppProviderService {
  private readonly logger = new Logger(WhatsAppProviderService.name);

  // Meta WhatsApp Business API Provider
  async sendViaMeta(
    phoneNumber: string,
    message: string | WhatsAppTemplate,
    config: WhatsAppProviderConfig
  ): Promise<WhatsAppResult> {
    try {
      if (!config.accessToken || !config.phoneNumberId) {
        throw new Error('Meta WhatsApp requires accessToken and phoneNumberId');
      }

      // Validate phone number
      if (!this.validatePhoneNumber(phoneNumber)) {
        return {
          success: false,
          error: {
            message: `Invalid phone number format: ${phoneNumber}`,
            code: 'INVALID_PHONE_NUMBER'
          }
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;

      let requestBody: any;

      if (typeof message === 'string') {
        // Text message
        requestBody = {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            body: message
          }
        };
      } else {
        // Template message
        requestBody = {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: {
            name: message.name,
            language: {
              code: message.language || 'en_US'
            },
            components: message.components.map(comp => ({
              type: comp.type.toLowerCase(),
              ...(comp.text && { text: comp.text }),
              ...(comp.format && { format: comp.format.toLowerCase() }),
              ...(comp.buttons && { buttons: comp.buttons })
            }))
          }
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Meta WhatsApp API request failed');
      }

      return {
        success: true,
        messageId: responseData.messages?.[0]?.id || `meta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        provider: 'meta',
        cost: 0.005 // Approximate cost per WhatsApp message
      };

    } catch (error) {
      this.logger.error('Meta WhatsApp error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Meta WhatsApp sending failed',
          code: 'META_API_ERROR'
        }
      };
    }
  }

  // Twilio WhatsApp Provider
  async sendViaTwilio(
    phoneNumber: string,
    message: string | WhatsAppTemplate,
    config: WhatsAppProviderConfig
  ): Promise<WhatsAppResult> {
    try {
      if (!config.accessToken || !config.phoneNumberId) {
        throw new Error('Twilio WhatsApp requires accessToken (Account SID) and phoneNumberId (Auth Token)');
      }

      if (!this.validatePhoneNumber(phoneNumber)) {
        return {
          success: false,
          error: {
            message: `Invalid phone number format: ${phoneNumber}`,
            code: 'INVALID_PHONE_NUMBER'
          }
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const fromNumber = `whatsapp:${config.phoneNumber || process.env.TWILIO_WHATSAPP_NUMBER}`;

      if (!fromNumber) {
        throw new Error('Twilio WhatsApp from number is required');
      }

      const auth = Buffer.from(`${config.accessToken}:${config.phoneNumberId}`).toString('base64');

      let requestBody: any;

      if (typeof message === 'string') {
        requestBody = {
          To: `whatsapp:${formattedPhone}`,
          From: fromNumber,
          Body: message
        };
      } else {
        // For Twilio, we'll send template as text for now
        requestBody = {
          To: `whatsapp:${formattedPhone}`,
          From: fromNumber,
          Body: message.components.find(c => c.type === 'BODY')?.text || 'Template message'
        };
      }

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.accessToken}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Twilio WhatsApp API request failed');
      }

      return {
        success: true,
        messageId: responseData.sid,
        provider: 'twilio',
        cost: parseFloat(responseData.price || '0.005')
      };

    } catch (error) {
      this.logger.error('Twilio WhatsApp error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Twilio WhatsApp sending failed',
          code: 'TWILIO_API_ERROR'
        }
      };
    }
  }

  // Main WhatsApp sending method that routes to appropriate provider
  async sendMessage(
    phoneNumber: string,
    message: string | WhatsAppTemplate,
    provider: WhatsAppBusinessConfig
  ): Promise<WhatsAppResult> {
    try {
      const config: WhatsAppProviderConfig = {
        provider: 'meta', // Default to Meta for now
        businessAccountId: provider.businessAccountId,
        phoneNumberId: provider.phoneNumberId,
        accessToken: provider.accessToken,
        webhookUrl: provider.webhookUrl,
        verifyToken: provider.verifyToken,
        phoneNumber: provider.phoneNumber || undefined,
        displayName: provider.displayName || undefined,
      };

      this.logger.log(`Sending WhatsApp message via Meta to ${phoneNumber}`);

      return await this.sendViaMeta(phoneNumber, message, config);
    } catch (error) {
      this.logger.error('WhatsApp sending error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'WhatsApp sending failed',
          code: 'WHATSAPP_SENDING_ERROR'
        }
      };
    }
  }

  // Test provider connection
  async testProvider(provider: WhatsAppBusinessConfig): Promise<boolean> {
    try {
      const config: WhatsAppProviderConfig = {
        provider: 'meta',
        businessAccountId: provider.businessAccountId,
        phoneNumberId: provider.phoneNumberId,
        accessToken: provider.accessToken,
        webhookUrl: provider.webhookUrl,
        verifyToken: provider.verifyToken,
        phoneNumber: provider.phoneNumber || undefined,
        displayName: provider.displayName || undefined,
      };

      // Test by sending a message to a test number
      const testNumber = '+2348123456789'; // Test Nigerian number
      const testMessage = 'Test WhatsApp message from MarketSage - Please ignore';

      const result = await this.sendMessage(testNumber, testMessage, provider);
      return result.success;
    } catch (error) {
      this.logger.error('Provider test error:', error);
      return false;
    }
  }

  // Get templates from Meta WhatsApp Business API
  async getTemplates(provider: WhatsAppBusinessConfig): Promise<WhatsAppTemplate[]> {
    try {
      const url = `https://graph.facebook.com/v18.0/${provider.businessAccountId}/message_templates`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${provider.accessToken}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Failed to fetch templates');
      }

      return responseData.data?.map((template: any) => ({
        name: template.name,
        status: template.status,
        category: template.category,
        language: template.language,
        components: template.components || []
      })) || [];

    } catch (error) {
      this.logger.error('Error fetching templates:', error);
      return [];
    }
  }

  // Submit template to Meta WhatsApp Business API
  async submitTemplate(provider: WhatsAppBusinessConfig, template: any): Promise<WhatsAppResult> {
    try {
      const url = `https://graph.facebook.com/v18.0/${provider.businessAccountId}/message_templates`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provider.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Failed to submit template');
      }

      return {
        success: true,
        messageId: responseData.id,
        provider: 'meta'
      };

    } catch (error) {
      this.logger.error('Error submitting template:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Template submission failed',
          code: 'TEMPLATE_SUBMISSION_ERROR'
        }
      };
    }
  }

  // Enhanced phone number validation for WhatsApp (international format required)
  validatePhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }
    
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // WhatsApp requires international format
    if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 15) {
      return false;
    }
    
    // Must start with country code
    if (!cleanPhoneNumber.startsWith('234') && !cleanPhoneNumber.startsWith('254') && 
        !cleanPhoneNumber.startsWith('27') && !cleanPhoneNumber.startsWith('233') &&
        !cleanPhoneNumber.startsWith('1')) {
      return false;
    }
    
    return true;
  }

  private formatPhoneNumber(phoneNumber: string): string {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // If already has country code, return as is
    if (cleanPhoneNumber.startsWith('234') || cleanPhoneNumber.startsWith('254') || 
        cleanPhoneNumber.startsWith('27') || cleanPhoneNumber.startsWith('233')) {
      return cleanPhoneNumber;
    }
    
    // Default to Nigerian country code for local numbers
    if (cleanPhoneNumber.startsWith('0')) {
      return '234' + cleanPhoneNumber.substring(1);
    }
    
    if (cleanPhoneNumber.length === 10) {
      return '234' + cleanPhoneNumber;
    }
    
    return cleanPhoneNumber;
  }

  // Webhook verification for Meta WhatsApp
  async verifyWebhook(verifyToken: string, challenge: string, mode: string): Promise<string | null> {
    if (mode === 'subscribe' && verifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
      return challenge;
    }
    return null;
  }

  // Process webhook events from Meta WhatsApp
  async processWebhookEvent(event: any): Promise<void> {
    try {
      if (event.entry) {
        for (const entry of event.entry) {
          if (entry.changes) {
            for (const change of entry.changes) {
              if (change.field === 'messages') {
                await this.processMessageStatus(change.value);
              }
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing webhook event:', error);
    }
  }

  private async processMessageStatus(value: any): Promise<void> {
    try {
      // Process message status updates (delivered, read, failed)
      if (value.statuses) {
        for (const status of value.statuses) {
          this.logger.log(`Message ${status.id} status: ${status.status}`);
          // Here you would update your database with the message status
          // This would typically involve updating WhatsAppHistory table
        }
      }

      // Process incoming messages
      if (value.messages) {
        for (const message of value.messages) {
          this.logger.log(`Received message from ${message.from}: ${message.text?.body || 'Media message'}`);
          // Here you would process incoming messages
          // This could trigger automated responses or update contact information
        }
      }
    } catch (error) {
      this.logger.error('Error processing message status:', error);
    }
  }
}

