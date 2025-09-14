import { Test, TestingModule } from '@nestjs/testing';
import { SMSProviderService } from '../sms-provider.service';
import { SMSProvider } from '@prisma/client';

describe('SMSProviderService', () => {
  let service: SMSProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SMSProviderService],
    }).compile();

    service = module.get<SMSProviderService>(SMSProviderService);
  });

  describe('sendViaAfricasTalking', () => {
    it('should send SMS via Africa\'s Talking successfully', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          SMSMessageData: {
            Recipients: [{
              status: 'Success',
              messageId: 'msg-123',
            }],
          },
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'africastalking',
        apiKey: 'test-key',
        username: 'test-user',
        senderId: 'MarketSage',
      };

      const result = await service.sendViaAfricasTalking('+2348123456789', 'Test message', config);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-123');
      expect(result.provider).toBe('africastalking');
      expect(result.cost).toBe(0.01);
    });

    it('should handle Africa\'s Talking API error', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: 'API Error',
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'africastalking',
        apiKey: 'test-key',
        username: 'test-user',
      };

      const result = await service.sendViaAfricasTalking('+2348123456789', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('API Error');
    });

    it('should validate phone number format', async () => {
      const config = {
        provider: 'africastalking',
        apiKey: 'test-key',
        username: 'test-user',
      };

      const result = await service.sendViaAfricasTalking('invalid-phone', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_PHONE_NUMBER');
    });
  });

  describe('sendViaTwilio', () => {
    it('should send SMS via Twilio successfully', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          sid: 'msg-123',
          price: '0.01',
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'twilio',
        apiKey: 'test-sid',
        apiSecret: 'test-token',
        senderId: '+1234567890',
      };

      const result = await service.sendViaTwilio('+2348123456789', 'Test message', config);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-123');
      expect(result.provider).toBe('twilio');
      expect(result.cost).toBe(0.01);
    });

    it('should handle Twilio API error', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: 'Twilio Error',
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'twilio',
        apiKey: 'test-sid',
        apiSecret: 'test-token',
        senderId: '+1234567890',
      };

      const result = await service.sendViaTwilio('+2348123456789', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Twilio Error');
    });
  });

  describe('sendViaTermii', () => {
    it('should send SMS via Termii successfully', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          code: 'ok',
          messageId: 'msg-123',
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'termii',
        apiKey: 'test-key',
        senderId: 'MarketSage',
      };

      const result = await service.sendViaTermii('+2348123456789', 'Test message', config);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-123');
      expect(result.provider).toBe('termii');
      expect(result.cost).toBe(0.015);
    });

    it('should handle Termii API error', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: 'Termii Error',
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'termii',
        apiKey: 'test-key',
      };

      const result = await service.sendViaTermii('+2348123456789', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Termii Error');
    });
  });

  describe('sendViaNexmo', () => {
    it('should send SMS via Nexmo successfully', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          messages: [{
            status: '0',
            'message-id': 'msg-123',
            'message-price': '0.01',
          }],
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'nexmo',
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        senderId: 'MarketSage',
      };

      const result = await service.sendViaNexmo('+2348123456789', 'Test message', config);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-123');
      expect(result.provider).toBe('nexmo');
      expect(result.cost).toBe(0.01);
    });

    it('should handle Nexmo API error', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          error_text: 'Nexmo Error',
        }),
      });

      global.fetch = mockFetch;

      const config = {
        provider: 'nexmo',
        apiKey: 'test-key',
        apiSecret: 'test-secret',
      };

      const result = await service.sendViaNexmo('+2348123456789', 'Test message', config);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Nexmo Error');
    });
  });

  describe('sendSMS', () => {
    it('should route to Africa\'s Talking provider', async () => {
      const mockProvider: SMSProvider = {
        id: 'provider-1',
        organizationId: 'org-1',
        provider: 'africastalking',
        credentials: JSON.stringify({
          apiKey: 'test-key',
          username: 'test-user',
        }),
        senderId: 'MarketSage',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          SMSMessageData: {
            Recipients: [{
              status: 'Success',
              messageId: 'msg-123',
            }],
          },
        }),
      });

      global.fetch = mockFetch;

      const result = await service.sendSMS('+2348123456789', 'Test message', mockProvider);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-123');
      expect(result.provider).toBe('africastalking');
    });

    it('should throw error for unsupported provider', async () => {
      const mockProvider: SMSProvider = {
        id: 'provider-1',
        organizationId: 'org-1',
        provider: 'unsupported' as any,
        credentials: JSON.stringify({}),
        senderId: 'MarketSage',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await service.sendSMS('+2348123456789', 'Test message', mockProvider);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Unsupported SMS provider');
    });
  });

  describe('testProvider', () => {
    it('should test provider successfully', async () => {
      const mockProvider: SMSProvider = {
        id: 'provider-1',
        organizationId: 'org-1',
        provider: 'africastalking',
        credentials: JSON.stringify({
          apiKey: 'test-key',
          username: 'test-user',
        }),
        senderId: 'MarketSage',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          SMSMessageData: {
            Recipients: [{
              status: 'Success',
              messageId: 'msg-123',
            }],
          },
        }),
      });

      global.fetch = mockFetch;

      const result = await service.testProvider(mockProvider);

      expect(result).toBe(true);
    });

    it('should handle provider test failure', async () => {
      const mockProvider: SMSProvider = {
        id: 'provider-1',
        organizationId: 'org-1',
        provider: 'africastalking',
        credentials: JSON.stringify({
          apiKey: 'invalid-key',
          username: 'invalid-user',
        }),
        senderId: 'MarketSage',
        isActive: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: 'API Error',
        }),
      });

      global.fetch = mockFetch;

      const result = await service.testProvider(mockProvider);

      expect(result).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate Nigerian phone numbers', () => {
      expect(service.validatePhoneNumber('+2348123456789')).toBe(true);
      expect(service.validatePhoneNumber('08123456789')).toBe(true);
      expect(service.validatePhoneNumber('8123456789')).toBe(true);
    });

    it('should validate other African phone numbers', () => {
      expect(service.validatePhoneNumber('+254712345678')).toBe(true); // Kenya
      expect(service.validatePhoneNumber('+27123456789')).toBe(true); // South Africa
      expect(service.validatePhoneNumber('+233123456789')).toBe(true); // Ghana
    });

    it('should validate US phone numbers', () => {
      expect(service.validatePhoneNumber('+12345678901')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(service.validatePhoneNumber('invalid')).toBe(false);
      expect(service.validatePhoneNumber('123')).toBe(false);
      expect(service.validatePhoneNumber('')).toBe(false);
      expect(service.validatePhoneNumber('+999123456789')).toBe(false); // Invalid country code
    });
  });
});
