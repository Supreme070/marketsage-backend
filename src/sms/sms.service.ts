import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SMSProviderService } from './sms-provider.service';
import { CreateSMSCampaignDto, UpdateSMSCampaignDto, SMSCampaignQueryDto } from './dto/sms-campaign.dto';
import { CreateSMSTemplateDto, UpdateSMSTemplateDto, SMSTemplateQueryDto } from './dto/sms-template.dto';
import { CreateSMSProviderDto, UpdateSMSProviderDto, TestSMSProviderDto } from './dto/sms-provider.dto';
import { SendSMSCampaignDto, SMSCampaignAnalyticsDto } from './dto/sms-campaign.dto';

@Injectable()
export class SMSService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsProviderService: SMSProviderService,
  ) {}

  // ==================== SMS CAMPAIGNS ====================

  async createCampaign(data: CreateSMSCampaignDto, userId: string, organizationId: string) {
    const { templateId, listIds, segmentIds, ...campaignData } = data;

    // Validate template if provided
    if (templateId) {
      const template = await this.prisma.sMSTemplate.findFirst({
        where: { id: templateId, createdById: userId },
      });
      if (!template) {
        throw new NotFoundException('SMS template not found');
      }
    }

    // Validate lists if provided
    if (listIds && listIds.length > 0) {
      const lists = await this.prisma.list.findMany({
        where: { 
          id: { in: listIds },
          organizationId: organizationId,
        },
      });
      if (lists.length !== listIds.length) {
        throw new BadRequestException('One or more lists not found');
      }
    }

    // Validate segments if provided
    if (segmentIds && segmentIds.length > 0) {
      const segments = await this.prisma.segment.findMany({
        where: { 
          id: { in: segmentIds },
          createdById: userId,
        },
      });
      if (segments.length !== segmentIds.length) {
        throw new BadRequestException('One or more segments not found');
      }
    }

    const campaign = await this.prisma.sMSCampaign.create({
      data: {
        ...campaignData,
        createdById: userId,
        templateId: templateId,
        lists: listIds ? { connect: listIds.map(id => ({ id })) } : undefined,
        segments: segmentIds ? { connect: segmentIds.map(id => ({ id })) } : undefined,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        template: {
          select: { id: true, name: true, content: true },
        },
        lists: {
          select: { id: true, name: true },
        },
        segments: {
          select: { id: true, name: true },
        },
        _count: {
          select: { activities: true },
        },
      },
    });

    return campaign;
  }

  async getCampaigns(query: SMSCampaignQueryDto, userId: string, organizationId: string) {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      createdById: userId,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { from: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [campaigns, total] = await Promise.all([
      this.prisma.sMSCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          template: {
            select: { id: true, name: true, content: true },
          },
          lists: {
            select: { id: true, name: true },
          },
          segments: {
            select: { id: true, name: true },
          },
          _count: {
            select: { activities: true },
          },
        },
      }),
      this.prisma.sMSCampaign.count({ where }),
    ]);

    return {
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getCampaignById(id: string, userId: string, organizationId: string) {
    const campaign = await this.prisma.sMSCampaign.findFirst({
      where: { 
        id: id,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        template: {
          select: { id: true, name: true, content: true },
        },
        lists: {
          select: { id: true, name: true },
        },
        segments: {
          select: { id: true, name: true },
        },
        activities: {
          include: {
            contact: {
              select: { id: true, phone: true, firstName: true, lastName: true },
            },
          },
          orderBy: { timestamp: 'desc' },
        },
        _count: {
          select: { activities: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('SMS campaign not found');
    }

    return campaign;
  }

  async updateCampaign(id: string, data: UpdateSMSCampaignDto, userId: string, organizationId: string) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    const { templateId, listIds, segmentIds, ...updateData } = data;

    // Validate template if provided
    if (templateId) {
      const template = await this.prisma.sMSTemplate.findFirst({
        where: { id: templateId, createdById: userId },
      });
      if (!template) {
        throw new NotFoundException('SMS template not found');
      }
    }

    const updatedCampaign = await this.prisma.sMSCampaign.update({
      where: { id },
      data: {
        ...updateData,
        templateId: templateId,
        lists: listIds ? { 
          set: [],
          connect: listIds.map(id => ({ id })),
        } : undefined,
        segments: segmentIds ? { 
          set: [],
          connect: segmentIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        template: {
          select: { id: true, name: true, content: true },
        },
        lists: {
          select: { id: true, name: true },
        },
        segments: {
          select: { id: true, name: true },
        },
        _count: {
          select: { activities: true },
        },
      },
    });

    return updatedCampaign;
  }

  async deleteCampaign(id: string, userId: string, organizationId: string) {
    await this.getCampaignById(id, userId, organizationId);

    await this.prisma.sMSCampaign.delete({
      where: { id },
    });

    return { message: 'SMS campaign deleted successfully' };
  }

  async duplicateCampaign(id: string, userId: string, organizationId: string) {
    // Get the original campaign
    const originalCampaign = await this.getCampaignById(id, userId, organizationId);

    // Create the duplicated campaign data
    const duplicatedData: CreateSMSCampaignDto = {
      name: `${originalCampaign.name} (Copy)`,
      description: originalCampaign.description || undefined,
      from: originalCampaign.from,
      content: originalCampaign.content || undefined,
      templateId: originalCampaign.templateId || undefined,
      listIds: originalCampaign.lists?.map(list => list.id),
      segmentIds: originalCampaign.segments?.map(segment => segment.id),
    };

    // Create the new campaign
    const duplicatedCampaign = await this.createCampaign(duplicatedData, userId, organizationId);

    return {
      message: 'SMS campaign duplicated successfully',
      originalCampaign: {
        id: originalCampaign.id,
        name: originalCampaign.name,
      },
      duplicatedCampaign: {
        id: duplicatedCampaign.id,
        name: duplicatedCampaign.name,
        status: duplicatedCampaign.status,
      },
    };
  }

  async sendCampaign(id: string, data: SendSMSCampaignDto, userId: string, organizationId: string) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    if (campaign.status !== 'DRAFT') {
      throw new BadRequestException('Campaign can only be sent from DRAFT status');
    }

    // Get SMS provider for the organization
    const smsProvider = await this.prisma.sMSProvider.findFirst({
      where: { 
        organizationId: organizationId,
        isActive: true,
        verificationStatus: 'verified',
      },
    });

    if (!smsProvider) {
      throw new BadRequestException('No active SMS provider found for organization');
    }

    // Get recipients from lists and segments
    const recipients = await this.getCampaignRecipients(campaign.id);

    if (recipients.length === 0) {
      throw new BadRequestException('No recipients found for campaign');
    }

    // Update campaign status to SENDING
    const updatedCampaign = await this.prisma.sMSCampaign.update({
      where: { id },
      data: {
        status: 'SENDING',
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : new Date(),
      },
    });

    // Send SMS to each recipient
    const smsResults = [];
    const activities: any[] = [];
    const smsHistoryEntries: any[] = [];

    for (const recipient of recipients) {
      try {
        const message = campaign.content || campaign.template?.content || '';
        
        // Send SMS via provider
        const smsResult = await this.smsProviderService.sendSMS(
          (recipient as any).phone,
          message,
          smsProvider
        );

        smsResults.push(smsResult);

        // Create activity record
        activities.push({
          campaignId: campaign.id,
          contactId: (recipient as any).id,
          type: smsResult.success ? 'SENT' : 'FAILED',
          metadata: JSON.stringify({
            sentAt: new Date(),
            provider: smsProvider.provider,
            messageId: smsResult.messageId,
            error: smsResult.error,
          }),
        });

        // Create SMS history entry
        smsHistoryEntries.push({
          to: (recipient as any).phone,
          from: campaign.from,
          message: message,
          originalMessage: message,
          contactId: (recipient as any).id,
          userId: userId,
          status: smsResult.success ? 'SENT' : 'FAILED',
          messageId: smsResult.messageId,
          error: smsResult.error ? JSON.stringify(smsResult.error) : null,
          metadata: JSON.stringify({
            campaignId: campaign.id,
            provider: smsProvider.provider,
            cost: smsResult.cost,
          }),
        });

      } catch (error) {
        // Handle individual SMS sending errors
        activities.push({
          campaignId: campaign.id,
          contactId: (recipient as any).id,
          type: 'FAILED',
          metadata: JSON.stringify({
            sentAt: new Date(),
            provider: smsProvider.provider,
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        });

        smsHistoryEntries.push({
          to: (recipient as any).phone,
          from: campaign.from,
          message: campaign.content || campaign.template?.content || '',
          originalMessage: campaign.content || campaign.template?.content || '',
          contactId: (recipient as any).id,
          userId: userId,
          status: 'FAILED',
          error: JSON.stringify({
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'SMS_SENDING_ERROR'
          }),
          metadata: JSON.stringify({
            campaignId: campaign.id,
            provider: smsProvider.provider,
          }),
        });
      }
    }

    // Batch create activities and history entries
    await Promise.all([
      this.prisma.sMSActivity.createMany({
        data: activities,
      }),
      this.prisma.sMSHistory.createMany({
        data: smsHistoryEntries,
      }),
    ]);

    // Update campaign status to SENT
    const finalCampaign = await this.prisma.sMSCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    const successCount = smsResults.filter(r => r.success).length;
    const failureCount = smsResults.filter(r => !r.success).length;

    return {
      message: `Campaign sent successfully. ${successCount} sent, ${failureCount} failed.`,
      campaign: finalCampaign,
      recipientsCount: recipients.length,
      successCount,
      failureCount,
      results: smsResults,
    };
  }

  async getCampaignAnalytics(id: string, query: SMSCampaignAnalyticsDto, userId: string, organizationId: string) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    const { startDate, endDate } = query;
    const dateFilter: any = {};

    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const activities = await this.prisma.sMSActivity.findMany({
      where: {
        campaignId: id,
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter }),
      },
    });

    // Calculate analytics
    const analytics = {
      totalSent: activities.filter(a => a.type === 'SENT').length,
      totalDelivered: activities.filter(a => a.type === 'DELIVERED').length,
      totalFailed: activities.filter(a => a.type === 'FAILED').length,
      totalBounced: activities.filter(a => a.type === 'BOUNCED').length,
      totalUnsubscribed: activities.filter(a => a.type === 'UNSUBSCRIBED').length,
      deliveryRate: 0,
      failureRate: 0,
      bounceRate: 0,
      unsubscribeRate: 0,
    };

    if (analytics.totalSent > 0) {
      analytics.deliveryRate = (analytics.totalDelivered / analytics.totalSent) * 100;
      analytics.failureRate = (analytics.totalFailed / analytics.totalSent) * 100;
      analytics.bounceRate = (analytics.totalBounced / analytics.totalSent) * 100;
      analytics.unsubscribeRate = (analytics.totalUnsubscribed / analytics.totalSent) * 100;
    }

    return {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        from: campaign.from,
        status: campaign.status,
        sentAt: campaign.sentAt,
      },
      analytics,
      activities: activities.slice(0, 100), // Return recent activities
    };
  }

  private async getCampaignRecipients(campaignId: string) {
    const campaign = await this.prisma.sMSCampaign.findUnique({
      where: { id: campaignId },
      include: {
        lists: true,
        segments: true,
      },
    });

    if (!campaign) {
      return [];
    }

    const recipients = new Set();

    // Get contacts from lists
    if (campaign.lists.length > 0) {
      const listIds = campaign.lists.map((list: any) => list.id);
      const listMembers = await this.prisma.listMember.findMany({
        where: { listId: { in: listIds } },
        include: { contact: true },
      });

      listMembers.forEach((member: any) => {
        if (member.contact.phone) {
          recipients.add(member.contact);
        }
      });
    }

    // Get contacts from segments
    if (campaign.segments.length > 0) {
      const segmentIds = campaign.segments.map((segment: any) => segment.id);
      const segmentMembers = await this.prisma.segmentMember.findMany({
        where: { segmentId: { in: segmentIds } },
        include: { contact: true },
      });

      segmentMembers.forEach((member: any) => {
        if (member.contact.phone) {
          recipients.add(member.contact);
        }
      });
    }

    return Array.from(recipients);
  }

  // ==================== SMS TEMPLATES ====================

  async createTemplate(data: CreateSMSTemplateDto, userId: string) {
    const template = await this.prisma.sMSTemplate.create({
      data: {
        ...data,
        variables: data.variables ? JSON.stringify(data.variables) : '[]',
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { campaigns: true },
        },
      },
    });

    return template;
  }

  async getTemplates(query: SMSTemplateQueryDto, userId: string) {
    const { page = 1, limit = 10, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      createdById: userId,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [templates, total] = await Promise.all([
      this.prisma.sMSTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { campaigns: true },
          },
        },
      }),
      this.prisma.sMSTemplate.count({ where }),
    ]);

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTemplateById(id: string, userId: string) {
    const template = await this.prisma.sMSTemplate.findFirst({
      where: { 
        id: id,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        campaigns: {
          select: { id: true, name: true, status: true, sentAt: true },
        },
        _count: {
          select: { campaigns: true },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('SMS template not found');
    }

    return template;
  }

  async updateTemplate(id: string, data: UpdateSMSTemplateDto, userId: string) {
    await this.getTemplateById(id, userId);

    const updatedTemplate = await this.prisma.sMSTemplate.update({
      where: { id },
      data: {
        ...data,
        variables: data.variables ? JSON.stringify(data.variables) : undefined,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { campaigns: true },
        },
      },
    });

    return updatedTemplate;
  }

  async deleteTemplate(id: string, userId: string) {
    await this.getTemplateById(id, userId);

    await this.prisma.sMSTemplate.delete({
      where: { id },
    });

    return { message: 'SMS template deleted successfully' };
  }

  // ==================== SMS PROVIDERS ====================

  async createProvider(data: CreateSMSProviderDto, organizationId: string) {
    // Check if organization already has a provider
    const existingProvider = await this.prisma.sMSProvider.findFirst({
      where: { organizationId },
    });

    if (existingProvider) {
      throw new BadRequestException('Organization already has an SMS provider');
    }

    const provider = await this.prisma.sMSProvider.create({
      data: {
        ...data,
        organizationId,
        credentials: JSON.stringify({
          apiKey: data.apiKey,
          apiSecret: data.apiSecret,
          username: data.username,
          password: data.password,
          baseUrl: data.baseUrl,
        }),
      },
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    return provider;
  }

  async getProviders(organizationId: string) {
    // Handle case where organizationId is null
    if (!organizationId) {
      return [];
    }

    const providers = await this.prisma.sMSProvider.findMany({
      where: { organizationId },
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    return providers;
  }

  async getProviderById(id: string, organizationId: string) {
    const provider = await this.prisma.sMSProvider.findFirst({
      where: { 
        id: id,
        organizationId: organizationId,
      },
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('SMS provider not found');
    }

    return provider;
  }

  async updateProvider(id: string, data: UpdateSMSProviderDto, organizationId: string) {
    await this.getProviderById(id, organizationId);

    const updateData: any = { ...data };
    
    // Update credentials if any credential fields are provided
    if (data.apiKey || data.apiSecret || data.username || data.password || data.baseUrl) {
      const existingProvider = await this.prisma.sMSProvider.findUnique({
        where: { id },
      });
      
      const existingCredentials = existingProvider ? JSON.parse(existingProvider.credentials as string) : {};
      
      updateData.credentials = JSON.stringify({
        ...existingCredentials,
        ...(data.apiKey && { apiKey: data.apiKey }),
        ...(data.apiSecret && { apiSecret: data.apiSecret }),
        ...(data.username && { username: data.username }),
        ...(data.password && { password: data.password }),
        ...(data.baseUrl && { baseUrl: data.baseUrl }),
      });
      
      // Remove individual credential fields from updateData
      delete updateData.apiKey;
      delete updateData.apiSecret;
      delete updateData.username;
      delete updateData.password;
      delete updateData.baseUrl;
    }

    const updatedProvider = await this.prisma.sMSProvider.update({
      where: { id },
      data: updateData,
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    return updatedProvider;
  }

  async deleteProvider(id: string, organizationId: string) {
    await this.getProviderById(id, organizationId);

    await this.prisma.sMSProvider.delete({
      where: { id },
    });

    return { message: 'SMS provider deleted successfully' };
  }

  async testProvider(id: string, data: TestSMSProviderDto, organizationId: string) {
    const provider = await this.getProviderById(id, organizationId);

    try {
      // Test the provider connection
      const isConnected = await this.smsProviderService.testProvider(provider);
      
      const testResult = {
        success: isConnected,
        message: isConnected ? 'Test SMS sent successfully' : 'Test SMS failed',
        timestamp: new Date(),
      };

      // Update provider with test results
      await this.prisma.sMSProvider.update({
        where: { id },
        data: {
          verificationStatus: testResult.success ? 'verified' : 'failed',
        },
      });

      return testResult;
    } catch (error) {
      const testResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Test SMS failed',
        timestamp: new Date(),
      };

      // Update provider with test results
      await this.prisma.sMSProvider.update({
        where: { id },
        data: {
          verificationStatus: 'failed',
        },
      });

      return testResult;
    }
  }

  // ==================== SMS TRACKING ====================

  async trackSMSActivity(campaignId: string, contactId: string, type: string, metadata?: any) {
    const activity = await this.prisma.sMSActivity.create({
      data: {
        campaignId,
        contactId,
        type: type as any,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      include: {
        campaign: {
          select: { id: true, name: true, from: true },
        },
        contact: {
          select: { id: true, phone: true, firstName: true, lastName: true },
        },
      },
    });

    return activity;
  }

  async unsubscribeContact(contactId: string, campaignId?: string) {
    // Mark contact as unsubscribed by updating status
    await this.prisma.contact.update({
      where: { id: contactId },
      data: { 
        status: 'UNSUBSCRIBED' as any,
        updatedAt: new Date(),
      },
    });

    // Create unsubscribe activity if campaign is specified
    if (campaignId) {
      await this.prisma.sMSActivity.create({
        data: {
          campaignId,
          contactId,
          type: 'UNSUBSCRIBED',
          metadata: JSON.stringify({
            unsubscribedAt: new Date(),
          }),
        },
      });
    }

    return { message: 'Contact unsubscribed successfully' };
  }
}
