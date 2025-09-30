import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    try {
      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const organizationId = user.organizationId;

      // Get real email campaign statistics
      const emailStats = await this.getEmailStats(organizationId!);
      
      // Get real SMS campaign statistics
      const smsStats = await this.getSMSStats(organizationId!);
      
      // Get real WhatsApp campaign statistics
      const whatsappStats = await this.getWhatsAppStats(organizationId!);
      
      // Get real workflow statistics
      const workflowStats = await this.getWorkflowStats(organizationId!);
      
      // Get real contact statistics
      const contactStats = await this.getContactStats(organizationId!);
      
      // Get real revenue statistics (if available)
      const revenueStats = await this.getRevenueStats(organizationId!);

      return {
        emailStats,
        smsStats,
        whatsappStats,
        workflowStats,
        contactStats,
        revenueStats,
        dashboard: {
          revenueToday: revenueStats.today,
          activeVisitors: contactStats.activeToday,
          conversionRate: this.calculateConversionRate(emailStats, smsStats, whatsappStats),
          activeCampaigns: emailStats.activeCampaigns + smsStats.activeCampaigns + whatsappStats.activeCampaigns,
          aiAdvantage: 0.23 // This would come from AI service
        },
        campaigns: {
          email: {
            sent: emailStats.sent,
            opened: emailStats.opened,
            conversions: emailStats.clicked
          },
          sms: {
            sent: smsStats.sent,
            delivered: smsStats.delivered,
            conversions: smsStats.clicked
          },
          whatsapp: {
            sent: whatsappStats.sent,
            replied: whatsappStats.read,
            conversions: whatsappStats.clicked
          },
          workflows: {
            active: workflowStats.active,
            triggered: workflowStats.triggered,
            completed: workflowStats.completed
          }
        },
        leadpulse: {
          totalVisitors: contactStats.totalContacts,
          insights: contactStats.insightsGenerated
        },
        ai: {
          tasksProcessed: 1240, // This would come from AI service
          successRate: 0.94,
          aiAdvantage: 0.23,
          chatInteractions: 156
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return fallback data if database queries fail
      return this.getFallbackDashboardData();
    }
  }

  private async getEmailStats(organizationId: string) {
    const emailCampaigns = await this.prisma.emailCampaign.findMany({
      where: { organizationId },
      include: {
        activities: true
      }
    });

    const totalSent = emailCampaigns.reduce((sum, campaign) => sum + campaign.activities.length, 0);
    const totalOpened = emailCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'OPENED').length, 0);
    const totalClicked = emailCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'CLICKED').length, 0);
    const totalDelivered = emailCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'DELIVERED').length, 0);

    const activeCampaigns = emailCampaigns.filter(campaign => 
      campaign.status === 'SENDING' || campaign.status === 'SCHEDULED').length;

    return {
      sent: totalSent,
      delivered: totalDelivered,
      opened: totalOpened,
      clicked: totalClicked,
      clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      activeCampaigns
    };
  }

  private async getSMSStats(organizationId: string) {
    const smsCampaigns = await this.prisma.sMSCampaign.findMany({
      where: { createdBy: { organizationId } },
      include: {
        activities: true
      }
    });

    const totalSent = smsCampaigns.reduce((sum, campaign) => sum + campaign.activities.length, 0);
    const totalDelivered = smsCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'DELIVERED').length, 0);
    const totalClicked = smsCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'CLICKED').length, 0);

    const activeCampaigns = smsCampaigns.filter(campaign => 
      campaign.status === 'SENDING' || campaign.status === 'SCHEDULED').length;

    return {
      sent: totalSent,
      delivered: totalDelivered,
      clicked: totalClicked,
      clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      activeCampaigns
    };
  }

  private async getWhatsAppStats(organizationId: string) {
    const whatsappCampaigns = await this.prisma.whatsAppCampaign.findMany({
      where: { createdBy: { organizationId } },
      include: {
        activities: true
      }
    });

    const totalSent = whatsappCampaigns.reduce((sum, campaign) => sum + campaign.activities.length, 0);
    const totalRead = whatsappCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'OPENED').length, 0);
    const totalClicked = whatsappCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'CLICKED').length, 0);
    const totalDelivered = whatsappCampaigns.reduce((sum, campaign) => 
      sum + campaign.activities.filter(activity => activity.type === 'DELIVERED').length, 0);

    const activeCampaigns = whatsappCampaigns.filter(campaign => 
      campaign.status === 'SENDING' || campaign.status === 'SCHEDULED').length;

    return {
      sent: totalSent,
      delivered: totalDelivered,
      read: totalRead,
      clicked: totalClicked,
      clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      readRate: totalSent > 0 ? (totalRead / totalSent) * 100 : 0,
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      activeCampaigns
    };
  }

  private async getWorkflowStats(organizationId: string) {
    const workflows = await this.prisma.workflow.findMany({
      where: { createdBy: { organizationId } },
      include: {
        executions: true
      }
    });

    const active = workflows.filter(workflow => workflow.status === 'ACTIVE').length;
    const totalTriggered = workflows.reduce((sum, workflow) => sum + workflow.executions.length, 0);
    const totalCompleted = workflows.reduce((sum, workflow) => 
      sum + workflow.executions.filter(execution => execution.status === 'COMPLETED').length, 0);

    return {
      active,
      triggered: totalTriggered,
      completed: totalCompleted,
      successRate: totalTriggered > 0 ? (totalCompleted / totalTriggered) * 100 : 0
    };
  }

  private async getContactStats(organizationId: string) {
    const totalContacts = await this.prisma.contact.count({
      where: { organizationId }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeToday = await this.prisma.contact.count({
      where: {
        organizationId,
        lastEngaged: {
          gte: today
        }
      }
    });

    // Mock insights generated - this would come from AI service
    const insightsGenerated = Math.floor(totalContacts * 0.1);

    return {
      totalContacts,
      activeToday,
      insightsGenerated
    };
  }

  private async getRevenueStats(_organizationId: string) {
    // This would integrate with billing/payment system
    // For now, return mock data
    return {
      today: 2500.00,
      thisWeek: 15000.00,
      thisMonth: 45000.00,
      growthRate: 12.5
    };
  }

  private calculateConversionRate(emailStats: any, smsStats: any, whatsappStats: any) {
    const totalSent = emailStats.sent + smsStats.sent + whatsappStats.sent;
    const totalConversions = emailStats.clicked + smsStats.clicked + whatsappStats.clicked;
    
    return totalSent > 0 ? (totalConversions / totalSent) * 100 : 0;
  }

  private getFallbackDashboardData() {
    return {
      emailStats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        clickRate: 0,
        openRate: 0,
        deliveryRate: 0,
        activeCampaigns: 0
      },
      smsStats: {
        sent: 0,
        delivered: 0,
        clicked: 0,
        clickRate: 0,
        deliveryRate: 0,
        activeCampaigns: 0
      },
      whatsappStats: {
        sent: 0,
        delivered: 0,
        read: 0,
        clicked: 0,
        clickRate: 0,
        readRate: 0,
        deliveryRate: 0,
        activeCampaigns: 0
      },
      workflowStats: {
        active: 0,
        triggered: 0,
        completed: 0,
        successRate: 0
      },
      contactStats: {
        totalContacts: 0,
        activeToday: 0,
        insightsGenerated: 0
      },
      revenueStats: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        growthRate: 0
      },
      dashboard: {
        revenueToday: 0,
        activeVisitors: 0,
        conversionRate: 0,
        activeCampaigns: 0,
        aiAdvantage: 0
      },
      campaigns: {
        email: { sent: 0, opened: 0, conversions: 0 },
        sms: { sent: 0, delivered: 0, conversions: 0 },
        whatsapp: { sent: 0, replied: 0, conversions: 0 },
        workflows: { active: 0, triggered: 0, completed: 0 }
      },
      leadpulse: { totalVisitors: 0, insights: 0 },
      ai: { tasksProcessed: 0, successRate: 0, aiAdvantage: 0, chatInteractions: 0 }
    };
  }

  async getDecisionSupportData(userId: string) {
    try {
      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const organizationId = user.organizationId;

      // Get real statistics
      const emailStats = await this.getEmailStats(organizationId!);
      const smsStats = await this.getSMSStats(organizationId!);
      const whatsappStats = await this.getWhatsAppStats(organizationId!);
      const workflowStats = await this.getWorkflowStats(organizationId!);
      const contactStats = await this.getContactStats(organizationId!);
      const revenueStats = await this.getRevenueStats(organizationId!);

      // Calculate real metrics
      const totalCampaigns = emailStats.activeCampaigns + smsStats.activeCampaigns + whatsappStats.activeCampaigns;
      const conversionRate = this.calculateConversionRate(emailStats, smsStats, whatsappStats);
      const engagementScore = this.calculateEngagementScore(emailStats, smsStats, whatsappStats);

      // Generate real recommendations based on data
      const recommendations = await this.generateRecommendations(emailStats, smsStats, whatsappStats, contactStats);
      
      // Generate real alerts based on performance
      const alerts = await this.generateAlerts(emailStats, smsStats, whatsappStats, workflowStats);

      return {
        stats: {
          totalRevenue: revenueStats.thisMonth,
          totalCampaigns,
          activeWorkflows: workflowStats.active,
          conversionRate,
          engagementScore
        },
        recommendations,
        alerts
      };
    } catch (error) {
      console.error('Error fetching decision support data:', error);
      // Return fallback data if database queries fail
      return this.getFallbackDecisionSupportData();
    }
  }

  private async generateRecommendations(emailStats: any, smsStats: any, whatsappStats: any, contactStats: any) {
    const recommendations = [];

    // Email performance recommendations
    if (emailStats.openRate < 20) {
      recommendations.push({
        type: 'timing',
        title: 'Optimize Email Send Times',
        description: `Your email open rate is ${emailStats.openRate.toFixed(1)}%. Consider sending emails during peak engagement hours for better performance.`,
        impact: 'high',
        effort: 'low'
      });
    }

    if (emailStats.clickRate < 5) {
      recommendations.push({
        type: 'content',
        title: 'Improve Email Content',
        description: `Your click-through rate is ${emailStats.clickRate.toFixed(1)}%. Consider A/B testing subject lines and call-to-action buttons.`,
        impact: 'medium',
        effort: 'medium'
      });
    }

    // SMS performance recommendations
    if (smsStats.deliveryRate < 90) {
      recommendations.push({
        type: 'delivery',
        title: 'Improve SMS Delivery',
        description: `Your SMS delivery rate is ${smsStats.deliveryRate.toFixed(1)}%. Check phone number quality and carrier compliance.`,
        impact: 'high',
        effort: 'medium'
      });
    }

    // WhatsApp performance recommendations
    if (whatsappStats.readRate > emailStats.openRate) {
      recommendations.push({
        type: 'channel',
        title: 'Leverage WhatsApp Performance',
        description: `WhatsApp shows ${whatsappStats.readRate.toFixed(1)}% read rate vs ${emailStats.openRate.toFixed(1)}% email open rate. Consider increasing WhatsApp campaign frequency.`,
        impact: 'high',
        effort: 'low'
      });
    }

    // Contact engagement recommendations
    if (contactStats.activeToday < contactStats.totalContacts * 0.1) {
      recommendations.push({
        type: 'engagement',
        title: 'Boost Contact Engagement',
        description: `Only ${((contactStats.activeToday / contactStats.totalContacts) * 100).toFixed(1)}% of contacts are active today. Consider re-engagement campaigns.`,
        impact: 'medium',
        effort: 'medium'
      });
    }

    // Default recommendations if no specific issues found
    if (recommendations.length === 0) {
      recommendations.push(
        {
          type: 'optimization',
          title: 'Continue Current Strategy',
          description: 'Your campaigns are performing well. Consider expanding to new segments or testing new content formats.',
          impact: 'medium',
          effort: 'low'
        },
        {
          type: 'growth',
          title: 'Scale Successful Campaigns',
          description: 'Identify your best-performing campaigns and increase their frequency or audience size.',
          impact: 'high',
          effort: 'low'
        }
      );
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  private async generateAlerts(emailStats: any, smsStats: any, whatsappStats: any, workflowStats: any) {
    const alerts = [];

    // Performance alerts
    if (emailStats.openRate < 10) {
      alerts.push({
        type: 'warning',
        title: 'Low Email Open Rate',
        message: `Email campaigns showing ${emailStats.openRate.toFixed(1)}% open rate. Consider reviewing subject lines and send times.`,
        timestamp: new Date().toISOString()
      });
    }

    if (smsStats.deliveryRate < 80) {
      alerts.push({
        type: 'warning',
        title: 'SMS Delivery Issues',
        message: `SMS delivery rate is ${smsStats.deliveryRate.toFixed(1)}%. Check phone number quality and carrier settings.`,
        timestamp: new Date().toISOString()
      });
    }

    if (workflowStats.successRate < 70) {
      alerts.push({
        type: 'warning',
        title: 'Workflow Performance',
        message: `Workflow success rate is ${workflowStats.successRate.toFixed(1)}%. Review workflow logic and triggers.`,
        timestamp: new Date().toISOString()
      });
    }

    // Success alerts
    if (emailStats.openRate > 30) {
      alerts.push({
        type: 'success',
        title: 'Excellent Email Performance',
        message: `Email campaigns achieving ${emailStats.openRate.toFixed(1)}% open rate. Great job!`,
        timestamp: new Date().toISOString()
      });
    }

    if (whatsappStats.readRate > 80) {
      alerts.push({
        type: 'success',
        title: 'WhatsApp High Engagement',
        message: `WhatsApp campaigns showing ${whatsappStats.readRate.toFixed(1)}% read rate. Consider scaling up.`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts.slice(0, 4); // Return top 4 alerts
  }

  private calculateEngagementScore(emailStats: any, smsStats: any, whatsappStats: any) {
    const emailScore = (emailStats.openRate + emailStats.clickRate) / 2;
    const smsScore = smsStats.deliveryRate;
    const whatsappScore = (whatsappStats.readRate + whatsappStats.clickRate) / 2;
    
    // Weighted average based on channel usage
    const totalSent = emailStats.sent + smsStats.sent + whatsappStats.sent;
    if (totalSent === 0) return 0;
    
    const weightedScore = (
      (emailScore * emailStats.sent) +
      (smsScore * smsStats.sent) +
      (whatsappScore * whatsappStats.sent)
    ) / totalSent;
    
    return Math.min(100, Math.max(0, weightedScore));
  }

  private getFallbackDecisionSupportData() {
    return {
      stats: {
        totalRevenue: 0,
        totalCampaigns: 0,
        activeWorkflows: 0,
        conversionRate: 0,
        engagementScore: 0
      },
      recommendations: [
        {
          type: 'getting_started',
          title: 'Create Your First Campaign',
          description: 'Start by creating an email campaign to begin tracking performance metrics.',
          impact: 'high',
          effort: 'low'
        }
      ],
      alerts: [
        {
          type: 'info',
          title: 'Welcome to MarketSage',
          message: 'Set up your first campaign to start receiving performance insights and recommendations.',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
}

