import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { CampaignABTestService } from './campaign-abtest.service';
import { CampaignWorkflowService } from './campaign-workflow.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { CampaignType, ChannelType, CampaignStatus } from './dto/campaigns.dto';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let mockPrismaService: any;
  let mockEmailService: any;
  let mockSMSService: any;
  let mockWhatsAppService: any;

  beforeEach(async () => {
    mockPrismaService = {
      unifiedCampaign: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      campaignPerformance: {
        findMany: jest.fn(),
      },
    };

    mockEmailService = {
      createCampaign: jest.fn(),
      sendCampaign: jest.fn(),
    };

    mockSMSService = {
      createCampaign: jest.fn(),
      sendCampaign: jest.fn(),
    };

    mockWhatsAppService = {
      createCampaign: jest.fn(),
      sendCampaign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: SMSService,
          useValue: mockSMSService,
        },
        {
          provide: WhatsAppService,
          useValue: mockWhatsAppService,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCampaign', () => {
    it('should create a unified campaign successfully', async () => {
      const campaignData = {
        name: 'Test Campaign',
        description: 'Test Description',
        type: CampaignType.MULTI_CHANNEL,
        channels: [ChannelType.EMAIL, ChannelType.SMS],
        emailConfig: {
          subject: 'Test Subject',
          content: 'Test Content',
        },
        smsConfig: {
          content: 'Test SMS Content',
        },
        listIds: ['list1'],
        segmentIds: ['segment1'],
      };

      const mockCampaign = {
        id: 'campaign1',
        name: 'Test Campaign',
        channels: [ChannelType.EMAIL, ChannelType.SMS],
        createdById: 'user1',
        organizationId: 'org1',
        lists: [{ id: 'list1', name: 'Test List' }],
        segments: [{ id: 'segment1', name: 'Test Segment' }],
        _count: { activities: 0 },
      };

      const mockEmailCampaign = { id: 'email1', name: 'Test Campaign - Email' };
      const mockSMSCampaign = { id: 'sms1', name: 'Test Campaign - SMS' };

      mockPrismaService.unifiedCampaign.create.mockResolvedValue(mockCampaign);
      mockEmailService.createCampaign.mockResolvedValue(mockEmailCampaign);
      mockSMSService.createCampaign.mockResolvedValue(mockSMSCampaign);

      const result = await service.createCampaign(campaignData, 'user1', 'org1');

      expect(result).toEqual({
        ...mockCampaign,
        channelCampaigns: [
          { channel: 'email', campaignId: 'email1' },
          { channel: 'sms', campaignId: 'sms1' },
        ],
      });
      expect(mockPrismaService.unifiedCampaign.create).toHaveBeenCalledWith({
        data: {
          ...campaignData,
          channels: [ChannelType.EMAIL, ChannelType.SMS],
          createdById: 'user1',
          organizationId: 'org1',
          lists: { connect: [{ id: 'list1' }] },
          segments: { connect: [{ id: 'segment1' }] },
        },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          lists: { select: { id: true, name: true } },
          segments: { select: { id: true, name: true } },
          _count: { select: { activities: true } },
        },
      });
    });

    it('should throw error when no channels specified', async () => {
      const campaignData = {
        name: 'Test Campaign',
        channels: [],
      };

      await expect(
        service.createCampaign(campaignData, 'user1', 'org1')
      ).rejects.toThrow('At least one channel must be specified');
    });

    it('should throw error when email channel selected without config', async () => {
      const campaignData = {
        name: 'Test Campaign',
        channels: [ChannelType.EMAIL],
      };

      await expect(
        service.createCampaign(campaignData, 'user1', 'org1')
      ).rejects.toThrow('Email configuration is required when email channel is selected');
    });
  });

  describe('getCampaigns', () => {
    it('should return paginated campaigns', async () => {
      const mockCampaigns = [
        {
          id: 'campaign1',
          name: 'Test Campaign 1',
          status: CampaignStatus.DRAFT,
          channels: [ChannelType.EMAIL],
        },
        {
          id: 'campaign2',
          name: 'Test Campaign 2',
          status: CampaignStatus.SENT,
          channels: [ChannelType.SMS],
        },
      ];

      mockPrismaService.unifiedCampaign.findMany.mockResolvedValue(mockCampaigns);
      mockPrismaService.unifiedCampaign.count.mockResolvedValue(2);

      const result = await service.getCampaigns({ page: 1, limit: 10 }, 'user1', 'org1');

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
  });

  describe('getCampaignById', () => {
    it('should return campaign by id', async () => {
      const mockCampaign = {
        id: 'campaign1',
        name: 'Test Campaign',
        status: CampaignStatus.DRAFT,
        channels: [ChannelType.EMAIL],
      };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);

      const result = await service.getCampaignById('campaign1', 'user1', 'org1');

      expect(result).toEqual(mockCampaign);
      expect(mockPrismaService.unifiedCampaign.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'campaign1',
          createdById: 'user1',
          organizationId: 'org1',
        },
        include: expect.any(Object),
      });
    });

    it('should throw error when campaign not found', async () => {
      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(null);

      await expect(
        service.getCampaignById('nonexistent', 'user1', 'org1')
      ).rejects.toThrow('Campaign not found');
    });
  });

  describe('updateCampaign', () => {
    it('should update campaign successfully', async () => {
      const mockCampaign = {
        id: 'campaign1',
        status: CampaignStatus.DRAFT,
      };

      const updateData = {
        name: 'Updated Campaign',
        description: 'Updated Description',
      };

      const updatedCampaign = {
        ...mockCampaign,
        ...updateData,
      };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.unifiedCampaign.update.mockResolvedValue(updatedCampaign);

      const result = await service.updateCampaign('campaign1', updateData, 'user1', 'org1');

      expect(result).toEqual(updatedCampaign);
      expect(mockPrismaService.unifiedCampaign.update).toHaveBeenCalledWith({
        where: { id: 'campaign1' },
        data: updateData,
        include: expect.any(Object),
      });
    });

    it('should throw error when campaign not found', async () => {
      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCampaign('nonexistent', {}, 'user1', 'org1')
      ).rejects.toThrow('Campaign not found');
    });

    it('should throw error when updating non-draft campaign', async () => {
      const mockCampaign = {
        id: 'campaign1',
        status: CampaignStatus.SENT,
      };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(
        service.updateCampaign('campaign1', {}, 'user1', 'org1')
      ).rejects.toThrow('Only draft campaigns can be updated');
    });
  });

  describe('deleteCampaign', () => {
    it('should delete campaign successfully', async () => {
      const mockCampaign = {
        id: 'campaign1',
        status: CampaignStatus.DRAFT,
      };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.unifiedCampaign.delete.mockResolvedValue({});

      const result = await service.deleteCampaign('campaign1', 'user1', 'org1');

      expect(result).toEqual({ message: 'Campaign deleted successfully' });
      expect(mockPrismaService.unifiedCampaign.delete).toHaveBeenCalledWith({
        where: { id: 'campaign1' },
      });
    });

    it('should throw error when deleting active campaign', async () => {
      const mockCampaign = {
        id: 'campaign1',
        status: CampaignStatus.SENDING,
      };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(
        service.deleteCampaign('campaign1', 'user1', 'org1')
      ).rejects.toThrow('Cannot delete active or sent campaigns');
    });
  });

  describe('duplicateCampaign', () => {
    it('should duplicate campaign successfully', async () => {
      const originalCampaign = {
        id: 'campaign1',
        name: 'Original Campaign',
        description: 'Original Description',
        type: CampaignType.MULTI_CHANNEL,
        channels: [ChannelType.EMAIL],
        lists: [{ id: 'list1' }],
        segments: [{ id: 'segment1' }],
      };

      const duplicatedCampaign = {
        id: 'campaign2',
        name: 'Original Campaign (Copy)',
        status: CampaignStatus.DRAFT,
      };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(originalCampaign);
      mockPrismaService.unifiedCampaign.create.mockResolvedValue(duplicatedCampaign);

      const result = await service.duplicateCampaign('campaign1', 'user1', 'org1');

      expect(result).toEqual({
        message: 'Campaign duplicated successfully',
        originalCampaign: {
          id: 'campaign1',
          name: 'Original Campaign',
        },
        duplicatedCampaign: {
          id: 'campaign2',
          name: 'Original Campaign (Copy)',
          status: CampaignStatus.DRAFT,
        },
      });
    });
  });

  describe('sendCampaign', () => {
    it('should send campaign successfully', async () => {
      const mockCampaign = {
        id: 'campaign1',
        status: CampaignStatus.DRAFT,
        emailCampaigns: [{ id: 'email1' }],
        smsCampaigns: [{ id: 'sms1' }],
        whatsappCampaigns: [],
      };

      const mockEmailResult = { successCount: 10, failureCount: 0 };
      const mockSMSResult = { successCount: 8, failureCount: 2 };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.unifiedCampaign.update.mockResolvedValue({});
      mockEmailService.sendCampaign.mockResolvedValue(mockEmailResult);
      mockSMSService.sendCampaign.mockResolvedValue(mockSMSResult);

      const result = await service.sendCampaign('campaign1', {}, 'user1', 'org1');

      expect(result.message).toBe('Campaign sent successfully. 18 sent, 2 failed.');
      expect(result.successCount).toBe(18);
      expect(result.failureCount).toBe(2);
      expect(mockEmailService.sendCampaign).toHaveBeenCalledWith('email1', {}, 'user1', 'org1');
      expect(mockSMSService.sendCampaign).toHaveBeenCalledWith('sms1', {}, 'user1', 'org1');
    });

    it('should throw error when campaign not found', async () => {
      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(null);

      await expect(
        service.sendCampaign('nonexistent', {}, 'user1', 'org1')
      ).rejects.toThrow('Campaign not found');
    });

    it('should throw error when sending non-draft campaign', async () => {
      const mockCampaign = {
        id: 'campaign1',
        status: CampaignStatus.SENT,
      };

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);

      await expect(
        service.sendCampaign('campaign1', {}, 'user1', 'org1')
      ).rejects.toThrow('Campaign can only be sent from DRAFT status');
    });
  });

  describe('getCampaignAnalytics', () => {
    it('should return campaign analytics', async () => {
      const mockCampaign = {
        id: 'campaign1',
        name: 'Test Campaign',
        type: CampaignType.MULTI_CHANNEL,
        channels: [ChannelType.EMAIL],
        status: CampaignStatus.SENT,
        sentAt: new Date(),
      };

      const mockPerformance = [
        {
          channel: ChannelType.EMAIL,
          sent: 100,
          delivered: 95,
          opened: 50,
          clicked: 10,
          replied: 5,
          failed: 5,
          unsubscribed: 2,
          bounced: 3,
          cost: 10.0,
          revenue: 100.0,
        },
      ];

      mockPrismaService.unifiedCampaign.findFirst.mockResolvedValue(mockCampaign);
      mockPrismaService.campaignPerformance.findMany.mockResolvedValue(mockPerformance);

      const result = await service.getCampaignAnalytics('campaign1', {}, 'user1', 'org1');

      expect(result.campaign).toEqual(mockCampaign);
      expect(result.analytics.totalSent).toBe(100);
      expect(result.analytics.totalDelivered).toBe(95);
      expect(result.analytics.deliveryRate).toBe(95);
      expect(result.analytics.openRate).toBeCloseTo(52.63, 2);
    });
  });
});
