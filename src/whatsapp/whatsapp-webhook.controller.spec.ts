import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppWebhookController } from './whatsapp-webhook.controller';
import { WhatsAppService } from './whatsapp.service';

describe('WhatsAppWebhookController', () => {
  let controller: WhatsAppWebhookController;
  let service: WhatsAppService;

  const mockWhatsAppService = {
    handleWebhookEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsAppWebhookController],
      providers: [
        {
          provide: WhatsAppService,
          useValue: mockWhatsAppService,
        },
      ],
    }).compile();

    controller = module.get<WhatsAppWebhookController>(WhatsAppWebhookController);
    service = module.get<WhatsAppService>(WhatsAppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleWebhook', () => {
    it('should handle webhook event successfully', async () => {
      const organizationId = 'org1';
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
                      timestamp: '1234567890',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      const mockResponse = { success: true };

      mockWhatsAppService.handleWebhookEvent.mockResolvedValue(mockResponse);

      const result = await controller.handleWebhook(organizationId, event);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.handleWebhookEvent).toHaveBeenCalledWith(event, organizationId);
    });

    it('should handle webhook event with incoming messages', async () => {
      const organizationId = 'org1';
      const event = {
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  messages: [
                    {
                      from: '2348123456789',
                      text: { body: 'Hello from customer' },
                      id: 'msg1',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      const mockResponse = { success: true };

      mockWhatsAppService.handleWebhookEvent.mockResolvedValue(mockResponse);

      const result = await controller.handleWebhook(organizationId, event);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.handleWebhookEvent).toHaveBeenCalledWith(event, organizationId);
    });

    it('should handle webhook event with multiple entries', async () => {
      const organizationId = 'org1';
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
                      timestamp: '1234567890',
                    },
                  ],
                },
              },
            ],
          },
          {
            changes: [
              {
                field: 'messages',
                value: {
                  messages: [
                    {
                      from: '2348123456789',
                      text: { body: 'Hello' },
                      id: 'msg2',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      const mockResponse = { success: true };

      mockWhatsAppService.handleWebhookEvent.mockResolvedValue(mockResponse);

      const result = await controller.handleWebhook(organizationId, event);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.handleWebhookEvent).toHaveBeenCalledWith(event, organizationId);
    });
  });

  describe('verifyWebhook', () => {
    beforeEach(() => {
      // Set environment variable for testing
      process.env.WHATSAPP_VERIFY_TOKEN = 'test_verify_token';
    });

    afterEach(() => {
      delete process.env.WHATSAPP_VERIFY_TOKEN;
    });

    it('should verify webhook successfully with correct token', async () => {
      const mode = 'subscribe';
      const challenge = 'test_challenge_123';
      const verifyToken = 'test_verify_token';

      const result = await controller.verifyWebhook(mode, challenge, verifyToken);

      expect(result).toBe('test_challenge_123');
    });

    it('should throw error with incorrect token', async () => {
      const mode = 'subscribe';
      const challenge = 'test_challenge_123';
      const verifyToken = 'wrong_token';

      const result = await controller.verifyWebhook(mode, challenge, verifyToken);

      expect(result).toEqual({ error: 'Webhook verification failed' });
    });

    it('should throw error with non-subscribe mode', async () => {
      const mode = 'unsubscribe';
      const challenge = 'test_challenge_123';
      const verifyToken = 'test_verify_token';

      const result = await controller.verifyWebhook(mode, challenge, verifyToken);

      expect(result).toEqual({ error: 'Webhook verification failed' });
    });

    it('should throw error with missing verify token', async () => {
      delete process.env.WHATSAPP_VERIFY_TOKEN;

      const mode = 'subscribe';
      const challenge = 'test_challenge_123';
      const verifyToken = 'test_verify_token';

      const result = await controller.verifyWebhook(mode, challenge, verifyToken);

      expect(result).toEqual({ error: 'Webhook verification failed' });
    });

    it('should handle empty challenge', async () => {
      const mode = 'subscribe';
      const challenge = '';
      const verifyToken = 'test_verify_token';

      const result = await controller.verifyWebhook(mode, challenge, verifyToken);

      expect(result).toBe('');
    });
  });
});
