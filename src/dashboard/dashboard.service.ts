import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    // Mock dashboard data for now - replace with actual database queries
    return {
      emailStats: {
        sent: 1250,
        delivered: 1200,
        opened: 800,
        clicked: 200,
        clickRate: 16.0,
        openRate: 66.7,
        deliveryRate: 96.0
      },
      smsStats: {
        sent: 500,
        delivered: 480,
        clicked: 120,
        clickRate: 25.0,
        deliveryRate: 96.0
      },
      whatsappStats: {
        sent: 300,
        delivered: 290,
        read: 250,
        clicked: 75,
        clickRate: 25.9,
        readRate: 86.2,
        deliveryRate: 96.7
      },
      workflowStats: {
        active: 12,
        triggered: 45,
        completed: 38,
        successRate: 84.4
      },
      revenueStats: {
        today: 2500.00,
        thisWeek: 15000.00,
        thisMonth: 45000.00,
        growthRate: 12.5
      }
    };
  }

  async getDecisionSupportData(userId: string) {
    // Mock decision support data for now - replace with actual analytics
    return {
      stats: {
        totalRevenue: 45000.00,
        totalCampaigns: 12,
        activeWorkflows: 12,
        conversionRate: 16.0,
        engagementScore: 85.2
      },
      recommendations: [
        {
          type: 'timing',
          title: 'Optimize Email Send Times',
          description: 'Send emails between 2-4 PM for 23% higher open rates',
          impact: 'high',
          effort: 'low'
        },
        {
          type: 'segmentation',
          title: 'Create VIP Customer Segment',
          description: 'High-value customers show 40% higher engagement',
          impact: 'high',
          effort: 'medium'
        },
        {
          type: 'content',
          title: 'Personalize Subject Lines',
          description: 'Personalized subjects increase open rates by 15%',
          impact: 'medium',
          effort: 'low'
        }
      ],
      alerts: [
        {
          type: 'warning',
          title: 'Low Engagement Campaign',
          message: 'Birthday Campaign has 5% open rate - consider optimization',
          timestamp: new Date().toISOString()
        },
        {
          type: 'success',
          title: 'High Performance Campaign',
          message: 'Welcome Series achieving 35% conversion rate',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
}

