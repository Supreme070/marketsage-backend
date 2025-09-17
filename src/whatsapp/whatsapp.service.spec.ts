import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppProviderService } from './whatsapp-provider.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('WhatsAppService', () => {
  let service: WhatsAppService;
  let prismaService: PrismaService;
  let providerService: WhatsAppProviderService;

  const mockPrismaService = {
    whatsAppCampaign: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    whatsAppTemplate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    whatsAppBusinessConfig: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    whatsAppActivity: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    whatsAppHistory: {
      createMany: jest.fn(),
      updateMany: jest.fn(),
    },
    list: {
      findMany: jest.fn(),
    },
    segment: {
      findMany: jest.fn(),
    },
    listMember: {
      findMany: jest.fn(),
    },
    segmentMember: {
      findMany: jest.fn(),
    },
    contact: {
      update: jest.fn(),
    },
  };

  const mockProviderService = {
    sendMessage: jest.fn(),
    testProvider: jest.fn(),
    submitTemplate: jest.fn(),
    getTemplates: jest.fn(),
    processWebhookEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsAppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: WhatsAppProviderService,
          useValue: mockProviderService,
        },
      ],
    }).compile();

    service = module.get<WhatsAppService>(WhatsAppService);
    prismaService = module.get<PrismaService>(PrismaService);
    providerService = module.get<WhatsAppProviderService>(WhatsAppProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCampaign', () => {
    it('should create a WhatsApp campaign successfully', async () => {
      const campaignData = {
        name: 'Test Campaign',
        description: 'Test Description',
        from: '+1234567890',
        content: 'Test message',
        listIds: ['list1'],
        segmentIds: ['segment1'],
      };

      const mockCampaign = {
        id: 'campaign1',
        ...campaignData,
        createdById: 'user1',
        templateId: null,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        template: null,
        lists: [{ id: 'list1', name: 'Test List' }],
        segments: [{ id: 'segment1', name: 'Test Segment' }],
        _count: { activities: 0 },
      };

      mockPrismaService.list.findMany.mockResolvedValue([{ id: 'list1', name: 'Test List' }]);
      mockPrismaService.segment.findMany.mockResolvedValue([{ id: 'segment1', name: 'Test Segment' }]);
      mockPrismaService.whatsAppCampaign.create.mockResolvedValue(mockCampaign);

      const result = await service.createCampaign(campaignData, 'user1', 'org1');

      expect(result).toEqual(mockCampaign);
      expect(mockPrismaService.whatsAppCampaign.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Campaign',
          description: 'Test Description',
          from: '+1234567890',
          content: 'Test message',
          createdById: 'user1',
          templateId: undefined,
          lists: { connect: [{ id: 'list1' }] },
          segments: { connect: [{ id: 'segment1' }] },
        },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when template not found', async () => {
      const campaignData = {
        name: 'Test Campaign',
        from: '+1234567890',
        templateId: 'nonexistent',
      };

      mockPrismaService.whatsAppTemplate.findFirst.mockResolvedValue(null);

      await expect(
        service.createCampaign(campaignData, 'user1', 'org1')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when list not found', async () => {
      const campaignData = {
        name: 'Test Campaign',
        from: '+1234567890',
        listIds: ['nonexistent'],
      };

      mockPrismaService.list.findMany.mockResolvedValue([]);

      await expect(
        service.createCampaign(campaignData, 'user1', 'org1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCampaigns', () => {
    it('should return paginated campaigns', async () => {
      const mockCampaigns = [
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
      ];

      mockPrismaService.whatsAppCampaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.whatsAppCampaign.count.mockResolvedValue(1);

      const result = await service.getCampaigns({ page: 1, limit: 10 }, 'user1', 'org1');

      expect(result).toEqual({
        campaigns: mockCampaigns,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      });
    });

    it('should filter campaigns by status', async () => {
      const query = { page: 1, limit: 10, status: 'SENT' as any };
      
      mockPrismaService.whatsAppCampaign.findMany.mockResolvedValue([]);
      mockPrismaService.whatsAppCampaign.count.mockResolvedValue(0);

      await service.getCampaigns(query, 'user1', 'org1');

      expect(mockPrismaService.whatsAppCampaign.findMany).toHaveBeenCalledWith({
        where: {
          createdById: 'user1',
          status: 'SENT',
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });
  });

  describe('getCampaignById', () => {
    it('should return campaign by id', async () => {
      const mockCampaign = {
        id: 'campaign1',
        name: 'Test Campaign',
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        template: null,
        lists: [],
        segments: [],
        activities: [],
        _count: { activities: 0 },
      };

      mockPrismaService.whatsAppCampaign.findFirst.mockResolvedValue(mockCampaign);

      const result = await service.getCampaignById('campaign1', 'user1', 'org1');

      expect(result).toEqual(mockCampaign);
    });

    it('should throw NotFoundException when campaign not found', async () => {
      mockPrismaService.whatsAppCampaign.findFirst.mockResolvedValue(null);

      await expect(
        service.getCampaignById('nonexistent', 'user1', 'org1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('duplicateCampaign', () => {
    it('should duplicate a campaign successfully', async () => {
      const originalCampaign = {
        id: 'campaign1',
        name: 'Original Campaign',
        description: 'Original Description',
        from: '+1234567890',
        content: 'Original content',
        templateId: null,
        lists: [{ id: 'list1', name: 'Test List' }],
        segments: [{ id: 'segment1', name: 'Test Segment' }],
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        template: null,
        _count: { activities: 0 },
      };

      const duplicatedCampaign = {
        id: 'campaign2',
        name: 'Original Campaign (Copy)',
        description: 'Original Description',
        from: '+1234567890',
        content: 'Original content',
        templateId: null,
        status: 'DRAFT',
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        template: null,
        lists: [{ id: 'list1', name: 'Test List' }],
        segments: [{ id: 'segment1', name: 'Test Segment' }],
        _count: { activities: 0 },
      };

      mockPrismaService.whatsAppCampaign.findFirst.mockResolvedValueOnce(originalCampaign);
      mockPrismaService.list.findMany.mockResolvedValue([{ id: 'list1', name: 'Test List' }]);
      mockPrismaService.segment.findMany.mockResolvedValue([{ id: 'segment1', name: 'Test Segment' }]);
      mockPrismaService.whatsAppCampaign.create.mockResolvedValue(duplicatedCampaign);

      const result = await service.duplicateCampaign('campaign1', 'user1', 'org1');

      expect(result).toEqual({
        message: 'WhatsApp campaign duplicated successfully',
        originalCampaign: {
          id: 'campaign1',
          name: 'Original Campaign',
        },
        duplicatedCampaign: {
          id: 'campaign2',
          name: 'Original Campaign (Copy)',
          status: 'DRAFT',
        },
      });
    });
  });

  describe('sendCampaign', () => {
    it('should send a campaign successfully', async () => {
      const campaign = {
        id: 'campaign1',
        name: 'Test Campaign',
        status: 'DRAFT',
        content: 'Test message',
        template: null,
        lists: [{ id: 'list1' }],
        segments: [],
      };

      const provider = {
        id: 'provider1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      const recipients = [
        { id: 'contact1', phone: '+1234567890' },
        { id: 'contact2', phone: '+1234567891' },
      ];

      mockPrismaService.whatsAppCampaign.findFirst.mockResolvedValue(campaign);
      mockPrismaService.whatsAppCampaign.findUnique.mockResolvedValue({
        ...campaign,
        lists: [{ id: 'list1' }],
        segments: [],
      });
      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue(provider);
      mockPrismaService.listMember.findMany.mockResolvedValue([
        { contact: recipients[0] },
        { contact: recipients[1] },
      ]);
      mockPrismaService.segmentMember.findMany.mockResolvedValue([]);
      mockPrismaService.whatsAppCampaign.update.mockResolvedValueOnce({ ...campaign, status: 'SENDING' });
      mockPrismaService.whatsAppCampaign.update.mockResolvedValueOnce({ ...campaign, status: 'SENT' });
      mockProviderService.sendMessage.mockResolvedValue({ success: true, messageId: 'msg1' });
      mockPrismaService.whatsAppActivity.createMany.mockResolvedValue({ count: 2 });
      mockPrismaService.whatsAppHistory.createMany.mockResolvedValue({ count: 2 });

      const result = await service.sendCampaign('campaign1', {}, 'user1', 'org1');

      expect(result.message).toContain('Campaign sent successfully');
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(0);
    });

    it('should throw BadRequestException when campaign is not in DRAFT status', async () => {
      const campaign = {
        id: 'campaign1',
        name: 'Test Campaign',
        status: 'SENT',
        content: 'Test message',
        template: null,
        lists: [],
        segments: [],
      };

      mockPrismaService.whatsAppCampaign.findFirst.mockResolvedValue(campaign);

      await expect(
        service.sendCampaign('campaign1', {}, 'user1', 'org1')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no provider found', async () => {
      const campaign = {
        id: 'campaign1',
        name: 'Test Campaign',
        status: 'DRAFT',
        content: 'Test message',
        template: null,
        lists: [],
        segments: [],
      };

      mockPrismaService.whatsAppCampaign.findFirst.mockResolvedValue(campaign);
      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue(null);

      await expect(
        service.sendCampaign('campaign1', {}, 'user1', 'org1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createTemplate', () => {
    it('should create a WhatsApp template successfully', async () => {
      const templateData = {
        name: 'Test Template',
        content: 'Test content',
        variables: ['name', 'email'],
        category: 'marketing',
      };

      const mockTemplate = {
        id: 'template1',
        ...templateData,
        variables: JSON.stringify(templateData.variables),
        status: 'PENDING',
        createdById: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        _count: { campaigns: 0 },
      };

      mockPrismaService.whatsAppTemplate.create.mockResolvedValue(mockTemplate);

      const result = await service.createTemplate(templateData, 'user1');

      expect(result).toEqual(mockTemplate);
      expect(mockPrismaService.whatsAppTemplate.create).toHaveBeenCalledWith({
        data: {
          ...templateData,
          variables: JSON.stringify(templateData.variables),
          createdById: 'user1',
        },
        include: expect.any(Object),
      });
    });
  });

  describe('submitTemplate', () => {
    it('should submit template for approval successfully', async () => {
      const templateData = {
        name: 'Test Template',
        category: 'marketing',
        language: 'en_US',
        components: [{ type: 'HEADER', text: 'Hello {{name}}' }],
      };

      const provider = {
        id: 'provider1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      const mockTemplate = {
        id: 'template1',
        name: 'Test Template',
        content: JSON.stringify(templateData.components),
        variables: '[]',
        category: 'marketing',
        status: 'PENDING',
        createdById: 'user1',
        createdBy: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      };

      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue(provider);
      mockProviderService.submitTemplate.mockResolvedValue({ success: true, messageId: 'template1' });
      mockPrismaService.whatsAppTemplate.create.mockResolvedValue(mockTemplate);

      const result = await service.submitTemplate(templateData, 'user1', 'org1');

      expect(result.message).toBe('Template submitted successfully');
      expect(result.template).toEqual(mockTemplate);
    });

    it('should throw BadRequestException when no provider found', async () => {
      const templateData = {
        name: 'Test Template',
        category: 'marketing',
        language: 'en_US',
        components: [],
      };

      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue(null);

      await expect(
        service.submitTemplate(templateData, 'user1', 'org1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createProvider', () => {
    it('should create a WhatsApp provider successfully', async () => {
      const providerData = {
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
        phoneNumber: '+1234567890',
        displayName: 'Test Business',
      };

      const mockProvider = {
        id: 'provider1',
        ...providerData,
        organizationId: 'org1',
        isActive: false,
        verificationStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: { id: 'org1', name: 'Test Org' },
      };

      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue(null);
      mockPrismaService.whatsAppBusinessConfig.create.mockResolvedValue(mockProvider);

      const result = await service.createProvider(providerData, 'org1');

      expect(result).toEqual(mockProvider);
      expect(mockPrismaService.whatsAppBusinessConfig.create).toHaveBeenCalledWith({
        data: {
          ...providerData,
          organizationId: 'org1',
        },
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException when organization already has a provider', async () => {
      const providerData = {
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.createProvider(providerData, 'org1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('testProvider', () => {
    it('should test provider successfully', async () => {
      const provider = {
        id: 'provider1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue(provider);
      mockProviderService.testProvider.mockResolvedValue(true);
      mockPrismaService.whatsAppBusinessConfig.update.mockResolvedValue({
        ...provider,
        verificationStatus: 'verified',
      });

      const result = await service.testProvider('provider1', { testPhoneNumber: '+1234567890' }, 'org1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Test WhatsApp message sent successfully');
    });

    it('should handle test failure', async () => {
      const provider = {
        id: 'provider1',
        businessAccountId: 'business1',
        phoneNumberId: 'phone1',
        accessToken: 'token1',
        webhookUrl: 'webhook1',
        verifyToken: 'verify1',
      };

      mockPrismaService.whatsAppBusinessConfig.findFirst.mockResolvedValue(provider);
      mockProviderService.testProvider.mockResolvedValue(false);
      mockPrismaService.whatsAppBusinessConfig.update.mockResolvedValue({
        ...provider,
        verificationStatus: 'failed',
      });

      const result = await service.testProvider('provider1', { testPhoneNumber: '+1234567890' }, 'org1');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Test WhatsApp message failed');
    });
  });

  describe('handleWebhookEvent', () => {
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
                      timestamp: '1234567890',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      mockProviderService.processWebhookEvent.mockResolvedValue(undefined);
      mockPrismaService.whatsAppHistory.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.handleWebhookEvent(event, 'org1');

      expect(result.success).toBe(true);
      expect(mockProviderService.processWebhookEvent).toHaveBeenCalledWith(event);
      expect(mockPrismaService.whatsAppHistory.updateMany).toHaveBeenCalledWith({
        where: { messageId: 'msg1' },
        data: {
          status: 'DELIVERED',
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});