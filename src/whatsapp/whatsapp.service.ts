import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppProviderService } from './whatsapp-provider.service';
import { 
  CreateWhatsAppCampaignDto, 
  UpdateWhatsAppCampaignDto, 
  WhatsAppCampaignQueryDto,
  SendWhatsAppCampaignDto,
  WhatsAppCampaignAnalyticsDto,
} from './dto/whatsapp-campaign.dto';
import { 
  CreateWhatsAppTemplateDto, 
  UpdateWhatsAppTemplateDto, 
  WhatsAppTemplateQueryDto,
  SubmitWhatsAppTemplateDto,
  ApproveWhatsAppTemplateDto,
  RejectWhatsAppTemplateDto,
} from './dto/whatsapp-campaign.dto';
import { 
  CreateWhatsAppProviderDto, 
  UpdateWhatsAppProviderDto, 
  TestWhatsAppProviderDto,
} from './dto/whatsapp-campaign.dto';

@Injectable()
export class WhatsAppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappProviderService: WhatsAppProviderService,
  ) {}

  // ==================== WHATSAPP CAMPAIGNS ====================

  async createCampaign(data: CreateWhatsAppCampaignDto, userId: string, organizationId: string | null) {
    const { templateId, listIds, segmentIds, ...campaignData } = data;

    // Validate template if provided
    if (templateId) {
      const template = await this.prisma.whatsAppTemplate.findFirst({
        where: { id: templateId, createdById: userId },
      });
      if (!template) {
        throw new NotFoundException('WhatsApp template not found');
      }
    }

    // Validate lists if provided
    if (listIds && listIds.length > 0) {
      if (!organizationId) {
        throw new BadRequestException('Organization ID is required for list validation');
      }
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

    const campaign = await this.prisma.whatsAppCampaign.create({
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

  async getCampaigns(query: WhatsAppCampaignQueryDto, userId: string, organizationId: string | null) {
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
      this.prisma.whatsAppCampaign.findMany({
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
      this.prisma.whatsAppCampaign.count({ where }),
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

  async getCampaignById(id: string, userId: string, organizationId: string | null) {
    const campaign = await this.prisma.whatsAppCampaign.findFirst({
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
      throw new NotFoundException('WhatsApp campaign not found');
    }

    return campaign;
  }

  async updateCampaign(id: string, data: UpdateWhatsAppCampaignDto, userId: string, organizationId: string | null) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    const { templateId, listIds, segmentIds, ...updateData } = data;

    // Validate template if provided
    if (templateId) {
      const template = await this.prisma.whatsAppTemplate.findFirst({
        where: { id: templateId, createdById: userId },
      });
      if (!template) {
        throw new NotFoundException('WhatsApp template not found');
      }
    }

    const updatedCampaign = await this.prisma.whatsAppCampaign.update({
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

  async deleteCampaign(id: string, userId: string, organizationId: string | null) {
    await this.getCampaignById(id, userId, organizationId);

    await this.prisma.whatsAppCampaign.delete({
      where: { id },
    });

    return { message: 'WhatsApp campaign deleted successfully' };
  }

  async duplicateCampaign(id: string, userId: string, organizationId: string | null) {
    // Get the original campaign
    const originalCampaign = await this.getCampaignById(id, userId, organizationId);

    // Create the duplicated campaign data
    const duplicatedData: CreateWhatsAppCampaignDto = {
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
      message: 'WhatsApp campaign duplicated successfully',
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

  async sendCampaign(id: string, data: SendWhatsAppCampaignDto, userId: string, organizationId: string | null) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    if (campaign.status !== 'DRAFT') {
      throw new BadRequestException('Campaign can only be sent from DRAFT status');
    }

    // Get WhatsApp provider for the organization
    let whatsappProvider = null;
    if (organizationId) {
      whatsappProvider = await this.prisma.whatsAppBusinessConfig.findFirst({
        where: { 
          organizationId: organizationId,
          isActive: true,
          verificationStatus: 'verified',
        },
      });
    }

    if (!whatsappProvider) {
      throw new BadRequestException('No active WhatsApp provider found for organization');
    }

    // Get recipients from lists and segments
    const recipients = await this.getCampaignRecipients(campaign.id);

    if (recipients.length === 0) {
      throw new BadRequestException('No recipients found for campaign');
    }

    // Update campaign status to SENDING
    const updatedCampaign = await this.prisma.whatsAppCampaign.update({
      where: { id },
      data: {
        status: 'SENDING',
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : new Date(),
      },
    });

    // Send WhatsApp message to each recipient
    const whatsappResults = [];
    const activities: any[] = [];
    const whatsappHistoryEntries: any[] = [];

    for (const recipient of recipients) {
      try {
        const message = campaign.content || campaign.template?.content || '';
        
        // Send WhatsApp message via provider
        const whatsappResult = await this.whatsappProviderService.sendMessage(
          (recipient as any).phone,
          message,
          whatsappProvider
        );

        whatsappResults.push(whatsappResult);

        // Create activity record
        activities.push({
          campaignId: campaign.id,
          contactId: (recipient as any).id,
          type: whatsappResult.success ? 'SENT' : 'FAILED',
          metadata: JSON.stringify({
            sentAt: new Date(),
            provider: 'meta_whatsapp',
            messageId: whatsappResult.messageId,
            error: whatsappResult.error,
          }),
        });

        // Create WhatsApp history entry
        whatsappHistoryEntries.push({
          to: (recipient as any).phone,
          message: message,
          originalMessage: message,
          contactId: (recipient as any).id,
          templateId: campaign.templateId,
          userId: userId,
          status: whatsappResult.success ? 'SENT' : 'FAILED',
          messageId: whatsappResult.messageId,
          error: whatsappResult.error ? JSON.stringify(whatsappResult.error) : null,
          metadata: JSON.stringify({
            campaignId: campaign.id,
            provider: 'meta_whatsapp',
            cost: whatsappResult.cost,
          }),
        });

      } catch (error) {
        // Handle individual WhatsApp sending errors
        activities.push({
          campaignId: campaign.id,
          contactId: (recipient as any).id,
          type: 'FAILED',
          metadata: JSON.stringify({
            sentAt: new Date(),
            provider: 'meta_whatsapp',
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        });

        whatsappHistoryEntries.push({
          to: (recipient as any).phone,
          message: campaign.content || campaign.template?.content || '',
          originalMessage: campaign.content || campaign.template?.content || '',
          contactId: (recipient as any).id,
          templateId: campaign.templateId,
          userId: userId,
          status: 'FAILED',
          error: JSON.stringify({
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'WHATSAPP_SENDING_ERROR'
          }),
          metadata: JSON.stringify({
            campaignId: campaign.id,
            provider: 'meta_whatsapp',
          }),
        });
      }
    }

    // Batch create activities and history entries
    await Promise.all([
      this.prisma.whatsAppActivity.createMany({
        data: activities,
      }),
      this.prisma.whatsAppHistory.createMany({
        data: whatsappHistoryEntries,
      }),
    ]);

    // Update campaign status to SENT
    const finalCampaign = await this.prisma.whatsAppCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    const successCount = whatsappResults.filter(r => r.success).length;
    const failureCount = whatsappResults.filter(r => !r.success).length;

    return {
      message: `Campaign sent successfully. ${successCount} sent, ${failureCount} failed.`,
      campaign: finalCampaign,
      recipientsCount: recipients.length,
      successCount,
      failureCount,
      results: whatsappResults,
    };
  }

  async getCampaignAnalytics(id: string, query: WhatsAppCampaignAnalyticsDto, userId: string, organizationId: string | null) {
    const campaign = await this.getCampaignById(id, userId, organizationId);

    const { startDate, endDate } = query;
    const dateFilter: any = {};

    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const activities = await this.prisma.whatsAppActivity.findMany({
      where: {
        campaignId: id,
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter }),
      },
    });

    // Calculate analytics
    const analytics = {
      totalSent: activities.filter(a => a.type === 'SENT').length,
      totalDelivered: activities.filter(a => a.type === 'DELIVERED').length,
      totalRead: activities.filter(a => a.type === 'READ' as any).length,
      totalFailed: activities.filter(a => a.type === 'FAILED').length,
      totalBounced: activities.filter(a => a.type === 'BOUNCED').length,
      totalUnsubscribed: activities.filter(a => a.type === 'UNSUBSCRIBED').length,
      deliveryRate: 0,
      readRate: 0,
      failureRate: 0,
      bounceRate: 0,
      unsubscribeRate: 0,
    };

    if (analytics.totalSent > 0) {
      analytics.deliveryRate = (analytics.totalDelivered / analytics.totalSent) * 100;
      analytics.readRate = (analytics.totalRead / analytics.totalSent) * 100;
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
    const campaign = await this.prisma.whatsAppCampaign.findUnique({
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

  // ==================== WHATSAPP TEMPLATES ====================

  async createTemplate(data: CreateWhatsAppTemplateDto, userId: string) {
    const template = await this.prisma.whatsAppTemplate.create({
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

  async getTemplates(query: WhatsAppTemplateQueryDto, userId: string) {
    const { page = 1, limit = 10, category, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      createdById: userId,
    };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [templates, total] = await Promise.all([
      this.prisma.whatsAppTemplate.findMany({
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
      this.prisma.whatsAppTemplate.count({ where }),
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
    const template = await this.prisma.whatsAppTemplate.findFirst({
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
      throw new NotFoundException('WhatsApp template not found');
    }

    return template;
  }

  async updateTemplate(id: string, data: UpdateWhatsAppTemplateDto, userId: string) {
    await this.getTemplateById(id, userId);

    const updatedTemplate = await this.prisma.whatsAppTemplate.update({
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

    await this.prisma.whatsAppTemplate.delete({
      where: { id },
    });

    return { message: 'WhatsApp template deleted successfully' };
  }

  async submitTemplate(data: SubmitWhatsAppTemplateDto, userId: string, organizationId: string | null) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required for template submission');
    }

    const whatsappProvider = await this.prisma.whatsAppBusinessConfig.findFirst({
      where: { 
        organizationId: organizationId,
        isActive: true,
      },
    });

    if (!whatsappProvider) {
      throw new BadRequestException('No active WhatsApp provider found for organization');
    }

    // Submit template to Meta WhatsApp Business API
    const result = await this.whatsappProviderService.submitTemplate(whatsappProvider, data);

    if (result.success) {
      // Create template record in database
      const template = await this.prisma.whatsAppTemplate.create({
        data: {
          name: data.name,
          content: JSON.stringify(data.components),
          variables: '[]',
          category: data.category,
          status: 'PENDING',
          createdById: userId,
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return {
        message: 'Template submitted successfully',
        template,
        submissionResult: result,
      };
    } else {
      throw new BadRequestException(result.error?.message || 'Template submission failed');
    }
  }

  async approveTemplate(id: string, data: ApproveWhatsAppTemplateDto, userId: string) {
    const template = await this.getTemplateById(id, userId);

    const updatedTemplate = await this.prisma.whatsAppTemplate.update({
      where: { id },
      data: {
        status: 'APPROVED',
      },
    });

    return {
      message: 'Template approved successfully',
      template: updatedTemplate,
    };
  }

  async rejectTemplate(id: string, data: RejectWhatsAppTemplateDto, userId: string) {
    const template = await this.getTemplateById(id, userId);

    const updatedTemplate = await this.prisma.whatsAppTemplate.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });

    return {
      message: 'Template rejected successfully',
      template: updatedTemplate,
    };
  }

  // ==================== WHATSAPP PROVIDERS ====================

  async createProvider(data: CreateWhatsAppProviderDto, organizationId: string | null) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required for WhatsApp provider creation');
    }

    // Check if organization already has a provider
    const existingProvider = await this.prisma.whatsAppBusinessConfig.findFirst({
      where: { organizationId },
    });

    if (existingProvider) {
      throw new BadRequestException('Organization already has a WhatsApp provider');
    }

    const provider = await this.prisma.whatsAppBusinessConfig.create({
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

  async getProviders(organizationId: string | null) {
    if (!organizationId) {
      return [];
    }

    const providers = await this.prisma.whatsAppBusinessConfig.findMany({
      where: { organizationId },
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    return providers;
  }

  async getProviderById(id: string, organizationId: string | null) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    const provider = await this.prisma.whatsAppBusinessConfig.findFirst({
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
      throw new NotFoundException('WhatsApp provider not found');
    }

    return provider;
  }

  async updateProvider(id: string, data: UpdateWhatsAppProviderDto, organizationId: string | null) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    await this.getProviderById(id, organizationId);

    const updatedProvider = await this.prisma.whatsAppBusinessConfig.update({
      where: { id },
      data: data,
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    return updatedProvider;
  }

  async deleteProvider(id: string, organizationId: string | null) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    await this.getProviderById(id, organizationId);

    await this.prisma.whatsAppBusinessConfig.delete({
      where: { id },
    });

    return { message: 'WhatsApp provider deleted successfully' };
  }

  async testProvider(id: string, data: TestWhatsAppProviderDto, organizationId: string | null) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    const provider = await this.getProviderById(id, organizationId);

    try {
      // Test the provider connection
      const isConnected = await this.whatsappProviderService.testProvider(provider);
      
      const testResult = {
        success: isConnected,
        message: isConnected ? 'Test WhatsApp message sent successfully' : 'Test WhatsApp message failed',
        timestamp: new Date(),
      };

      // Update provider with test results
      await this.prisma.whatsAppBusinessConfig.update({
        where: { id },
        data: {
          verificationStatus: testResult.success ? 'verified' : 'failed',
        },
      });

      return testResult;
    } catch (error) {
      const testResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Test WhatsApp message failed',
        timestamp: new Date(),
      };

      // Update provider with test results
      await this.prisma.whatsAppBusinessConfig.update({
        where: { id },
        data: {
          verificationStatus: 'failed',
        },
      });

      return testResult;
    }
  }

  // ==================== WHATSAPP TRACKING ====================

  async trackWhatsAppActivity(campaignId: string, contactId: string, type: string, metadata?: any) {
    const activity = await this.prisma.whatsAppActivity.create({
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
      await this.prisma.whatsAppActivity.create({
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

  // ==================== WHATSAPP WEBHOOK HANDLING ====================

  async handleWebhookEvent(event: any, organizationId: string) {
    try {
      // Process webhook event using provider service
      await this.whatsappProviderService.processWebhookEvent(event);

      // Update message statuses in database
      if (event.entry) {
        for (const entry of event.entry) {
          if (entry.changes) {
            for (const change of entry.changes) {
              if (change.field === 'messages' && change.value.statuses) {
                for (const status of change.value.statuses) {
                  await this.updateMessageStatus(status.id, status.status, status.timestamp);
                }
              }
            }
          }
        }
      }

      return { success: true };
    } catch (error) {
      throw new BadRequestException('Webhook processing failed');
    }
  }

  private async updateMessageStatus(messageId: string, status: string, timestamp: string) {
    try {
      await this.prisma.whatsAppHistory.updateMany({
        where: { messageId },
        data: {
          status: status.toUpperCase(),
          updatedAt: new Date(timestamp),
        },
      });
    } catch (error) {
      // Log error but don't throw to avoid webhook failures
      console.error('Error updating message status:', error);
    }
  }
}