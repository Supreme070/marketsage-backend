import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AdminAnalyticsData {
  overview: {
    totalUsers: number;
    userGrowthRate: number;
    activeUsers: number;
    totalRevenue: number;
    revenueGrowthRate: number;
    usersThisMonth: number;
  };
  revenueAnalytics: {
    monthlyRevenue: number;
    growthRate: number;
    averageOrderValue: number;
  };
  campaignAnalytics: {
    channelPerformance: Array<{
      channel: string;
      campaigns: number;
      sent: number;
      delivered: number;
      opened?: number;
      clicked?: number;
      read?: number;
    }>;
  };
  leadPulseAnalytics: {
    totalSessions: number;
    totalForms: number;
    totalSubmissions: number;
    conversionRate: number;
  };
  workflowAnalytics: {
    totalExecutions: number;
    activeWorkflows: number;
    successRate: number;
  };
  platformMetrics: {
    apiCalls: number;
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(): Promise<AdminAnalyticsData> {
    try {
      // Get current date ranges
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Get user statistics
      const [totalUsers, usersThisMonth, usersLastMonth] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
        }),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: startOfLastMonth,
              lte: endOfLastMonth,
            },
          },
        }),
      ]);

      // Get active users (users who have logged in within the last 30 days)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const activeUsers = await this.prisma.user.count({
        where: {
          lastLoginAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      // Calculate growth rates
      const userGrowthRate = usersLastMonth > 0 
        ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100 
        : 0;

      // Get email campaign statistics
      const emailStats = await this.prisma.emailCampaign.aggregate({
        _count: { id: true },
      });

      // Get SMS campaign statistics
      const smsStats = await this.prisma.sMSCampaign.aggregate({
        _count: { id: true },
      });

      // Get WhatsApp campaign statistics
      const whatsappStats = await this.prisma.whatsAppCampaign.aggregate({
        _count: { id: true },
      });

      // Get LeadPulse statistics
      const [totalForms, totalSubmissions] = await Promise.all([
        this.prisma.leadPulseForm.count(),
        this.prisma.leadPulseFormSubmission.count(),
      ]);

      // Get workflow statistics
      const [totalWorkflows, workflowExecutions] = await Promise.all([
        this.prisma.workflow.count(),
        this.prisma.workflowExecution.count(),
      ]);

      // Mock revenue data (replace with actual revenue tracking)
      const monthlyRevenue = 45000; // This should come from actual revenue data
      const revenueGrowthRate = 12.5; // This should be calculated from historical data

      // Mock platform metrics (replace with actual monitoring data)
      const platformMetrics = {
        apiCalls: 125000,
        responseTime: 245,
        uptime: 99.8,
        errorRate: 0.2,
      };

      return {
        overview: {
          totalUsers,
          userGrowthRate,
          activeUsers,
          totalRevenue: monthlyRevenue * 12, // Annual revenue
          revenueGrowthRate,
          usersThisMonth,
        },
        revenueAnalytics: {
          monthlyRevenue,
          growthRate: revenueGrowthRate,
          averageOrderValue: monthlyRevenue / Math.max(totalUsers, 1),
        },
        campaignAnalytics: {
          channelPerformance: [
            {
              channel: 'email',
              campaigns: emailStats._count.id || 0,
              sent: Math.floor((emailStats._count.id || 0) * 100), // Mock sent count
              delivered: Math.floor((emailStats._count.id || 0) * 95), // Mock delivered count
              opened: Math.floor((emailStats._count.id || 0) * 67), // Mock opened count
              clicked: Math.floor((emailStats._count.id || 0) * 16), // Mock clicked count
            },
            {
              channel: 'sms',
              campaigns: smsStats._count.id || 0,
              sent: Math.floor((smsStats._count.id || 0) * 80), // Mock sent count
              delivered: Math.floor((smsStats._count.id || 0) * 96), // Mock delivered count
              clicked: Math.floor((smsStats._count.id || 0) * 25), // Mock clicked count
            },
            {
              channel: 'whatsapp',
              campaigns: whatsappStats._count.id || 0,
              sent: Math.floor((whatsappStats._count.id || 0) * 60), // Mock sent count
              delivered: Math.floor((whatsappStats._count.id || 0) * 97), // Mock delivered count
              read: Math.floor((whatsappStats._count.id || 0) * 86), // Mock read count
              clicked: Math.floor((whatsappStats._count.id || 0) * 26), // Mock clicked count
            },
          ],
        },
        leadPulseAnalytics: {
          totalSessions: Math.floor(totalSubmissions * 1.5), // Estimated sessions
          totalForms,
          totalSubmissions,
          conversionRate: totalForms > 0 ? (totalSubmissions / totalForms) * 100 : 0,
        },
        workflowAnalytics: {
          totalExecutions: workflowExecutions,
          activeWorkflows: totalWorkflows,
          successRate: workflowExecutions > 0 ? 84.4 : 0, // This should be calculated from actual data
        },
        platformMetrics,
      };
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      throw new Error('Failed to fetch admin analytics data');
    }
  }

  async getUsersAnalytics() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [totalUsers, newUsersThisMonth, activeUsers] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
        }),
        this.prisma.user.count({
          where: {
            lastLoginAt: {
              gte: thirtyDaysAgo,
            },
          },
        }),
      ]);

      return {
        totalUsers,
        newUsersThisMonth,
        activeUsers,
        retentionRate: 78.5, // This should be calculated from actual data
        churnRate: 21.5, // This should be calculated from actual data
        averageSessionDuration: 18.5, // This should be calculated from actual data
      };
    } catch (error) {
      console.error('Error fetching users analytics:', error);
      throw new Error('Failed to fetch users analytics data');
    }
  }

  async getRevenueAnalytics() {
    try {
      // Mock revenue data - replace with actual revenue tracking
      const monthlyRevenue = 45000;
      const annualRevenue = monthlyRevenue * 12;
      const averageOrderValue = 285;

      return {
        monthlyRevenue,
        annualRevenue,
        averageOrderValue,
        growthRate: 12.5,
        lifetimeValue: averageOrderValue * 10,
        churnRevenue: monthlyRevenue * 0.1,
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw new Error('Failed to fetch revenue analytics data');
    }
  }

  async getPlatformMetrics() {
    try {
      // Mock platform metrics - replace with actual monitoring data
      return {
        apiRequests: 125000,
        responseTime: 245,
        uptime: 99.8,
        errorRate: 0.2,
        memoryUsage: 78,
        cpuUsage: 45,
        diskUsage: 65,
      };
    } catch (error) {
      console.error('Error fetching platform metrics:', error);
      throw new Error('Failed to fetch platform metrics');
    }
  }
}
