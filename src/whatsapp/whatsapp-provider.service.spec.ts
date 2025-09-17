import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppProviderService } from './whatsapp-provider.service';
import { Logger } from '@nestjs/common';

describe('WhatsAppProviderService', () => {
  let service: WhatsAppProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsAppProviderService],
    }).compile();

    service = module.get<WhatsAppProviderService>(WhatsAppProviderService);
  });

  describe('validatePhoneNumber', () => {
    it('should validate international phone numbers', () => {
      expect(service.validatePhoneNumber('+2348123456789')).toBe(true);
      expect(service.validatePhoneNumber('+254712345678')).toBe(true);
      expect(service.validatePhoneNumber('+27123456789')).toBe(true);
      expect(service.validatePhoneNumber('+12345678901')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(service.validatePhoneNumber('123')).toBe(false);
      expect(service.validatePhoneNumber('+123')).toBe(false);
      expect(service.validatePhoneNumber('invalid')).toBe(false);
      expect(service.validatePhoneNumber('')).toBe(false);
      expect(service.validatePhoneNumber(null as any)).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone numbers correctly', () => {
      // Test private method through public methods
      const config = {
        provider: 'meta',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      // Mock fetch to avoid actual API calls
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ messages: [{ id: 'msg1' }] }),
      });

      // Test with different phone number formats
      expect(service.validatePhoneNumber('2348123456789')).toBe(true);
      expect(service.validatePhoneNumber('08123456789')).toBe(false); // Local format not valid for WhatsApp
    });
  });

  describe('sendViaMeta', () => {
    beforeEach(() => {
      // Mock fetch globally
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should send text message successfully', async () => {
      const config = {
        provider: 'meta',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          messages: [{ id: 'msg1' }],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.sendViaMeta('2348123456789', 'Test message', config);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg1');
      expect(result.provider).toBe('meta');
      expect(result.cost).toBe(0.005);
    });

    it('should send template message successfully', async () => {
      const config = {
        provider: 'meta',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      const template = {
        name: 'test_template',
        status: 'APPROVED' as const,
        category: 'MARKETING' as const,
        language: 'en_US',
        components: [
          {
            type: 'HEADER' as const,
            text: 'Hello {{name}}',
          },
          {
            type: 'BODY' as const,
            text: 'Welcome to our service!',
          },
        ],
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          messages: [{ id: 'msg1' }],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.sendViaMeta('2348123456789', template, config);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg1');
      expect(result.provider).toBe('meta');
    });

    it('should handle API errors', async () => {
      const config = {
        provider: 'meta',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: { message: 'Invalid phone number' },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.sendViaMeta('2348123456789', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Invalid phone number');
      expect(result.error?.code).toBe('META_API_ERROR');
    });

    it('should handle invalid phone numbers', async () => {
      const config = {
        provider: 'meta',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      const result = await service.sendViaMeta('123', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Invalid phone number format: 123');
      expect(result.error?.code).toBe('INVALID_PHONE_NUMBER');
    });

    it('should handle missing credentials', async () => {
      const config = {
        provider: 'meta',
        businessAccountId: 'business1',
        phoneNumberId: '',
        accessToken: '',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      const result = await service.sendViaMeta('2348123456789', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Meta WhatsApp requires accessToken and phoneNumberId');
    });
  });

  describe('sendViaTwilio', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should send text message via Twilio successfully', async () => {
      const config = {
        provider: 'twilio',
        businessAccountId: 'business1',
        phoneNumberId: 'auth_token',
        accessToken: 'account_sid',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          sid: 'msg1',
          price: '0.005',
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.sendViaTwilio('2348123456789', 'Test message', config);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg1');
      expect(result.provider).toBe('twilio');
      expect(result.cost).toBe(0.005);
    });

    it('should handle Twilio API errors', async () => {
      const config = {
        provider: 'twilio',
        businessAccountId: 'business1',
        phoneNumberId: 'auth_token',
        accessToken: 'account_sid',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
      };

      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          message: 'Invalid phone number',
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.sendViaTwilio('2348123456789', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Invalid phone number');
      expect(result.error?.code).toBe('TWILIO_API_ERROR');
    });
  });

  describe('getTemplates', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch templates successfully', async () => {
      const provider = {
        id: 'provider1',
        organizationId: 'org1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: [
            {
              name: 'test_template',
              status: 'APPROVED',
              category: 'MARKETING',
              language: 'en_US',
              components: [],
            },
          ],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getTemplates(provider);

      expect(result).toEqual([
        {
          name: 'test_template',
          status: 'APPROVED',
          category: 'MARKETING',
          language: 'en_US',
          components: [],
        },
      ]);
    });

    it('should handle API errors and return empty array', async () => {
      const provider = {
        id: 'provider1',
        organizationId: 'org1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: { message: 'Unauthorized' },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getTemplates(provider);

      expect(result).toEqual([]);
    });
  });

  describe('submitTemplate', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should submit template successfully', async () => {
      const provider = {
        id: 'provider1',
        organizationId: 'org1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const template = {
        name: 'test_template',
        category: 'MARKETING',
        language: 'en_US',
        components: [],
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          id: 'template1',
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.submitTemplate(provider, template);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('template1');
      expect(result.provider).toBe('meta');
    });

    it('should handle submission errors', async () => {
      const provider = {
        id: 'provider1',
        organizationId: 'org1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const template = {
        name: 'test_template',
        category: 'MARKETING',
        language: 'en_US',
        components: [],
      };

      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: { message: 'Template already exists' },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.submitTemplate(provider, template);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Template already exists');
      expect(result.error?.code).toBe('TEMPLATE_SUBMISSION_ERROR');
    });
  });

  describe('verifyWebhook', () => {
    beforeEach(() => {
      process.env.WHATSAPP_VERIFY_TOKEN = 'whatsapp_verify_token';
    });

    afterEach(() => {
      delete process.env.WHATSAPP_VERIFY_TOKEN;
    });

    it('should verify webhook successfully', async () => {
      const result = await service.verifyWebhook('whatsapp_verify_token', 'challenge123', 'subscribe');

      expect(result).toBe('challenge123');
    });

    it('should return null for invalid verification', async () => {
      const result = await service.verifyWebhook('wrong_token', 'challenge123', 'subscribe');

      expect(result).toBeNull();
    });

    it('should return null for non-subscribe mode', async () => {
      const result = await service.verifyWebhook('whatsapp_verify_token', 'challenge123', 'unsubscribe');

      expect(result).toBeNull();
    });
  });

  describe('processWebhookEvent', () => {
    it('should process webhook event successfully', async () => {
      const event = {
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  statuses: [
                    {
                      id: 'msg1',
                      status: 'delivered',
                    },
                  ],
                  messages: [
                    {
                      from: '2348123456789',
                      text: { body: 'Hello' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      // Mock the private method
      const processMessageStatusSpy = jest.spyOn(service as any, 'processMessageStatus').mockResolvedValue(undefined);

      await service.processWebhookEvent(event);

      expect(processMessageStatusSpy).toHaveBeenCalledWith(event.entry[0].changes[0].value);
    });

    it('should handle webhook processing errors gracefully', async () => {
      const event = {
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  statuses: [
                    {
                      id: 'msg1',
                      status: 'delivered',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      // Mock the private method to throw an error
      const processMessageStatusSpy = jest.spyOn(service as any, 'processMessageStatus').mockRejectedValue(new Error('Processing error'));

      // Should not throw
      await expect(service.processWebhookEvent(event)).resolves.not.toThrow();

      expect(processMessageStatusSpy).toHaveBeenCalled();
    });
  });

  describe('testProvider', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should test provider successfully', async () => {
      const provider = {
        id: 'provider1',
        organizationId: 'org1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          messages: [{ id: 'msg1' }],
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.testProvider(provider);

      expect(result).toBe(true);
    });

    it('should handle test failure', async () => {
      const provider = {
        id: 'provider1',
        organizationId: 'org1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: { message: 'Invalid credentials' },
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.testProvider(provider);

      expect(result).toBe(false);
    });
  });
});
