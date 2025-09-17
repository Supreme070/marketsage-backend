import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SMSService } from '../sms/sms.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { 
  CreateUnifiedCampaignDto, 
  UpdateUnifiedCampaignDto,
  CampaignType,
  ChannelType,
  CampaignStatus
} from './dto/campaigns.dto';

@Injectable()
export class UnifiedCampaignService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly smsService: SMSService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  // ==================== UNIFIED CAMPAIGN ORCHESTRATION ====================

  async createUnifiedCampaign(data: CreateUnifiedCampaignDto, userId: string, organizationId: string) {
    const { channels, emailConfig, smsConfig, whatsappConfig, ...campaignData } = data;

    // Validate channels
    if (!channels || channels.length === 0) {
      throw new BadRequestException('At least one channel must be specified');
    }

    // Validate channel configurations
    if (channels.includes(ChannelType.EMAIL) && !emailConfig) {
      throw new BadRequestException('Email configuration is required when email channel is selected');
    }
    if (channels.includes(ChannelType.SMS) && !smsConfig) {
      throw new BadRequestException('SMS configuration is required when SMS channel is selected');
    }
    if (channels.includes(ChannelType.WHATSAPP) && !whatsappConfig) {
      throw new BadRequestException('WhatsApp configuration is required when WhatsApp channel is selected');
    }

    // Create channel-specific campaigns
    const channelCampaigns = [];
    const campaignIds = [];

    if (channels.includes(ChannelType.EMAIL) && emailConfig) {
      const emailCampaign = await this.emailService.createCampaign({
        ...emailConfig,
        name: `${campaignData.name} - Email`,
        subject: emailConfig.subject || 'Default Subject',
        from: emailConfig.from || 'noreply@marketsage.com',
        listIds: campaignData.listIds || [],
        segmentIds: campaignData.segmentIds || [],
      }, userId, organizationId);
      
      channelCampaigns.push({ 
        channel: 'EMAIL', 
        campaignId: emailCampaign.id,
        campaign: emailCampaign 
      });
      campaignIds.push(emailCampaign.id);
    }

    if (channels.includes(ChannelType.SMS) && smsConfig) {
      const smsCampaign = await this.smsService.createCampaign({
        ...smsConfig,
        name: `${campaignData.name} - SMS`,
        content: smsConfig.content || 'Default SMS content',
        from: smsConfig.from || 'MARKETSAGE',
        listIds: campaignData.listIds || [],
        segmentIds: campaignData.segmentIds || [],
      }, userId, organizationId);
      
      channelCampaigns.push({ 
        channel: 'SMS', 
        campaignId: smsCampaign.id,
        campaign: smsCampaign 
      });
      campaignIds.push(smsCampaign.id);
    }

    if (channels.includes(ChannelType.WHATSAPP) && whatsappConfig) {
      const whatsappCampaign = await this.whatsappService.createCampaign({
        ...whatsappConfig,
        name: `${campaignData.name} - WhatsApp`,
        content: whatsappConfig.content || 'Default WhatsApp content',
        from: whatsappConfig.from || 'MARKETSAGE',
        messageType: whatsappConfig.messageType as any || 'text',
        listIds: campaignData.listIds || [],
        segmentIds: campaignData.segmentIds || [],
      }, userId, organizationId);
      
      channelCampaigns.push({ 
        channel: 'WHATSAPP', 
        campaignId: whatsappCampaign.id,
        campaign: whatsappCampaign 
      });
      campaignIds.push(whatsappCampaign.id);
    }

    // Create a unified campaign record in a custom table or use existing models
    // For now, we'll use the existing Workflow model to track unified campaigns
    const unifiedCampaign = await this.prisma.workflow.create({
      data: {
        name: campaignData.name || 'Untitled Campaign',
        description: campaignData.description || `Multi-channel campaign: ${channels.join(', ')}`,
        status: 'ACTIVE',
        definition: JSON.stringify({
          type: 'UNIFIED_CAMPAIGN',
          channels,
          campaignIds,
          priority: campaignData.priority || 1,
          budget: campaignData.budget,
          costPerMessage: campaignData.costPerMessage,
          recurrence: campaignData.recurrence || 'ONE_TIME',
          recurrenceData: campaignData.recurrenceData,
          timezone: campaignData.timezone || 'UTC',
          listIds: campaignData.listIds,
          segmentIds: campaignData.segmentIds,
          scheduledFor: campaignData.scheduledFor,
        }),
        createdById: userId,
      },
    });

    return {
      id: unifiedCampaign.id,
      name: unifiedCampaign.name,
      description: unifiedCampaign.description,
      type: campaignData.type || CampaignType.MULTI_CHANNEL,
      channels,
      status: 'DRAFT',
      createdAt: unifiedCampaign.createdAt,
      channelCampaigns,
      unifiedCampaignId: unifiedCampaign.id,
    };
  }

  async getUnifiedCampaigns(query: any, userId: string, organizationId: string) {
    const { page = 1, limit = 10, status, type, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      createdById: userId,
      definition: {
        path: ['type'],
        equals: 'UNIFIED_CAMPAIGN',
      },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [workflows, total] = await Promise.all([
      this.prisma.workflow.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.workflow.count({ where }),
    ]);

    // Transform workflows to unified campaign format
    const campaigns = workflows.map(workflow => {
      const definition = JSON.parse(workflow.definition);
      return {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        type: definition.type,
        channels: definition.channels,
        status: workflow.status,
        createdAt: workflow.createdAt,
        createdBy: workflow.createdBy || { id: workflow.createdById, name: 'Unknown', email: 'unknown@example.com' },
        campaignIds: definition.campaignIds,
        priority: definition.priority,
        budget: definition.budget,
        costPerMessage: definition.costPerMessage,
        recurrence: definition.recurrence,
        timezone: definition.timezone,
        scheduledFor: definition.scheduledFor,
      };
    });

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

  async getUnifiedCampaignById(id: string, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id,
        createdById: userId,
        definition: {
          contains: '"type":"UNIFIED_CAMPAIGN"',
        },
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Unified campaign not found');
    }

    const definition = JSON.parse(workflow.definition);
    
    // Get channel-specific campaigns
    const channelCampaigns = [];
    
    for (const campaignId of definition.campaignIds) {
      // Try to find the campaign in each channel
      try {
        const emailCampaign = await this.emailService.getCampaignById(campaignId, userId, organizationId);
        if (emailCampaign) {
          channelCampaigns.push({ channel: 'EMAIL', campaign: emailCampaign });
        }
      } catch (e) {
        // Campaign not found in email module
      }

      try {
        const smsCampaign = await this.smsService.getCampaignById(campaignId, userId, organizationId);
        if (smsCampaign) {
          channelCampaigns.push({ channel: 'SMS', campaign: smsCampaign });
        }
      } catch (e) {
        // Campaign not found in SMS module
      }

      try {
        const whatsappCampaign = await this.whatsappService.getCampaignById(campaignId, userId, organizationId);
        if (whatsappCampaign) {
          channelCampaigns.push({ channel: 'WHATSAPP', campaign: whatsappCampaign });
        }
      } catch (e) {
        // Campaign not found in WhatsApp module
      }
    }

    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      type: definition.type,
      channels: definition.channels,
      status: workflow.status,
      createdAt: workflow.createdAt,
      createdBy: workflow.createdBy,
      channelCampaigns,
      priority: definition.priority,
      budget: definition.budget,
      costPerMessage: definition.costPerMessage,
      recurrence: definition.recurrence,
      timezone: definition.timezone,
      scheduledFor: definition.scheduledFor,
    };
  }

  async sendUnifiedCampaign(id: string, data: any, userId: string, organizationId: string) {
    const unifiedCampaign = await this.getUnifiedCampaignById(id, userId, organizationId);
    
    if (unifiedCampaign.status !== 'ACTIVE') {
      throw new BadRequestException('Campaign must be active to send');
    }

    const results = [];
    let totalSent = 0;
    let totalFailed = 0;

    // Send campaigns across all channels
    for (const channelCampaign of unifiedCampaign.channelCampaigns) {
      try {
        let result;
        
        switch (channelCampaign.channel) {
          case 'EMAIL':
            result = await this.emailService.sendCampaign(
              channelCampaign.campaign.id, 
              data, 
              userId, 
              organizationId
            );
            break;
          case 'SMS':
            result = await this.smsService.sendCampaign(
              channelCampaign.campaign.id, 
              data, 
              userId, 
              organizationId
            );
            break;
          case 'WHATSAPP':
            result = await this.whatsappService.sendCampaign(
              channelCampaign.campaign.id, 
              data, 
              userId, 
              organizationId
            );
            break;
        }

        results.push({ 
          channel: channelCampaign.channel, 
          campaignId: channelCampaign.campaign.id, 
          result 
        });
        
        totalSent += (result as any)?.successCount || (result as any)?.recipientsCount || 0;
        totalFailed += (result as any)?.failureCount || 0;
      } catch (error) {
        results.push({ 
          channel: channelCampaign.channel, 
          campaignId: channelCampaign.campaign.id, 
          error: error instanceof Error ? error.message : String(error) 
        });
        totalFailed++;
      }
    }

    // Update workflow status
    await this.prisma.workflow.update({
      where: { id },
      data: {
        status: totalFailed === 0 ? 'ACTIVE' : 'ACTIVE', // Keep active for tracking
        totalExecutions: { increment: 1 },
      },
    });

    return {
      message: `Unified campaign sent successfully. ${totalSent} sent, ${totalFailed} failed.`,
      campaign: {
        id: unifiedCampaign.id,
        status: 'SENT',
      },
      recipientsCount: totalSent + totalFailed,
      successCount: totalSent,
      failureCount: totalFailed,
      results,
    };
  }

  async duplicateUnifiedCampaign(id: string, userId: string, organizationId: string) {
    const originalCampaign = await this.getUnifiedCampaignById(id, userId, organizationId);
    
    const duplicatedCampaign = await this.createUnifiedCampaign({
      name: `${originalCampaign.name} (Copy)`,
      description: originalCampaign.description || undefined,
      type: originalCampaign.type,
      channels: originalCampaign.channels,
      priority: originalCampaign.priority,
      budget: originalCampaign.budget,
      costPerMessage: originalCampaign.costPerMessage,
      recurrence: originalCampaign.recurrence,
      recurrenceData: originalCampaign.recurrence,
      timezone: originalCampaign.timezone,
      listIds: originalCampaign.channelCampaigns[0]?.campaign?.lists?.map(l => l.id) || [],
      segmentIds: originalCampaign.channelCampaigns[0]?.campaign?.segments?.map(s => s.id) || [],
    }, userId, organizationId);

    return {
      message: 'Unified campaign duplicated successfully',
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

  async deleteUnifiedCampaign(id: string, userId: string, organizationId: string) {
    const unifiedCampaign = await this.getUnifiedCampaignById(id, userId, organizationId);
    
    if (unifiedCampaign.status === 'ACTIVE') {
      throw new BadRequestException('Cannot delete active campaigns');
    }

    // Delete channel-specific campaigns
    for (const channelCampaign of unifiedCampaign.channelCampaigns) {
      try {
        switch (channelCampaign.channel) {
          case 'EMAIL':
            await this.emailService.deleteCampaign(channelCampaign.campaign.id, userId, organizationId);
            break;
          case 'SMS':
            await this.smsService.deleteCampaign(channelCampaign.campaign.id, userId, organizationId);
            break;
          case 'WHATSAPP':
            await this.whatsappService.deleteCampaign(channelCampaign.campaign.id, userId, organizationId);
            break;
        }
      } catch (error) {
        // Continue even if individual campaign deletion fails
        console.warn(`Failed to delete ${channelCampaign.channel} campaign:`, error instanceof Error ? error.message : String(error));
      }
    }

    // Delete unified campaign record
    await this.prisma.workflow.delete({
      where: { id },
    });

    return { message: 'Unified campaign deleted successfully' };
  }

  async getUnifiedCampaignAnalytics(id: string, query: any, userId: string, organizationId: string) {
    const unifiedCampaign = await this.getUnifiedCampaignById(id, userId, organizationId);
    
    const analytics = {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalReplied: 0,
      totalFailed: 0,
      totalUnsubscribed: 0,
      totalBounced: 0,
      totalCost: 0,
      totalRevenue: 0,
    };

    const channelAnalytics = [];

    // Aggregate analytics from all channels
    for (const channelCampaign of unifiedCampaign.channelCampaigns) {
      try {
        let channelAnalytic;
        
        switch (channelCampaign.channel) {
          case 'EMAIL':
            channelAnalytic = await this.emailService.getCampaignAnalytics(
              channelCampaign.campaign.id, 
              query, 
              userId, 
              organizationId
            );
            break;
          case 'SMS':
            channelAnalytic = await this.smsService.getCampaignAnalytics(
              channelCampaign.campaign.id, 
              query, 
              userId, 
              organizationId
            );
            break;
          case 'WHATSAPP':
            channelAnalytic = await this.whatsappService.getCampaignAnalytics(
              channelCampaign.campaign.id, 
              query, 
              userId, 
              organizationId
            );
            break;
        }

        if (channelAnalytic) {
          // Aggregate metrics
          analytics.totalSent += (channelAnalytic.analytics as any)?.totalSent || 0;
          analytics.totalDelivered += (channelAnalytic.analytics as any)?.totalDelivered || 0;
          analytics.totalOpened += (channelAnalytic.analytics as any)?.totalOpened || 0;
          analytics.totalClicked += (channelAnalytic.analytics as any)?.totalClicked || 0;
          analytics.totalReplied += (channelAnalytic.analytics as any)?.totalReplied || 0;
          analytics.totalFailed += (channelAnalytic.analytics as any)?.totalFailed || 0;
          analytics.totalUnsubscribed += (channelAnalytic.analytics as any)?.totalUnsubscribed || 0;
          analytics.totalBounced += (channelAnalytic.analytics as any)?.totalBounced || 0;
          analytics.totalCost += (channelAnalytic.analytics as any)?.totalCost || 0;
          analytics.totalRevenue += (channelAnalytic.analytics as any)?.totalRevenue || 0;

          channelAnalytics.push({
            channel: channelCampaign.channel,
            campaignId: channelCampaign.campaign.id,
            analytics: channelAnalytic.analytics,
          });
        }
      } catch (error) {
        console.warn(`Failed to get analytics for ${channelCampaign.channel} campaign:`, error instanceof Error ? error.message : String(error));
      }
    }

    // Calculate rates
    const deliveryRate = analytics.totalSent > 0 ? (analytics.totalDelivered / analytics.totalSent) * 100 : 0;
    const openRate = analytics.totalDelivered > 0 ? (analytics.totalOpened / analytics.totalDelivered) * 100 : 0;
    const clickRate = analytics.totalOpened > 0 ? (analytics.totalClicked / analytics.totalOpened) * 100 : 0;
    const replyRate = analytics.totalDelivered > 0 ? (analytics.totalReplied / analytics.totalDelivered) * 100 : 0;
    const failureRate = analytics.totalSent > 0 ? (analytics.totalFailed / analytics.totalSent) * 100 : 0;

    return {
      campaign: {
        id: unifiedCampaign.id,
        name: unifiedCampaign.name,
        type: unifiedCampaign.type,
        channels: unifiedCampaign.channels,
        status: unifiedCampaign.status,
        createdAt: unifiedCampaign.createdAt,
      },
      analytics: {
        ...analytics,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        replyRate: Math.round(replyRate * 100) / 100,
        failureRate: Math.round(failureRate * 100) / 100,
      },
      channelAnalytics,
    };
  }
}
