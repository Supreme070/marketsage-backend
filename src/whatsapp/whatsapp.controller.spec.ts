import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('WhatsAppController', () => {
  let controller: WhatsAppController;
  let service: WhatsAppService;

  const mockWhatsAppService = {
    createCampaign: jest.fn(),
    getCampaigns: jest.fn(),
    getCampaignById: jest.fn(),
    updateCampaign: jest.fn(),
    deleteCampaign: jest.fn(),
    duplicateCampaign: jest.fn(),
    sendCampaign: jest.fn(),
    getCampaignAnalytics: jest.fn(),
    createTemplate: jest.fn(),
    getTemplates: jest.fn(),
    getTemplateById: jest.fn(),
    updateTemplate: jest.fn(),
    deleteTemplate: jest.fn(),
    submitTemplate: jest.fn(),
    approveTemplate: jest.fn(),
    rejectTemplate: jest.fn(),
    createProvider: jest.fn(),
    getProviders: jest.fn(),
    getProviderById: jest.fn(),
    updateProvider: jest.fn(),
    deleteProvider: jest.fn(),
    testProvider: jest.fn(),
    trackWhatsAppActivity: jest.fn(),
    unsubscribeContact: jest.fn(),
    handleWebhookEvent: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsAppController],
      providers: [
        {
          provide: WhatsAppService,
          useValue: mockWhatsAppService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<WhatsAppController>(WhatsAppController);
    service = module.get<WhatsAppService>(WhatsAppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCampaign', () => {
    it('should create a campaign', async () => {
      const campaignData = {
        name: 'Test Campaign',
        from: '+1234567890',
        content: 'Test message',
      };

      const mockCampaign = {
        id: 'campaign1',
        ...campaignData,
        status: 'DRAFT',
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        template: null,
        lists: [],
        segments: [],
        _count: { activities: 0 },
      };

      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      mockWhatsAppService.createCampaign.mockResolvedValue(mockCampaign);

      const result = await controller.createCampaign(campaignData, mockRequest);

      expect(result).toEqual(mockCampaign);
      expect(mockWhatsAppService.createCampaign).toHaveBeenCalledWith(
        campaignData,
        'user1',
        'org1'
      );
    });
  });

  describe('getCampaigns', () => {
    it('should return campaigns with pagination', async () => {
      const query = { page: 1, limit: 10 };
      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockResponse = {
        campaigns: [
          {
            id: 'campaign1',
            name: 'Test Campaign',
            status: 'DRAFT',
            createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
            template: null,
            lists: [],
            segments: [],
            _count: { activities: 0 },
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      mockWhatsAppService.getCampaigns.mockResolvedValue(mockResponse);

      const result = await controller.getCampaigns(query, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.getCampaigns).toHaveBeenCalledWith(
        query,
        'user1',
        'org1'
      );
    });
  });

  describe('getCampaignById', () => {
    it('should return a campaign by id', async () => {
      const campaignId = 'campaign1';
      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockCampaign = {
        id: campaignId,
        name: 'Test Campaign',
        status: 'DRAFT',
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        template: null,
        lists: [],
        segments: [],
        activities: [],
        _count: { activities: 0 },
      };

      mockWhatsAppService.getCampaignById.mockResolvedValue(mockCampaign);

      const result = await controller.getCampaignById(campaignId, mockRequest);

      expect(result).toEqual(mockCampaign);
      expect(mockWhatsAppService.getCampaignById).toHaveBeenCalledWith(
        campaignId,
        'user1',
        'org1'
      );
    });
  });

  describe('updateCampaign', () => {
    it('should update a campaign', async () => {
      const campaignId = 'campaign1';
      const updateData = {
        name: 'Updated Campaign',
        content: 'Updated message',
      };
      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockUpdatedCampaign = {
        id: campaignId,
        ...updateData,
        status: 'DRAFT',
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        template: null,
        lists: [],
        segments: [],
        _count: { activities: 0 },
      };

      mockWhatsAppService.updateCampaign.mockResolvedValue(mockUpdatedCampaign);

      const result = await controller.updateCampaign(campaignId, updateData, mockRequest);

      expect(result).toEqual(mockUpdatedCampaign);
      expect(mockWhatsAppService.updateCampaign).toHaveBeenCalledWith(
        campaignId,
        updateData,
        'user1',
        'org1'
      );
    });
  });

  describe('deleteCampaign', () => {
    it('should delete a campaign', async () => {
      const campaignId = 'campaign1';
      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockResponse = { message: 'WhatsApp campaign deleted successfully' };

      mockWhatsAppService.deleteCampaign.mockResolvedValue(mockResponse);

      const result = await controller.deleteCampaign(campaignId, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.deleteCampaign).toHaveBeenCalledWith(
        campaignId,
        'user1',
        'org1'
      );
    });
  });

  describe('duplicateCampaign', () => {
    it('should duplicate a campaign', async () => {
      const campaignId = 'campaign1';
      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockResponse = {
        message: 'WhatsApp campaign duplicated successfully',
        originalCampaign: { id: 'campaign1', name: 'Original Campaign' },
        duplicatedCampaign: { id: 'campaign2', name: 'Original Campaign (Copy)', status: 'DRAFT' },
      };

      mockWhatsAppService.duplicateCampaign.mockResolvedValue(mockResponse);

      const result = await controller.duplicateCampaign(campaignId, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.duplicateCampaign).toHaveBeenCalledWith(
        campaignId,
        'user1',
        'org1'
      );
    });
  });

  describe('sendCampaign', () => {
    it('should send a campaign', async () => {
      const campaignId = 'campaign1';
      const sendData = { scheduledFor: '2024-01-01T00:00:00Z' };
      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockResponse = {
        message: 'Campaign sent successfully. 2 sent, 0 failed.',
        campaign: { id: campaignId, status: 'SENT' },
        recipientsCount: 2,
        successCount: 2,
        failureCount: 0,
        results: [],
      };

      mockWhatsAppService.sendCampaign.mockResolvedValue(mockResponse);

      const result = await controller.sendCampaign(campaignId, sendData, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.sendCampaign).toHaveBeenCalledWith(
        campaignId,
        sendData,
        'user1',
        'org1'
      );
    });
  });

  describe('getCampaignAnalytics', () => {
    it('should return campaign analytics', async () => {
      const campaignId = 'campaign1';
      const query = { startDate: '2024-01-01', endDate: '2024-01-31' };
      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockAnalytics = {
        campaign: {
          id: campaignId,
          name: 'Test Campaign',
          from: '+1234567890',
          status: 'SENT',
          sentAt: '2024-01-01T00:00:00Z',
        },
        analytics: {
          totalSent: 100,
          totalDelivered: 95,
          totalRead: 80,
          totalFailed: 5,
          deliveryRate: 95,
          readRate: 80,
          failureRate: 5,
        },
        activities: [],
      };

      mockWhatsAppService.getCampaignAnalytics.mockResolvedValue(mockAnalytics);

      const result = await controller.getCampaignAnalytics(campaignId, query, mockRequest);

      expect(result).toEqual(mockAnalytics);
      expect(mockWhatsAppService.getCampaignAnalytics).toHaveBeenCalledWith(
        campaignId,
        query,
        'user1',
        'org1'
      );
    });
  });

  describe('createTemplate', () => {
    it('should create a template', async () => {
      const templateData = {
        name: 'Test Template',
        content: 'Test content',
        variables: ['name', 'email'],
        category: 'marketing',
      };

      const mockRequest = {
        user: { id: 'user1' },
      };

      const mockTemplate = {
        id: 'template1',
        ...templateData,
        status: 'PENDING',
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        _count: { campaigns: 0 },
      };

      mockWhatsAppService.createTemplate.mockResolvedValue(mockTemplate);

      const result = await controller.createTemplate(templateData, mockRequest);

      expect(result).toEqual(mockTemplate);
      expect(mockWhatsAppService.createTemplate).toHaveBeenCalledWith(
        templateData,
        'user1'
      );
    });
  });

  describe('getTemplates', () => {
    it('should return templates with pagination', async () => {
      const query = { page: 1, limit: 10 };
      const mockRequest = {
        user: { id: 'user1' },
      };

      const mockResponse = {
        templates: [
          {
            id: 'template1',
            name: 'Test Template',
            content: 'Test content',
            status: 'PENDING',
            createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
            _count: { campaigns: 0 },
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      mockWhatsAppService.getTemplates.mockResolvedValue(mockResponse);

      const result = await controller.getTemplates(query, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.getTemplates).toHaveBeenCalledWith(query, 'user1');
    });
  });

  describe('submitTemplate', () => {
    it('should submit template for approval', async () => {
      const templateData = {
        name: 'Test Template',
        category: 'marketing',
        language: 'en_US',
        components: [{ type: 'HEADER', text: 'Hello {{name}}' }],
      };

      const mockRequest = {
        user: { id: 'user1', organizationId: 'org1' },
      };

      const mockResponse = {
        message: 'Template submitted successfully',
        template: {
          id: 'template1',
          name: 'Test Template',
          status: 'PENDING',
        },
        submissionResult: { success: true, messageId: 'template1' },
      };

      mockWhatsAppService.submitTemplate.mockResolvedValue(mockResponse);

      const result = await controller.submitTemplate(templateData, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.submitTemplate).toHaveBeenCalledWith(
        templateData,
        'user1',
        'org1'
      );
    });
  });

  describe('createProvider', () => {
    it('should create a provider', async () => {
      const providerData = {
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
      };

      const mockRequest = {
        user: { organizationId: 'org1' },
      };

      const mockProvider = {
        id: 'provider1',
        ...providerData,
        organizationId: 'org1',
        isActive: false,
        verificationStatus: 'pending',
        organization: { id: 'org1', name: 'Test Org' },
      };

      mockWhatsAppService.createProvider.mockResolvedValue(mockProvider);

      const result = await controller.createProvider(providerData, mockRequest);

      expect(result).toEqual(mockProvider);
      expect(mockWhatsAppService.createProvider).toHaveBeenCalledWith(
        providerData,
        'org1'
      );
    });
  });

  describe('getProviders', () => {
    it('should return providers', async () => {
      const mockRequest = {
        user: { organizationId: 'org1' },
      };

      const mockProviders = [
        {
          id: 'provider1',
          businessAccountId: 'business1',
          phoneNumberId: 'phone1',
          accessToken: 'token1',
          webhookUrl: 'webhook1',
          verifyToken: 'verify1',
          isActive: true,
          verificationStatus: 'verified',
          organization: { id: 'org1', name: 'Test Org' },
        },
      ];

      mockWhatsAppService.getProviders.mockResolvedValue(mockProviders);

      const result = await controller.getProviders(mockRequest);

      expect(result).toEqual(mockProviders);
      expect(mockWhatsAppService.getProviders).toHaveBeenCalledWith('org1');
    });
  });

  describe('testProvider', () => {
    it('should test a provider', async () => {
      const providerId = 'provider1';
      const testData = {
        testPhoneNumber: '+1234567890',
        testMessage: 'Test message',
      };
      const mockRequest = {
        user: { organizationId: 'org1' },
      };

      const mockResponse = {
        success: true,
        message: 'Test WhatsApp message sent successfully',
        timestamp: new Date(),
      };

      mockWhatsAppService.testProvider.mockResolvedValue(mockResponse);

      const result = await controller.testProvider(providerId, testData, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.testProvider).toHaveBeenCalledWith(
        providerId,
        testData,
        'org1'
      );
    });
  });

  describe('trackActivity', () => {
    it('should track WhatsApp activity', async () => {
      const campaignId = 'campaign1';
      const contactId = 'contact1';
      const type = 'SENT';
      const metadata = { timestamp: '2024-01-01T00:00:00Z' };

      const mockActivity = {
        id: 'activity1',
        campaignId,
        contactId,
        type,
        timestamp: new Date(),
        metadata: JSON.stringify(metadata),
      };

      mockWhatsAppService.trackWhatsAppActivity.mockResolvedValue(mockActivity);

      const result = await controller.trackActivity(campaignId, contactId, type, metadata);

      expect(result).toEqual(mockActivity);
      expect(mockWhatsAppService.trackWhatsAppActivity).toHaveBeenCalledWith(
        campaignId,
        contactId,
        type,
        metadata
      );
    });
  });

  describe('unsubscribeContact', () => {
    it('should unsubscribe a contact', async () => {
      const contactId = 'contact1';
      const body = { campaignId: 'campaign1' };

      const mockResponse = { message: 'Contact unsubscribed successfully' };

      mockWhatsAppService.unsubscribeContact.mockResolvedValue(mockResponse);

      const result = await controller.unsubscribeContact(contactId, body);

      expect(result).toEqual(mockResponse);
      expect(mockWhatsAppService.unsubscribeContact).toHaveBeenCalledWith(
        contactId,
        'campaign1'
      );
    });
  });
});