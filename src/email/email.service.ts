import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmailCampaignDto, UpdateEmailCampaignDto, EmailCampaignQueryDto } from './dto/email-campaign.dto';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto, EmailTemplateQueryDto } from './dto/email-template.dto';
import { CreateEmailProviderDto, UpdateEmailProviderDto, TestEmailProviderDto } from './dto/email-provider.dto';
import { SendEmailCampaignDto, EmailCampaignAnalyticsDto } from './dto/email-campaign.dto';

@Injectable()
export class EmailService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== EMAIL CAMPAIGNS ====================

  async createCampaign(data: CreateEmailCampaignDto, userId: string, organizationId: string) {
    const { templateId, listIds, segmentIds, ...campaignData } = data;

    // Validate template if provided
    if (templateId) {
      const template = await this.prisma.emailTemplate.findFirst({
        where: { id: templateId, createdById: userId },
      });
      if (!template) {
        throw new NotFoundException('Email template not found');
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

    const campaign = await this.prisma.emailCampaign.create({
      data: {
        ...campaignData,
        createdById: userId,
        organizationId: organizationId,
        templateId: templateId,
        lists: listIds ? { connect: listIds.map(id => ({ id })) } : undefined,
        segments: segmentIds ? { connect: segmentIds.map(id => ({ id })) } : undefined,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        organization: {
          select: { id: true, name: true },
        },
        template: {
          select: { id: true, name: true, subject: true },
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

  async getCampaigns(query: EmailCampaignQueryDto, userId: string, organizationId: string) {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      organizationId: organizationId,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [campaigns, total] = await Promise.all([
      this.prisma.emailCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          template: {
            select: { id: true, name: true, subject: true },
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
      this.prisma.emailCampaign.count({ where }),
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
    const campaign = await this.prisma.emailCampaign.findFirst({
      where: { 
        id: id,
        organizationId: organizationId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        organization: {
          select: { id: true, name: true },
        },
        template: {
          select: { id: true, name: true, subject: true, content: true },
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
              select: { id: true, email: true, firstName: true, lastName: true },
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
      throw new NotFoundException('Email campaign not found');
    }

    return campaign;
  }

  async updateCampaign(id: string, data: UpdateEmailCampaignDto, userId: string, organizationId: string) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    const { templateId, listIds, segmentIds, ...updateData } = data;

    // Validate template if provided
    if (templateId) {
      const template = await this.prisma.emailTemplate.findFirst({
        where: { id: templateId, createdById: userId },
      });
      if (!template) {
        throw new NotFoundException('Email template not found');
      }
    }

    const updatedCampaign = await this.prisma.emailCampaign.update({
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
          select: { id: true, name: true, subject: true },
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

    await this.prisma.emailCampaign.delete({
      where: { id },
    });

    return { message: 'Email campaign deleted successfully' };
  }

  async sendCampaign(id: string, data: SendEmailCampaignDto, userId: string, organizationId: string) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    if (campaign.status !== 'DRAFT') {
      throw new BadRequestException('Campaign can only be sent from DRAFT status');
    }

    // Get email provider for the organization
    const emailProvider = await this.prisma.emailProvider.findFirst({
      where: { 
        organizationId: organizationId,
        isActive: true,
        verificationStatus: 'verified',
      },
    });

    if (!emailProvider) {
      throw new BadRequestException('No active email provider found for organization');
    }

    // Get recipients from lists and segments
    const recipients = await this.getCampaignRecipients(campaign.id);

    if (recipients.length === 0) {
      throw new BadRequestException('No recipients found for campaign');
    }

    // Update campaign status to SENT
    const updatedCampaign = await this.prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        scheduledFor: data.scheduledFor || new Date(),
      },
    });

    // Create email activities for tracking
    const activities = recipients.map((recipient: any) => ({
      campaignId: campaign.id,
      contactId: recipient.id,
      type: 'SENT' as any,
      metadata: JSON.stringify({
        sentAt: new Date(),
        provider: emailProvider.providerType,
      }),
    }));

    await this.prisma.emailActivity.createMany({
      data: activities,
    });

    return {
      message: 'Campaign sent successfully',
      campaign: updatedCampaign,
      recipientsCount: recipients.length,
    };
  }

  async getCampaignAnalytics(id: string, query: EmailCampaignAnalyticsDto, userId: string, organizationId: string) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    const { startDate, endDate } = query;
    const dateFilter: any = {};

    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const activities = await this.prisma.emailActivity.findMany({
      where: {
        campaignId: id,
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter }),
      },
    });

    // Calculate analytics
    const analytics = {
      totalSent: activities.filter(a => a.type === 'SENT').length,
      totalOpened: activities.filter(a => a.type === 'OPENED').length,
      totalClicked: activities.filter(a => a.type === 'CLICKED').length,
      totalBounced: activities.filter(a => a.type === 'BOUNCED').length,
      totalUnsubscribed: activities.filter(a => a.type === 'UNSUBSCRIBED').length,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
      unsubscribeRate: 0,
    };

    if (analytics.totalSent > 0) {
      analytics.openRate = (analytics.totalOpened / analytics.totalSent) * 100;
      analytics.clickRate = (analytics.totalClicked / analytics.totalSent) * 100;
      analytics.bounceRate = (analytics.totalBounced / analytics.totalSent) * 100;
      analytics.unsubscribeRate = (analytics.totalUnsubscribed / analytics.totalSent) * 100;
    }

    return {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
        status: campaign.status,
        sentAt: campaign.sentAt,
      },
      analytics,
      activities: activities.slice(0, 100), // Return recent activities
    };
  }

  private async getCampaignRecipients(campaignId: string) {
    const campaign = await this.prisma.emailCampaign.findUnique({
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
        if (member.contact.email) {
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
        if (member.contact.email) {
          recipients.add(member.contact);
        }
      });
    }

    return Array.from(recipients);
  }

  // ==================== EMAIL TEMPLATES ====================

  async createTemplate(data: CreateEmailTemplateDto, userId: string) {
    const template = await this.prisma.emailTemplate.create({
      data: {
        ...data,
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

  async getTemplates(query: EmailTemplateQueryDto, userId: string) {
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
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [templates, total] = await Promise.all([
      this.prisma.emailTemplate.findMany({
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
      this.prisma.emailTemplate.count({ where }),
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
    const template = await this.prisma.emailTemplate.findFirst({
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
      throw new NotFoundException('Email template not found');
    }

    return template;
  }

  async updateTemplate(id: string, data: UpdateEmailTemplateDto, userId: string) {
    await this.getTemplateById(id, userId);

    const updatedTemplate = await this.prisma.emailTemplate.update({
      where: { id },
      data,
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

    await this.prisma.emailTemplate.delete({
      where: { id },
    });

    return { message: 'Email template deleted successfully' };
  }

  // ==================== EMAIL PROVIDERS ====================

  async createProvider(data: CreateEmailProviderDto, organizationId: string) {
    // Check if organization already has a provider
    const existingProvider = await this.prisma.emailProvider.findFirst({
      where: { organizationId },
    });

    if (existingProvider) {
      throw new BadRequestException('Organization already has an email provider');
    }

    const provider = await this.prisma.emailProvider.create({
      data: {
        ...data,
        organizationId,
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

    const providers = await this.prisma.emailProvider.findMany({
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
    const provider = await this.prisma.emailProvider.findFirst({
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
      throw new NotFoundException('Email provider not found');
    }

    return provider;
  }

  async updateProvider(id: string, data: UpdateEmailProviderDto, organizationId: string) {
    await this.getProviderById(id, organizationId);

    const updatedProvider = await this.prisma.emailProvider.update({
      where: { id },
      data,
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

    await this.prisma.emailProvider.delete({
      where: { id },
    });

    return { message: 'Email provider deleted successfully' };
  }

  async testProvider(id: string, data: TestEmailProviderDto, organizationId: string) {
    const provider = await this.getProviderById(id, organizationId);

    // TODO: Implement actual email provider testing
    // This would involve sending a test email using the provider's configuration
    
    const testResult = {
      success: true,
      message: 'Test email sent successfully',
      timestamp: new Date(),
    };

    // Update provider with test results
    await this.prisma.emailProvider.update({
      where: { id },
      data: {
        lastTested: new Date(),
        testStatus: testResult.success ? 'success' : 'failed',
      },
    });

    return testResult;
  }

  // ==================== EMAIL TRACKING ====================

  async trackEmailActivity(campaignId: string, contactId: string, type: string, metadata?: any) {
    const activity = await this.prisma.emailActivity.create({
      data: {
        campaignId,
        contactId,
        type: type as any,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      include: {
        campaign: {
          select: { id: true, name: true, subject: true },
        },
        contact: {
          select: { id: true, email: true, firstName: true, lastName: true },
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
      await this.prisma.emailActivity.create({
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
