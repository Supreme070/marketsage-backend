import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SMSService } from '../sms.service';
import { SMSProviderService } from '../sms-provider.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSMSCampaignDto, UpdateSMSCampaignDto, SendSMSCampaignDto } from '../dto/sms-campaign.dto';
import { CreateSMSTemplateDto, UpdateSMSTemplateDto } from '../dto/sms-template.dto';
import { CreateSMSProviderDto, UpdateSMSProviderDto, TestSMSProviderDto } from '../dto/sms-provider.dto';

describe('SMSService', () => {
  let service: SMSService;
  let prismaService: PrismaService;
  let smsProviderService: SMSProviderService;

  const mockPrismaService = {
    sMSCampaign: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    sMSTemplate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    sMSProvider: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    sMSActivity: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    sMSHistory: {
      createMany: jest.fn(),
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

  const mockSMSProviderService = {
    sendSMS: jest.fn(),
    testProvider: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SMSService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SMSProviderService,
          useValue: mockSMSProviderService,
        },
      ],
    }).compile();

    service = module.get<SMSService>(SMSService);
    prismaService = module.get<PrismaService>(PrismaService);
    smsProviderService = module.get<SMSProviderService>(SMSProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCampaign', () => {
    it('should create a new SMS campaign successfully', async () => {
      const createCampaignDto: CreateSMSCampaignDto = {
        name: 'Test Campaign',
        description: 'Test Description',
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

      mockPrismaService.sMSCampaign.create.mockResolvedValue(mockCampaign);

      const result = await service.createCampaign(createCampaignDto, 'user-1', 'org-1');

      expect(result).toEqual(mockCampaign);
      expect(mockPrismaService.sMSCampaign.create).toHaveBeenCalledWith({
        data: {
          ...createCampaignDto,
          createdById: 'user-1',
          templateId: undefined,
          lists: undefined,
          segments: undefined,
        },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when template is not found', async () => {
      const createCampaignDto: CreateSMSCampaignDto = {
        name: 'Test Campaign',
        from: '+2348123456789',
        templateId: 'template-1',
      };

      mockPrismaService.sMSTemplate.findFirst.mockResolvedValue(null);

      await expect(
        service.createCampaign(createCampaignDto, 'user-1', 'org-1')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when list is not found', async () => {
      const createCampaignDto: CreateSMSCampaignDto = {
        name: 'Test Campaign',
        from: '+2348123456789',
        listIds: ['list-1'],
      };

      mockPrismaService.list.findMany.mockResolvedValue([]);

      await expect(
        service.createCampaign(createCampaignDto, 'user-1', 'org-1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCampaigns', () => {
    it('should return paginated campaigns', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          name: 'Test Campaign 1',
          status: 'DRAFT',
          createdById: 'user-1',
        },
        {
          id: 'campaign-2',
          name: 'Test Campaign 2',
          status: 'SENT',
          createdById: 'user-1',
        },
      ];

      mockPrismaService.sMSCampaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.sMSCampaign.count.mockResolvedValue(2);

      const result = await service.getCampaigns({}, 'user-1', 'org-1');

      expect(result).toEqual({
        campaigns: mockCampaigns,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
      });
    });

    it('should filter campaigns by status', async () => {
      const query = { status: 'SENT' as any };
      mockPrismaService.sMSCampaign.findMany.mockResolvedValue([]);
      mockPrismaService.sMSCampaign.count.mockResolvedValue(0);

      await service.getCampaigns(query, 'user-1', 'org-1');

      expect(mockPrismaService.sMSCampaign.findMany).toHaveBeenCalledWith({
        where: {
          createdById: 'user-1',
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
        id: 'campaign-1',
        name: 'Test Campaign',
        createdById: 'user-1',
      };

      mockPrismaService.sMSCampaign.findFirst.mockResolvedValue(mockCampaign);

      const result = await service.getCampaignById('campaign-1', 'user-1', 'org-1');

      expect(result).toEqual(mockCampaign);
      expect(mockPrismaService.sMSCampaign.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'campaign-1',
          createdById: 'user-1',
        },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when campaign is not found', async () => {
      mockPrismaService.sMSCampaign.findFirst.mockResolvedValue(null);

      await expect(
        service.getCampaignById('campaign-1', 'user-1', 'org-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('sendCampaign', () => {
    it('should send campaign successfully', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        name: 'Test Campaign',
        status: 'DRAFT',
        content: 'Test message',
        from: '+2348123456789',
      };

      const mockProvider = {
        id: 'provider-1',
        provider: 'africastalking',
        credentials: JSON.stringify({ apiKey: 'test-key', username: 'test-user' }),
      };

      const mockRecipients = [
        { id: 'contact-1', phone: '+2348123456789' },
        { id: 'contact-2', phone: '+2348123456790' },
      ];

      const mockSMSResult = {
        success: true,
        messageId: 'msg-1',
        provider: 'africastalking',
        cost: 0.01,
      };

      mockPrismaService.sMSCampaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.sMSProvider.findFirst.mockResolvedValue(mockProvider);
      mockPrismaService.sMSCampaign.findUnique.mockResolvedValue({
        ...mockCampaign,
        lists: [],
        segments: [],
      });
      mockPrismaService.listMember.findMany.mockResolvedValue([
        { contact: mockRecipients[0] },
        { contact: mockRecipients[1] },
      ]);
      mockSMSProviderService.sendSMS.mockResolvedValue(mockSMSResult);
      mockPrismaService.sMSCampaign.update.mockResolvedValue({
        ...mockCampaign,
        status: 'SENT',
        sentAt: new Date(),
      });

      const result = await service.sendCampaign('campaign-1', {}, 'user-1', 'org-1');

      expect(result.message).toContain('Campaign sent successfully');
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(0);
      expect(mockSMSProviderService.sendSMS).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException when campaign is not in DRAFT status', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        status: 'SENT',
      };

      mockPrismaService.sMSCampaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(
        service.sendCampaign('campaign-1', {}, 'user-1', 'org-1')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no active provider is found', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        status: 'DRAFT',
      };

      mockPrismaService.sMSCampaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.sMSProvider.findFirst.mockResolvedValue(null);

      await expect(
        service.sendCampaign('campaign-1', {}, 'user-1', 'org-1')
      ).rejects.toThrow(BadRequestException);
    });
  });

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
        variables: JSON.stringify(createTemplateDto.variables),
        createdById: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.sMSTemplate.create.mockResolvedValue(mockTemplate);

      const result = await service.createTemplate(createTemplateDto, 'user-1');

      expect(result).toEqual(mockTemplate);
      expect(mockPrismaService.sMSTemplate.create).toHaveBeenCalledWith({
        data: {
          ...createTemplateDto,
          variables: JSON.stringify(createTemplateDto.variables),
          createdById: 'user-1',
        },
        include: expect.any(Object),
      });
    });
  });

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
        credentials: JSON.stringify({
          apiKey: createProviderDto.apiKey,
          username: createProviderDto.username,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.sMSProvider.findFirst.mockResolvedValue(null);
      mockPrismaService.sMSProvider.create.mockResolvedValue(mockProvider);

      const result = await service.createProvider(createProviderDto, 'org-1');

      expect(result).toEqual(mockProvider);
      expect(mockPrismaService.sMSProvider.create).toHaveBeenCalledWith({
        data: {
          ...createProviderDto,
          organizationId: 'org-1',
          credentials: expect.any(String),
        },
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException when organization already has a provider', async () => {
      const createProviderDto: CreateSMSProviderDto = {
        provider: 'africastalking' as any,
        senderId: 'MarketSage',
      };

      mockPrismaService.sMSProvider.findFirst.mockResolvedValue({ id: 'existing-provider' });

      await expect(
        service.createProvider(createProviderDto, 'org-1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('testProvider', () => {
    it('should test provider successfully', async () => {
      const mockProvider = {
        id: 'provider-1',
        provider: 'africastalking',
        credentials: JSON.stringify({ apiKey: 'test-key', username: 'test-user' }),
      };

      mockPrismaService.sMSProvider.findFirst.mockResolvedValue(mockProvider);
      mockSMSProviderService.testProvider.mockResolvedValue(true);
      mockPrismaService.sMSProvider.update.mockResolvedValue({
        ...mockProvider,
        verificationStatus: 'verified',
      });

      const result = await service.testProvider('provider-1', { testPhoneNumber: '+2348123456789' }, 'org-1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Test SMS sent successfully');
      expect(mockSMSProviderService.testProvider).toHaveBeenCalledWith(mockProvider);
    });

    it('should handle provider test failure', async () => {
      const mockProvider = {
        id: 'provider-1',
        provider: 'africastalking',
        credentials: JSON.stringify({ apiKey: 'test-key', username: 'test-user' }),
      };

      mockPrismaService.sMSProvider.findFirst.mockResolvedValue(mockProvider);
      mockSMSProviderService.testProvider.mockResolvedValue(false);

      const result = await service.testProvider('provider-1', { testPhoneNumber: '+2348123456789' }, 'org-1');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Test SMS failed');
    });
  });

  describe('trackSMSActivity', () => {
    it('should track SMS activity', async () => {
      const mockActivity = {
        id: 'activity-1',
        campaignId: 'campaign-1',
        contactId: 'contact-1',
        type: 'SENT',
        timestamp: new Date(),
        metadata: '{"sentAt": "2023-01-01T00:00:00Z"}',
      };

      mockPrismaService.sMSActivity.create.mockResolvedValue(mockActivity);

      const result = await service.trackSMSActivity('campaign-1', 'contact-1', 'SENT', { sentAt: new Date() });

      expect(result).toEqual(mockActivity);
      expect(mockPrismaService.sMSActivity.create).toHaveBeenCalledWith({
        data: {
          campaignId: 'campaign-1',
          contactId: 'contact-1',
          type: 'SENT',
          metadata: expect.any(String),
        },
        include: expect.any(Object),
      });
    });
  });

  describe('unsubscribeContact', () => {
    it('should unsubscribe contact successfully', async () => {
      mockPrismaService.contact.update.mockResolvedValue({});
      mockPrismaService.sMSActivity.create.mockResolvedValue({});

      const result = await service.unsubscribeContact('contact-1', 'campaign-1');

      expect(result.message).toBe('Contact unsubscribed successfully');
      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: {
          status: 'UNSUBSCRIBED',
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});
