import { Test, TestingModule } from '@nestjs/testing';
import { SMSController } from '../sms.controller';
import { SMSService } from '../sms.service';
import { SMSProviderService } from '../sms-provider.service';
import { CreateSMSCampaignDto, UpdateSMSCampaignDto, SendSMSCampaignDto } from '../dto/sms-campaign.dto';
import { CreateSMSTemplateDto, UpdateSMSTemplateDto } from '../dto/sms-template.dto';
import { CreateSMSProviderDto, UpdateSMSProviderDto, TestSMSProviderDto } from '../dto/sms-provider.dto';

describe('SMSController', () => {
  let controller: SMSController;
  let smsService: SMSService;

  const mockSMSService = {
    createCampaign: jest.fn(),
    getCampaigns: jest.fn(),
    getCampaignById: jest.fn(),
    updateCampaign: jest.fn(),
    deleteCampaign: jest.fn(),
    sendCampaign: jest.fn(),
    getCampaignAnalytics: jest.fn(),
    createTemplate: jest.fn(),
    getTemplates: jest.fn(),
    getTemplateById: jest.fn(),
    updateTemplate: jest.fn(),
    deleteTemplate: jest.fn(),
    createProvider: jest.fn(),
    getProviders: jest.fn(),
    getProviderById: jest.fn(),
    updateProvider: jest.fn(),
    deleteProvider: jest.fn(),
    testProvider: jest.fn(),
    trackSMSActivity: jest.fn(),
    unsubscribeContact: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-1',
      organizationId: 'org-1',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SMSController],
      providers: [
        {
          provide: SMSService,
          useValue: mockSMSService,
        },
        {
          provide: SMSProviderService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SMSController>(SMSController);
    smsService = module.get<SMSService>(SMSService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Campaigns', () => {
    describe('createCampaign', () => {
      it('should create a new SMS campaign', async () => {
        const createCampaignDto: CreateSMSCampaignDto = {
          name: 'Test Campaign',
          from: '+2348123456789',
          content: 'Test message',
        };

        const mockCampaign = {
          id: 'campaign-1',
          ...createCampaignDto,
          createdById: 'user-1',
          organizationId: 'org-1',
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockSMSService.createCampaign.mockResolvedValue(mockCampaign);

        const result = await controller.createCampaign(createCampaignDto, mockRequest);

        expect(result).toEqual(mockCampaign);
        expect(mockSMSService.createCampaign).toHaveBeenCalledWith(
          createCampaignDto,
          'user-1',
          'org-1'
        );
      });
    });

    describe('getCampaigns', () => {
      it('should return paginated campaigns', async () => {
        const mockResponse = {
          campaigns: [
            {
              id: 'campaign-1',
              name: 'Test Campaign 1',
              status: 'DRAFT',
            },
            {
              id: 'campaign-2',
              name: 'Test Campaign 2',
              status: 'SENT',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            pages: 1,
          },
        };

        mockSMSService.getCampaigns.mockResolvedValue(mockResponse);

        const result = await controller.getCampaigns({}, mockRequest);

        expect(result).toEqual(mockResponse);
        expect(mockSMSService.getCampaigns).toHaveBeenCalledWith({}, 'user-1', 'org-1');
      });
    });

    describe('getCampaignById', () => {
      it('should return campaign by id', async () => {
        const mockCampaign = {
          id: 'campaign-1',
          name: 'Test Campaign',
          createdById: 'user-1',
        };

        mockSMSService.getCampaignById.mockResolvedValue(mockCampaign);

        const result = await controller.getCampaignById('campaign-1', mockRequest);

        expect(result).toEqual(mockCampaign);
        expect(mockSMSService.getCampaignById).toHaveBeenCalledWith('campaign-1', 'user-1', 'org-1');
      });
    });

    describe('updateCampaign', () => {
      it('should update campaign', async () => {
        const updateCampaignDto: UpdateSMSCampaignDto = {
          name: 'Updated Campaign',
          content: 'Updated message',
        };

        const mockUpdatedCampaign = {
          id: 'campaign-1',
          ...updateCampaignDto,
          createdById: 'user-1',
        };

        mockSMSService.updateCampaign.mockResolvedValue(mockUpdatedCampaign);

        const result = await controller.updateCampaign('campaign-1', updateCampaignDto, mockRequest);

        expect(result).toEqual(mockUpdatedCampaign);
        expect(mockSMSService.updateCampaign).toHaveBeenCalledWith(
          'campaign-1',
          updateCampaignDto,
          'user-1',
          'org-1'
        );
      });
    });

    describe('deleteCampaign', () => {
      it('should delete campaign', async () => {
        const mockResponse = { message: 'SMS campaign deleted successfully' };

        mockSMSService.deleteCampaign.mockResolvedValue(mockResponse);

        const result = await controller.deleteCampaign('campaign-1', mockRequest);

        expect(result).toEqual(mockResponse);
        expect(mockSMSService.deleteCampaign).toHaveBeenCalledWith('campaign-1', 'user-1', 'org-1');
      });
    });

    describe('sendCampaign', () => {
      it('should send campaign', async () => {
        const sendCampaignDto: SendSMSCampaignDto = {
          scheduledFor: '2023-12-31T23:59:59Z',
        };

        const mockResponse = {
          message: 'Campaign sent successfully',
          campaign: { id: 'campaign-1', status: 'SENT' },
          recipientsCount: 100,
          successCount: 95,
          failureCount: 5,
        };

        mockSMSService.sendCampaign.mockResolvedValue(mockResponse);

        const result = await controller.sendCampaign('campaign-1', sendCampaignDto, mockRequest);

        expect(result).toEqual(mockResponse);
        expect(mockSMSService.sendCampaign).toHaveBeenCalledWith(
          'campaign-1',
          sendCampaignDto,
          'user-1',
          'org-1'
        );
      });
    });

    describe('getCampaignAnalytics', () => {
      it('should return campaign analytics', async () => {
        const mockAnalytics = {
          campaign: {
            id: 'campaign-1',
            name: 'Test Campaign',
            from: '+2348123456789',
            status: 'SENT',
            sentAt: new Date(),
          },
          analytics: {
            totalSent: 100,
            totalDelivered: 95,
            totalFailed: 5,
            totalBounced: 0,
            totalUnsubscribed: 0,
            deliveryRate: 95,
            failureRate: 5,
            bounceRate: 0,
            unsubscribeRate: 0,
          },
          activities: [],
        };

        mockSMSService.getCampaignAnalytics.mockResolvedValue(mockAnalytics);

        const result = await controller.getCampaignAnalytics('campaign-1', {}, mockRequest);

        expect(result).toEqual(mockAnalytics);
        expect(mockSMSService.getCampaignAnalytics).toHaveBeenCalledWith(
          'campaign-1',
          {},
          'user-1',
          'org-1'
        );
      });
    });
  });

  describe('Templates', () => {
    describe('createTemplate', () => {
      it('should create a new SMS template', async () => {
        const createTemplateDto: CreateSMSTemplateDto = {
          name: 'Test Template',
          content: 'Hello {{name}}, this is a test message.',
          variables: ['name'],
          category: 'welcome',
        };

        const mockTemplate = {
          id: 'template-1',
          ...createTemplateDto,
          createdById: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockSMSService.createTemplate.mockResolvedValue(mockTemplate);

        const result = await controller.createTemplate(createTemplateDto, mockRequest);

        expect(result).toEqual(mockTemplate);
        expect(mockSMSService.createTemplate).toHaveBeenCalledWith(createTemplateDto, 'user-1');
      });
    });

    describe('getTemplates', () => {
      it('should return paginated templates', async () => {
        const mockResponse = {
          templates: [
            {
              id: 'template-1',
              name: 'Template 1',
              content: 'Test content 1',
            },
            {
              id: 'template-2',
              name: 'Template 2',
              content: 'Test content 2',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            pages: 1,
          },
        };

        mockSMSService.getTemplates.mockResolvedValue(mockResponse);

        const result = await controller.getTemplates({}, mockRequest);

        expect(result).toEqual(mockResponse);
        expect(mockSMSService.getTemplates).toHaveBeenCalledWith({}, 'user-1');
      });
    });

    describe('getTemplateById', () => {
      it('should return template by id', async () => {
        const mockTemplate = {
          id: 'template-1',
          name: 'Test Template',
          createdById: 'user-1',
        };

        mockSMSService.getTemplateById.mockResolvedValue(mockTemplate);

        const result = await controller.getTemplateById('template-1', mockRequest);

        expect(result).toEqual(mockTemplate);
        expect(mockSMSService.getTemplateById).toHaveBeenCalledWith('template-1', 'user-1');
      });
    });

    describe('updateTemplate', () => {
      it('should update template', async () => {
        const updateTemplateDto: UpdateSMSTemplateDto = {
          name: 'Updated Template',
          content: 'Updated content',
        };

        const mockUpdatedTemplate = {
          id: 'template-1',
          ...updateTemplateDto,
          createdById: 'user-1',
        };

        mockSMSService.updateTemplate.mockResolvedValue(mockUpdatedTemplate);

        const result = await controller.updateTemplate('template-1', updateTemplateDto, mockRequest);

        expect(result).toEqual(mockUpdatedTemplate);
        expect(mockSMSService.updateTemplate).toHaveBeenCalledWith(
          'template-1',
          updateTemplateDto,
          'user-1'
        );
      });
    });

    describe('deleteTemplate', () => {
      it('should delete template', async () => {
        const mockResponse = { message: 'SMS template deleted successfully' };

        mockSMSService.deleteTemplate.mockResolvedValue(mockResponse);

        const result = await controller.deleteTemplate('template-1', mockRequest);

        expect(result).toEqual(mockResponse);
        expect(mockSMSService.deleteTemplate).toHaveBeenCalledWith('template-1', 'user-1');
      });
    });
  });

  describe('Providers', () => {
    describe('createProvider', () => {
      it('should create a new SMS provider', async () => {
        const createProviderDto: CreateSMSProviderDto = {
          provider: 'africastalking' as any,
          senderId: 'MarketSage',
          apiKey: 'test-key',
          username: 'test-user',
        };

        const mockProvider = {
          id: 'provider-1',
          ...createProviderDto,
          organizationId: 'org-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockSMSService.createProvider.mockResolvedValue(mockProvider);

        const result = await controller.createProvider(createProviderDto, mockRequest);

        expect(result).toEqual(mockProvider);
        expect(mockSMSService.createProvider).toHaveBeenCalledWith(createProviderDto, 'org-1');
      });
    });

    describe('getProviders', () => {
      it('should return providers', async () => {
        const mockProviders = [
          {
            id: 'provider-1',
            provider: 'africastalking',
            organizationId: 'org-1',
          },
          {
            id: 'provider-2',
            provider: 'twilio',
            organizationId: 'org-1',
          },
        ];

        mockSMSService.getProviders.mockResolvedValue(mockProviders);

        const result = await controller.getProviders(mockRequest);

        expect(result).toEqual(mockProviders);
        expect(mockSMSService.getProviders).toHaveBeenCalledWith('org-1');
      });
    });

    describe('getProviderById', () => {
      it('should return provider by id', async () => {
        const mockProvider = {
          id: 'provider-1',
          provider: 'africastalking',
          organizationId: 'org-1',
        };

        mockSMSService.getProviderById.mockResolvedValue(mockProvider);

        const result = await controller.getProviderById('provider-1', mockRequest);

        expect(result).toEqual(mockProvider);
        expect(mockSMSService.getProviderById).toHaveBeenCalledWith('provider-1', 'org-1');
      });
    });

    describe('updateProvider', () => {
      it('should update provider', async () => {
        const updateProviderDto: UpdateSMSProviderDto = {
          senderId: 'UpdatedSender',
          isActive: true,
        };

        const mockUpdatedProvider = {
          id: 'provider-1',
          ...updateProviderDto,
          organizationId: 'org-1',
        };

        mockSMSService.updateProvider.mockResolvedValue(mockUpdatedProvider);

        const result = await controller.updateProvider('provider-1', updateProviderDto, mockRequest);

        expect(result).toEqual(mockUpdatedProvider);
        expect(mockSMSService.updateProvider).toHaveBeenCalledWith(
          'provider-1',
          updateProviderDto,
          'org-1'
        );
      });
    });

    describe('deleteProvider', () => {
      it('should delete provider', async () => {
        const mockResponse = { message: 'SMS provider deleted successfully' };

        mockSMSService.deleteProvider.mockResolvedValue(mockResponse);

        const result = await controller.deleteProvider('provider-1', mockRequest);

        expect(result).toEqual(mockResponse);
        expect(mockSMSService.deleteProvider).toHaveBeenCalledWith('provider-1', 'org-1');
      });
    });

    describe('testProvider', () => {
      it('should test provider', async () => {
        const testProviderDto: TestSMSProviderDto = {
          testPhoneNumber: '+2348123456789',
          testMessage: 'Test SMS from MarketSage',
        };

        const mockTestResult = {
          success: true,
          message: 'Test SMS sent successfully',
          timestamp: new Date(),
        };

        mockSMSService.testProvider.mockResolvedValue(mockTestResult);

        const result = await controller.testProvider('provider-1', testProviderDto, mockRequest);

        expect(result).toEqual(mockTestResult);
        expect(mockSMSService.testProvider).toHaveBeenCalledWith(
          'provider-1',
          testProviderDto,
          'org-1'
        );
      });
    });
  });

  describe('Tracking', () => {
    describe('trackActivity', () => {
      it('should track SMS activity', async () => {
        const mockActivity = {
          id: 'activity-1',
          campaignId: 'campaign-1',
          contactId: 'contact-1',
          type: 'SENT',
          timestamp: new Date(),
        };

        mockSMSService.trackSMSActivity.mockResolvedValue(mockActivity);

        const result = await controller.trackActivity('campaign-1', 'contact-1', 'SENT', { test: 'data' });

        expect(result).toEqual(mockActivity);
        expect(mockSMSService.trackSMSActivity).toHaveBeenCalledWith(
          'campaign-1',
          'contact-1',
          'SENT',
          { test: 'data' }
        );
      });
    });

    describe('unsubscribeContact', () => {
      it('should unsubscribe contact', async () => {
        const mockResponse = { message: 'Contact unsubscribed successfully' };

        mockSMSService.unsubscribeContact.mockResolvedValue(mockResponse);

        const result = await controller.unsubscribeContact('contact-1', { campaignId: 'campaign-1' });

        expect(result).toEqual(mockResponse);
        expect(mockSMSService.unsubscribeContact).toHaveBeenCalledWith('contact-1', 'campaign-1');
      });
    });
  });
});
