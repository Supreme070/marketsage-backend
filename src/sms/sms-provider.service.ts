import { Injectable, Logger } from '@nestjs/common';
import { SMSProvider } from '@prisma/client';

export interface SMSProviderConfig {
  provider: string;
  apiKey?: string;
  apiSecret?: string;
  username?: string;
  password?: string;
  senderId?: string;
  baseUrl?: string;
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: {
    message: string;
    code?: string;
  };
  cost?: number;
  provider?: string;
}

export interface SMSProviderInterface {
  name: string;
  sendSMS(phoneNumber: string, message: string, config: SMSProviderConfig): Promise<SMSResult>;
  validatePhoneNumber(phoneNumber: string): boolean;
  testConnection(config: SMSProviderConfig): Promise<boolean>;
}

@Injectable()
export class SMSProviderService {
  private readonly logger = new Logger(SMSProviderService.name);

  // Africa's Talking SMS Provider
  async sendViaAfricasTalking(
    phoneNumber: string,
    message: string,
    config: SMSProviderConfig
  ): Promise<SMSResult> {
    try {
      if (!config.apiKey || !config.username) {
        throw new Error('Africa\'s Talking requires apiKey and username');
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
      const senderId = config.senderId || 'MarketSage';

      const requestBody = {
        username: config.username,
        to: formattedPhone,
        message: message,
        from: senderId
      };

      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': config.apiKey
        },
        body: new URLSearchParams(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Africa\'s Talking API request failed');
      }

      const recipient = responseData.SMSMessageData?.Recipients?.[0];
      if (recipient && recipient.status === 'Success') {
        return {
          success: true,
          messageId: recipient.messageId || `at_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          provider: 'africastalking',
          cost: 0.01 // Approximate cost per SMS
        };
      } else {
        return {
          success: false,
          error: {
            message: recipient?.status || 'Unknown error from Africa\'s Talking',
            code: 'AFRICASTALKING_ERROR'
          }
        };
      }

    } catch (error) {
      this.logger.error('Africa\'s Talking SMS error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Africa\'s Talking SMS sending failed',
          code: 'AFRICASTALKING_API_ERROR'
        }
      };
    }
  }

  // Twilio SMS Provider
  async sendViaTwilio(
    phoneNumber: string,
    message: string,
    config: SMSProviderConfig
  ): Promise<SMSResult> {
    try {
      if (!config.apiKey || !config.apiSecret) {
        throw new Error('Twilio requires apiKey (Account SID) and apiSecret (Auth Token)');
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
      const fromNumber = config.senderId || process.env.TWILIO_PHONE_NUMBER;

      if (!fromNumber) {
        throw new Error('Twilio from number (senderId) is required');
      }

      const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.apiKey}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: fromNumber,
          Body: message
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Twilio API request failed');
      }

      return {
        success: true,
        messageId: responseData.sid,
        provider: 'twilio',
        cost: parseFloat(responseData.price || '0.01')
      };

    } catch (error) {
      this.logger.error('Twilio SMS error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Twilio SMS sending failed',
          code: 'TWILIO_API_ERROR'
        }
      };
    }
  }

  // Termii SMS Provider (Nigerian provider)
  async sendViaTermii(
    phoneNumber: string,
    message: string,
    config: SMSProviderConfig
  ): Promise<SMSResult> {
    try {
      if (!config.apiKey) {
        throw new Error('Termii requires apiKey');
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
      const senderId = config.senderId || 'MarketSage';

      const requestBody = {
        to: formattedPhone,
        from: senderId,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: config.apiKey
      };

      const response = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Termii API request failed');
      }

      if (responseData.code === 'ok') {
        return {
          success: true,
          messageId: responseData.messageId || `termii_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          provider: 'termii',
          cost: 0.015 // Approximate cost per SMS
        };
      } else {
        return {
          success: false,
          error: {
            message: responseData.message || 'Unknown error from Termii',
            code: 'TERMII_ERROR'
          }
        };
      }

    } catch (error) {
      this.logger.error('Termii SMS error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Termii SMS sending failed',
          code: 'TERMII_API_ERROR'
        }
      };
    }
  }

  // Nexmo/Vonage SMS Provider
  async sendViaNexmo(
    phoneNumber: string,
    message: string,
    config: SMSProviderConfig
  ): Promise<SMSResult> {
    try {
      if (!config.apiKey || !config.apiSecret) {
        throw new Error('Nexmo requires apiKey and apiSecret');
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
      const fromNumber = config.senderId || 'MarketSage';

      const requestBody = {
        api_key: config.apiKey,
        api_secret: config.apiSecret,
        to: formattedPhone,
        from: fromNumber,
        text: message
      };

      const response = await fetch('https://rest.nexmo.com/sms/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error_text || 'Nexmo API request failed');
      }

      const messageData = responseData.messages?.[0];
      if (messageData && messageData.status === '0') {
        return {
          success: true,
          messageId: messageData['message-id'],
          provider: 'nexmo',
          cost: parseFloat(messageData['message-price'] || '0.01')
        };
      } else {
        return {
          success: false,
          error: {
            message: messageData['error-text'] || 'Unknown error from Nexmo',
            code: 'NEXMO_ERROR'
          }
        };
      }

    } catch (error) {
      this.logger.error('Nexmo SMS error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Nexmo SMS sending failed',
          code: 'NEXMO_API_ERROR'
        }
      };
    }
  }

  // Main SMS sending method that routes to appropriate provider
  async sendSMS(
    phoneNumber: string,
    message: string,
    provider: SMSProvider
  ): Promise<SMSResult> {
    try {
      const credentials = JSON.parse(provider.credentials as string);
      const config: SMSProviderConfig = {
        provider: provider.provider,
        ...credentials
      };

      this.logger.log(`Sending SMS via ${provider.provider} to ${phoneNumber}`);

      switch (provider.provider) {
        case 'africastalking':
          return await this.sendViaAfricasTalking(phoneNumber, message, config);
        case 'twilio':
          return await this.sendViaTwilio(phoneNumber, message, config);
        case 'termii':
          return await this.sendViaTermii(phoneNumber, message, config);
        case 'nexmo':
          return await this.sendViaNexmo(phoneNumber, message, config);
        default:
          throw new Error(`Unsupported SMS provider: ${provider.provider}`);
      }
    } catch (error) {
      this.logger.error('SMS sending error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'SMS sending failed',
          code: 'SMS_SENDING_ERROR'
        }
      };
    }
  }

  // Test provider connection
  async testProvider(provider: SMSProvider): Promise<boolean> {
    try {
      const credentials = JSON.parse(provider.credentials as string);
      const config: SMSProviderConfig = {
        provider: provider.provider,
        ...credentials
      };

      // Send a test SMS to a test number (you might want to use a dedicated test number)
      const testNumber = '+2348123456789'; // Test Nigerian number
      const testMessage = 'Test SMS from MarketSage - Please ignore';

      const result = await this.sendSMS(testNumber, testMessage, provider);
      return result.success;
    } catch (error) {
      this.logger.error('Provider test error:', error);
      return false;
    }
  }

  // Enhanced phone number validation for African markets
  validatePhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }
    
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid length (typically 10-15 digits)
    if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 15) {
      return false;
    }
    
    // Enhanced country codes with specific validations (African + US)
    const countryValidation = [
      { code: '234', minLength: 13, maxLength: 13 }, // Nigeria: +234XXXXXXXXXX
      { code: '254', minLength: 12, maxLength: 12 }, // Kenya: +254XXXXXXXXX
      { code: '27', minLength: 11, maxLength: 11 },   // South Africa: +27XXXXXXXXX
      { code: '233', minLength: 12, maxLength: 12 },  // Ghana: +233XXXXXXXXX
      { code: '256', minLength: 12, maxLength: 12 },  // Uganda: +256XXXXXXXXX
      { code: '255', minLength: 12, maxLength: 12 },  // Tanzania: +255XXXXXXXXX
      { code: '237', minLength: 12, maxLength: 12 },  // Cameroon: +237XXXXXXXXX
      { code: '225', minLength: 12, maxLength: 12 },  // Ivory Coast: +225XXXXXXXXX
      { code: '223', minLength: 11, maxLength: 11 },  // Mali: +223XXXXXXXX
      { code: '221', minLength: 12, maxLength: 12 },  // Senegal: +221XXXXXXXXX
      { code: '1', minLength: 11, maxLength: 11 },     // US/Canada: +1XXXXXXXXXX
    ];
    
    // Check for international format with country codes
    for (const country of countryValidation) {
      if (cleanPhoneNumber.startsWith(country.code)) {
        return cleanPhoneNumber.length >= country.minLength && 
               cleanPhoneNumber.length <= country.maxLength;
      }
    }
    
    // Check for local Nigerian numbers (most common market)
    if (cleanPhoneNumber.startsWith('0') && cleanPhoneNumber.length === 11) {
      // Validate Nigerian network prefixes (080, 081, 070, 090, 091, etc.)
      const nigerianPrefixes = ['080', '081', '070', '090', '091', '071', '082', '083', '084', '085', '086', '087', '088', '089'];
      const prefix = cleanPhoneNumber.substring(1, 4); // Get digits 1-3 (after removing 0)
      return nigerianPrefixes.includes(prefix);
    }
    
    // Check for Nigerian numbers without leading 0
    if (!cleanPhoneNumber.startsWith('0') && cleanPhoneNumber.length === 10) {
      const nigerianPrefixes = ['80', '81', '70', '90', '91', '71', '82', '83', '84', '85', '86', '87', '88', '89'];
      const prefix = cleanPhoneNumber.substring(0, 2);
      return nigerianPrefixes.includes(prefix);
    }
    
    return false;
  }

  private formatPhoneNumber(phoneNumber: string): string {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // If already has country code, return as is
    if (cleanPhoneNumber.startsWith('234') || cleanPhoneNumber.startsWith('254') || 
        cleanPhoneNumber.startsWith('27') || cleanPhoneNumber.startsWith('233')) {
      return '+' + cleanPhoneNumber;
    }
    
    // Default to Nigerian country code for local numbers
    if (cleanPhoneNumber.startsWith('0')) {
      return '+234' + cleanPhoneNumber.substring(1);
    }
    
    if (cleanPhoneNumber.length === 10) {
      return '+234' + cleanPhoneNumber;
    }
    
    return '+' + cleanPhoneNumber;
  }
}
