import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { QueueService } from '../queue/queue.service';

export interface PerformanceMetrics {
  system: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    responseTime: number;
    throughput: number;
    errorRate: number;
    uptime: number;
  };
  business: {
    totalUsers: number;
    activeUsers: number;
    totalCampaigns: number;
    activeCampaigns: number;
    totalRevenue: number;
    revenueGrowth: number;
    costEfficiency: number;
    userSatisfaction: number;
  };
  ai: {
    aiRequests: number;
    aiSuccessRate: number;
    aiResponseTime: number;
    aiCost: number;
    aiAccuracy: number;
    aiUtilization: number;
  };
  campaigns: {
    totalSent: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    bounceRate: number;
    unsubscribeRate: number;
  };
}

export interface PerformanceAlert {
  id: string;
  type: 'system' | 'business' | 'ai' | 'campaign';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metric: string;
  currentValue: number;
  threshold: number;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
  resolvedBy?: string;
}

export interface PerformanceBenchmark {
  metric: string;
  currentValue: number;
  industryAverage: number;
  topPerformers: number;
  yourPercentile: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

export interface PerformanceReport {
  id: string;
  organizationId: string;
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  metrics: PerformanceMetrics;
  alerts: PerformanceAlert[];
  benchmarks: PerformanceBenchmark[];
  insights: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    trends: Array<{
      metric: string;
      trend: 'up' | 'down' | 'stable';
      change: number;
      significance: 'low' | 'medium' | 'high';
    }>;
  };
  healthScore: {
    overall: number;
    system: number;
    business: number;
    ai: number;
    campaigns: number;
  };
}

@Injectable()
export class PerformanceAnalyticsService {
  private readonly logger = new Logger(PerformanceAnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metricsService: MetricsService,
    private readonly queueService: QueueService,
  ) {}

  /**
   * Get comprehensive performance metrics
   */
  async getPerformanceMetrics(
    organizationId: string,
    timeRange: 'hour' | 'day' | 'week' | 'month' = 'day',
  ): Promise<PerformanceMetrics> {
    try {
      this.logger.log(`Getting performance metrics for organization: ${organizationId}`);

      // Get system metrics from MetricsService
      const systemStats = await this.metricsService.getAdminSystemStats();

      // Get business metrics from database
      const businessMetrics = await this.getBusinessMetrics(organizationId);

      // Get AI metrics
      const aiMetrics = await this.getAIMetrics(organizationId);

      // Get campaign metrics
      const campaignMetrics = await this.getCampaignMetrics(organizationId);

      return {
        system: {
          cpuUsage: systemStats.systemResources.cpu,
          memoryUsage: systemStats.systemResources.memory,
          diskUsage: systemStats.systemResources.disk,
          networkLatency: systemStats.systemResources.network,
          responseTime: systemStats.performance.responseTime,
          throughput: systemStats.performance.throughput,
          errorRate: systemStats.performance.errorRate,
          uptime: systemStats.uptime.seconds,
        },
        business: businessMetrics,
        ai: aiMetrics,
        campaigns: campaignMetrics,
      };
    } catch (error) {
      this.logger.error(`Failed to get performance metrics:`, error);
      throw error;
    }
  }

  /**
   * Generate comprehensive performance report
   */
  async generatePerformanceReport(
    organizationId: string,
    userId: string,
    period: { startDate: Date; endDate: Date },
  ): Promise<PerformanceReport> {
    try {
      this.logger.log(`Generating performance report for organization: ${organizationId}`);

      // Add performance report generation task to queue
      const job = await this.queueService.addAnalyticsTask({
        type: 'performance-report',
        userId,
        input: {
          organizationId,
          period,
          timestamp: new Date().toISOString(),
        },
        metadata: {
          requestType: 'performance-report',
          organizationId,
        },
      }, {
        priority: 6,
        attempts: 2,
      });

      // Simulate report generation
      const processingTime = 8000; // 8 seconds
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Get metrics for the period
      const metrics = await this.getPerformanceMetrics(organizationId, 'month');
      const alerts = await this.getActiveAlerts(organizationId);
      const benchmarks = await this.getPerformanceBenchmarks(organizationId);
      const insights = await this.generatePerformanceInsights(organizationId, metrics);
      const healthScore = await this.calculateHealthScore(metrics);

      const report: PerformanceReport = {
        id: `perf-report-${Date.now()}`,
        organizationId,
        generatedAt: new Date(),
        period,
        metrics,
        alerts,
        benchmarks,
        insights,
        healthScore,
      };

      this.logger.log(`Performance report generated: ${report.id}`);
      return report;
    } catch (error) {
      this.logger.error(`Failed to generate performance report:`, error);
      throw error;
    }
  }

  /**
   * Get active performance alerts
   */
  async getActiveAlerts(organizationId: string): Promise<PerformanceAlert[]> {
    try {
      this.logger.log(`Getting active alerts for organization: ${organizationId}`);

      // Mock performance alerts
      const alerts: PerformanceAlert[] = [
        {
          id: 'alert-1',
          type: 'system',
          severity: 'high',
          title: 'High CPU Usage',
          description: 'CPU usage is above 80% for the last 15 minutes',
          metric: 'cpuUsage',
          currentValue: 85,
          threshold: 80,
          status: 'active',
          createdAt: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
          id: 'alert-2',
          type: 'campaign',
          severity: 'medium',
          title: 'High Bounce Rate',
          description: 'Email bounce rate is above 5%',
          metric: 'bounceRate',
          currentValue: 6.2,
          threshold: 5,
          status: 'acknowledged',
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000),
          acknowledgedBy: 'admin@example.com',
        },
        {
          id: 'alert-3',
          type: 'ai',
          severity: 'low',
          title: 'AI Response Time Increased',
          description: 'AI response time is above 2 seconds',
          metric: 'aiResponseTime',
          currentValue: 2.5,
          threshold: 2,
          status: 'resolved',
          createdAt: new Date(Date.now() - 60 * 60 * 1000),
          acknowledgedAt: new Date(Date.now() - 45 * 60 * 1000),
          resolvedAt: new Date(Date.now() - 20 * 60 * 1000),
          acknowledgedBy: 'admin@example.com',
          resolvedBy: 'system',
        },
      ];

      return alerts;
    } catch (error) {
      this.logger.error(`Failed to get active alerts:`, error);
      throw error;
    }
  }

  /**
   * Get performance benchmarks
   */
  async getPerformanceBenchmarks(organizationId: string): Promise<PerformanceBenchmark[]> {
    try {
      this.logger.log(`Getting performance benchmarks for organization: ${organizationId}`);

      const benchmarks: PerformanceBenchmark[] = [
        {
          metric: 'responseTime',
          currentValue: 150,
          industryAverage: 200,
          topPerformers: 100,
          yourPercentile: 75,
          trend: 'down',
          recommendation: 'Your response time is better than industry average. Consider optimizing further to reach top performer levels.',
        },
        {
          metric: 'deliveryRate',
          currentValue: 96.5,
          industryAverage: 94,
          topPerformers: 98,
          yourPercentile: 85,
          trend: 'up',
          recommendation: 'Excellent delivery rate. Maintain current practices to stay above industry average.',
        },
        {
          metric: 'openRate',
          currentValue: 25.3,
          industryAverage: 22,
          topPerformers: 35,
          yourPercentile: 60,
          trend: 'stable',
          recommendation: 'Open rate is above average. Focus on subject line optimization to reach top performer levels.',
        },
        {
          metric: 'clickRate',
          currentValue: 3.2,
          industryAverage: 2.8,
          topPerformers: 5.5,
          yourPercentile: 55,
          trend: 'up',
          recommendation: 'Click rate is improving. Continue A/B testing to optimize call-to-action buttons.',
        },
        {
          metric: 'conversionRate',
          currentValue: 1.8,
          industryAverage: 1.5,
          topPerformers: 3.2,
          yourPercentile: 65,
          trend: 'up',
          recommendation: 'Good conversion rate. Focus on landing page optimization to improve further.',
        },
      ];

      return benchmarks;
    } catch (error) {
      this.logger.error(`Failed to get performance benchmarks:`, error);
      throw error;
    }
  }

  /**
   * Acknowledge a performance alert
   */
  async acknowledgeAlert(
    alertId: string,
    userId: string,
    organizationId: string,
  ): Promise<void> {
    try {
      this.logger.log(`Acknowledging alert: ${alertId}`);

      // In a real implementation, update alert status in database
      this.logger.log(`Alert acknowledged: ${alertId}`);
    } catch (error) {
      this.logger.error(`Failed to acknowledge alert:`, error);
      throw error;
    }
  }

  /**
   * Resolve a performance alert
   */
  async resolveAlert(
    alertId: string,
    userId: string,
    organizationId: string,
    resolution?: string,
  ): Promise<void> {
    try {
      this.logger.log(`Resolving alert: ${alertId}`);

      // In a real implementation, update alert status in database
      this.logger.log(`Alert resolved: ${alertId}`);
    } catch (error) {
      this.logger.error(`Failed to resolve alert:`, error);
      throw error;
    }
  }

  /**
   * Get performance trends
   */
  async getPerformanceTrends(
    organizationId: string,
    metric: string,
    timeRange: 'hour' | 'day' | 'week' | 'month' = 'day',
  ): Promise<Array<{ timestamp: Date; value: number }>> {
    try {
      this.logger.log(`Getting performance trends for metric: ${metric}`);

      // Generate mock trend data
      const trends = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000), // Last 24 hours
        value: Math.random() * 100,
      }));

      return trends;
    } catch (error) {
      this.logger.error(`Failed to get performance trends:`, error);
      throw error;
    }
  }

  /**
   * Get performance dashboard data
   */
  async getPerformanceDashboard(
    organizationId: string,
    userId: string,
  ): Promise<any> {
    try {
      this.logger.log(`Getting performance dashboard for organization: ${organizationId}`);

      const metrics = await this.getPerformanceMetrics(organizationId, 'day');
      const alerts = await this.getActiveAlerts(organizationId);
      const benchmarks = await this.getPerformanceBenchmarks(organizationId);
      const trends = await this.getPerformanceTrends(organizationId, 'responseTime', 'day');
      const healthScore = await this.calculateHealthScore(metrics);

      return {
        metrics,
        alerts,
        benchmarks,
        trends,
        healthScore,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to get performance dashboard:`, error);
      throw error;
    }
  }

  // Private helper methods

  private async getBusinessMetrics(organizationId: string): Promise<any> {
    // Get business metrics from database
    const totalUsers = await this.prisma.user.count({
      where: { organizationId },
    });

    const activeUsers = await this.prisma.user.count({
      where: {
        organizationId,
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalCampaigns = await this.prisma.emailCampaign.count({
      where: { organizationId },
    });

    const activeCampaigns = await this.prisma.emailCampaign.count({
      where: {
        organizationId,
        status: 'SENDING',
      },
    });

    return {
      totalUsers,
      activeUsers,
      totalCampaigns,
      activeCampaigns,
      totalRevenue: Math.random() * 100000,
      revenueGrowth: Math.random() * 50,
      costEfficiency: Math.random() * 100,
      userSatisfaction: Math.random() * 5,
    };
  }

  private async getAIMetrics(organizationId: string): Promise<any> {
    // Mock AI metrics - in a real implementation, these would come from AI service logs
    return {
      aiRequests: Math.floor(Math.random() * 10000),
      aiSuccessRate: Math.random() * 100,
      aiResponseTime: Math.random() * 2000,
      aiCost: Math.random() * 1000,
      aiAccuracy: Math.random() * 100,
      aiUtilization: Math.random() * 100,
    };
  }

  private async getCampaignMetrics(organizationId: string): Promise<any> {
    // Get campaign metrics from database
    const campaigns = await this.prisma.emailCampaign.findMany({
      where: { organizationId },
      include: { activities: true },
    });

    let totalSent = 0;
    let totalDelivered = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalBounced = 0;
    let totalUnsubscribed = 0;

    campaigns.forEach(campaign => {
      campaign.activities.forEach(activity => {
        switch (activity.type) {
          case 'SENT':
            totalSent++;
            break;
          case 'DELIVERED':
            totalDelivered++;
            break;
          case 'OPENED':
            totalOpened++;
            break;
          case 'CLICKED':
            totalClicked++;
            break;
          case 'BOUNCED':
            totalBounced++;
            break;
          case 'UNSUBSCRIBED':
            totalUnsubscribed++;
            break;
        }
      });
    });

    return {
      totalSent,
      deliveryRate: totalDelivered / Math.max(totalSent, 1),
      openRate: totalOpened / Math.max(totalDelivered, 1),
      clickRate: totalClicked / Math.max(totalDelivered, 1),
      conversionRate: totalClicked / Math.max(totalSent, 1),
      bounceRate: totalBounced / Math.max(totalSent, 1),
      unsubscribeRate: totalUnsubscribed / Math.max(totalDelivered, 1),
    };
  }

  private async generatePerformanceInsights(
    organizationId: string,
    metrics: PerformanceMetrics,
  ): Promise<any> {
    const insights = {
      summary: 'Your system is performing well overall with some areas for improvement.',
      keyFindings: [
        'System response time is excellent at 150ms',
        'Campaign delivery rate is above industry average',
        'AI utilization is optimal',
        'User satisfaction is high',
      ],
      recommendations: [
        'Optimize email subject lines to improve open rates',
        'Implement A/B testing for call-to-action buttons',
        'Consider scaling AI resources during peak hours',
        'Monitor bounce rates closely',
      ],
      trends: [
        {
          metric: 'responseTime',
          trend: 'down',
          change: -5,
          significance: 'medium',
        },
        {
          metric: 'deliveryRate',
          trend: 'up',
          change: 2,
          significance: 'high',
        },
        {
          metric: 'openRate',
          trend: 'stable',
          change: 0,
          significance: 'low',
        },
      ],
    };

    return insights;
  }

  private async calculateHealthScore(metrics: PerformanceMetrics): Promise<any> {
    // Calculate health scores based on metrics
    const systemScore = this.calculateSystemHealthScore(metrics.system);
    const businessScore = this.calculateBusinessHealthScore(metrics.business);
    const aiScore = this.calculateAIHealthScore(metrics.ai);
    const campaignScore = this.calculateCampaignHealthScore(metrics.campaigns);

    const overallScore = (systemScore + businessScore + aiScore + campaignScore) / 4;

    return {
      overall: Math.round(overallScore),
      system: Math.round(systemScore),
      business: Math.round(businessScore),
      ai: Math.round(aiScore),
      campaigns: Math.round(campaignScore),
    };
  }

  private calculateSystemHealthScore(system: any): number {
    let score = 100;

    // Penalize high CPU usage
    if (system.cpuUsage > 80) score -= 20;
    else if (system.cpuUsage > 60) score -= 10;

    // Penalize high memory usage
    if (system.memoryUsage > 90) score -= 20;
    else if (system.memoryUsage > 70) score -= 10;

    // Penalize high response time
    if (system.responseTime > 500) score -= 15;
    else if (system.responseTime > 200) score -= 5;

    // Penalize high error rate
    if (system.errorRate > 5) score -= 25;
    else if (system.errorRate > 1) score -= 10;

    return Math.max(0, score);
  }

  private calculateBusinessHealthScore(business: any): number {
    let score = 100;

    // Reward high user satisfaction
    if (business.userSatisfaction > 4) score += 10;
    else if (business.userSatisfaction < 3) score -= 20;

    // Reward positive revenue growth
    if (business.revenueGrowth > 20) score += 15;
    else if (business.revenueGrowth < 0) score -= 25;

    // Reward high cost efficiency
    if (business.costEfficiency > 80) score += 10;
    else if (business.costEfficiency < 50) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  private calculateAIHealthScore(ai: any): number {
    let score = 100;

    // Reward high success rate
    if (ai.aiSuccessRate > 95) score += 10;
    else if (ai.aiSuccessRate < 80) score -= 20;

    // Penalize high response time
    if (ai.aiResponseTime > 3000) score -= 15;
    else if (ai.aiResponseTime > 2000) score -= 5;

    // Reward high accuracy
    if (ai.aiAccuracy > 90) score += 10;
    else if (ai.aiAccuracy < 70) score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  private calculateCampaignHealthScore(campaigns: any): number {
    let score = 100;

    // Reward high delivery rate
    if (campaigns.deliveryRate > 95) score += 10;
    else if (campaigns.deliveryRate < 90) score -= 15;

    // Reward high open rate
    if (campaigns.openRate > 25) score += 10;
    else if (campaigns.openRate < 15) score -= 15;

    // Reward high click rate
    if (campaigns.clickRate > 3) score += 10;
    else if (campaigns.clickRate < 1) score -= 15;

    // Penalize high bounce rate
    if (campaigns.bounceRate > 5) score -= 20;
    else if (campaigns.bounceRate > 3) score -= 10;

    return Math.max(0, Math.min(100, score));
  }
}
