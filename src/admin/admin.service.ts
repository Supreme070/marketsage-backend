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

  async getDashboard() {
    return {
      overview: {
        totalUsers: 7,
        activeUsers: 5,
        totalRevenue: 540000,
        totalCampaigns: 15,
        systemUptime: 99.8,
      },
      recentActivity: [
        {
          type: 'user_registration',
          message: 'New user registered',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'campaign_sent',
          message: 'Campaign sent successfully',
          timestamp: new Date().toISOString(),
        },
      ],
      alerts: [
        {
          type: 'warning',
          message: 'High memory usage detected',
          severity: 'medium',
        },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }

  async getUsers() {
    return {
      users: [
        {
          id: '1',
          name: 'Test Admin',
          email: 'admin@marketsage.com',
          role: 'IT_ADMIN',
          status: 'active',
          lastLogin: new Date().toISOString(),
        },
      ],
      total: 7,
      active: 5,
      inactive: 2,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getOrganizations() {
    return {
      organizations: [
        {
          id: '1',
          name: 'Default Organization',
          users: 7,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
      active: 1,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getSystemInfo() {
    return {
      system: {
        version: '1.0.0',
        uptime: '7 days, 12 hours',
        memory: {
          used: '2.1 GB',
          total: '4.0 GB',
          percentage: 52.5,
        },
        cpu: {
          usage: 15.2,
          cores: 4,
        },
        disk: {
          used: '45.2 GB',
          total: '100.0 GB',
          percentage: 45.2,
        },
      },
      database: {
        status: 'connected',
        connections: 5,
        maxConnections: 100,
      },
      redis: {
        status: 'connected',
        memory: '128 MB',
        keys: 1250,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  async getLogs() {
    return {
      logs: [
        {
          level: 'info',
          message: 'User login successful',
          timestamp: new Date().toISOString(),
          userId: 'cmfwux6jm0000r2lua1jmj47n',
        },
        {
          level: 'warning',
          message: 'High memory usage detected',
          timestamp: new Date().toISOString(),
        },
      ],
      total: 1250,
      levels: {
        error: 5,
        warning: 12,
        info: 1200,
        debug: 33,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  async getMaintenanceInfo() {
    return {
      status: 'operational',
      scheduledMaintenance: [
        {
          date: '2025-10-01T02:00:00Z',
          duration: '2 hours',
          description: 'Database optimization',
          type: 'scheduled',
        },
      ],
      lastMaintenance: {
        date: '2025-09-15T02:00:00Z',
        duration: '1.5 hours',
        description: 'System update',
        status: 'completed',
      },
      nextMaintenance: '2025-10-01T02:00:00Z',
      lastUpdated: new Date().toISOString(),
    };
  }

  async getBackups() {
    return {
      backups: [
        {
          id: 'backup_1',
          type: 'full',
          size: '2.5 GB',
          createdAt: new Date().toISOString(),
          status: 'completed',
        },
        {
          id: 'backup_2',
          type: 'incremental',
          size: '500 MB',
          createdAt: new Date().toISOString(),
          status: 'completed',
        },
      ],
      schedule: {
        full: 'weekly',
        incremental: 'daily',
        retention: '30 days',
      },
      lastBackup: new Date().toISOString(),
      nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
    };
  }

  async getSecurityInfo() {
    return {
      security: {
        status: 'secure',
        lastScan: new Date().toISOString(),
        vulnerabilities: 0,
        threats: 0,
      },
      authentication: {
        failedAttempts: 2,
        lockedAccounts: 0,
        lastSecurityEvent: new Date().toISOString(),
      },
      ssl: {
        status: 'valid',
        expires: '2025-12-31T23:59:59Z',
        issuer: 'Let\'s Encrypt',
      },
      firewall: {
        status: 'active',
        blockedRequests: 45,
        lastBlock: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    };
  }
}
