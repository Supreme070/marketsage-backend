import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getBillingStats() {
    try {
      // Get organization counts by plan
      const organizationCounts = await this.prisma.organization.groupBy({
        by: ['plan'],
        _count: {
          plan: true,
        },
      });

      // Calculate total organizations
      const totalOrganizations = organizationCounts.reduce((sum, org) => sum + org._count.plan, 0);

      // Mock billing stats - in a real implementation, these would come from billing/payment tables
      const monthlyRevenue = 2400000; // ₦2.4M
      const activeSubscriptions = totalOrganizations;
      const paymentSuccessRate = 98.7;
      const churnRate = 2.1;

      return {
        monthlyRevenue,
        activeSubscriptions,
        paymentSuccessRate,
        churnRate,
        revenueGrowth: 12.3,
        subscriptionGrowth: 89,
        paymentFailureRate: -0.3,
        churnImprovement: -0.5,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get billing stats: ${err.message}`);
      throw error;
    }
  }

  async getSubscriptionAudits() {
    try {
      // Get organizations with their users and usage data
      const organizations = await this.prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          plan: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              users: true,
              emailCampaigns: true,
              contacts: true,
            },
          },
          users: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
            take: 1, // Get primary user
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform to subscription audit format
      return organizations.map((org) => {
        const primaryUser = org.users[0];
        const monthlyRevenue = this.getMonthlyRevenueByPlan(org.plan);
        const totalRevenue = monthlyRevenue * this.getMonthsSinceCreation(org.createdAt);
        
        return {
          id: org.id,
          organizationName: org.name,
          userEmail: primaryUser?.email || 'No primary user',
          tier: org.plan,
          status: this.getSubscriptionStatus(org.plan),
          startDate: org.createdAt.toISOString(),
          expiresAt: this.getExpirationDate(org.plan, org.createdAt),
          monthlyRevenue,
          totalRevenue,
          lastPayment: this.getLastPaymentDate(org.updatedAt),
          usageStats: {
            emails: org._count.emailCampaigns,
            sms: Math.floor(org._count.emailCampaigns * 0.3), // Mock SMS usage
            whatsapp: Math.floor(org._count.emailCampaigns * 0.1), // Mock WhatsApp usage
            leadPulseVisits: org._count.contacts * 2, // Mock LeadPulse visits
          },
          riskLevel: this.calculateRiskLevel(org.plan, org._count.users, org.updatedAt),
          flags: this.getRiskFlags(org.plan, org._count.users, org.updatedAt),
        };
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get subscription audits: ${err.message}`);
      throw error;
    }
  }

  async getRevenueAnalytics() {
    try {
      // Get organization counts by plan
      const organizationCounts = await this.prisma.organization.groupBy({
        by: ['plan'],
        _count: {
          plan: true,
        },
      });

      // Calculate metrics
      const totalActiveSubscriptions = organizationCounts.reduce((sum, org) => sum + org._count.plan, 0);
      
      // Mock revenue analytics - in a real implementation, these would come from billing/payment tables
      const mrr = 2400000; // Monthly Recurring Revenue
      const arr = mrr * 12; // Annual Recurring Revenue
      const churnRate = 2.1;
      const newSubscriptions = 89;
      const canceledSubscriptions = Math.floor(totalActiveSubscriptions * churnRate / 100);
      const averageRevenuePerUser = mrr / totalActiveSubscriptions;
      
      // Tier distribution
      const tierDistribution = organizationCounts.reduce((acc, org) => {
        acc[org.plan] = org._count.plan;
        return acc;
      }, {} as Record<string, number>);

      return {
        mrr,
        arr,
        churnRate,
        newSubscriptions,
        canceledSubscriptions,
        totalActiveSubscriptions,
        averageRevenuePerUser,
        tierDistribution,
        paymentFailures: Math.floor(totalActiveSubscriptions * 0.013), // 1.3% failure rate
        upcomingRenewals: Math.floor(totalActiveSubscriptions * 0.15), // 15% renewing this month
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get revenue analytics: ${err.message}`);
      throw error;
    }
  }

  async getSubscriptionIssues() {
    try {
      // Mock subscription issues - in a real implementation, these would come from monitoring systems
      return [
        {
          type: 'Payment Failure',
          description: 'Credit card expired for Enterprise customer',
          severity: 'HIGH',
          organizationId: 'org-1',
          organizationName: 'TechCorp Ltd',
        },
        {
          type: 'Usage Limit Exceeded',
          description: 'Monthly email limit exceeded by 15%',
          severity: 'MEDIUM',
          organizationId: 'org-2',
          organizationName: 'Marketing Pro',
        },
        {
          type: 'Suspicious Activity',
          description: 'Unusual login patterns detected',
          severity: 'HIGH',
          organizationId: 'org-3',
          organizationName: 'StartupXYZ',
        },
        {
          type: 'Renewal Reminder',
          description: 'Subscription expires in 7 days',
          severity: 'LOW',
          organizationId: 'org-4',
          organizationName: 'Small Business Co',
        },
        {
          type: 'Downgrade Request',
          description: 'Customer requested plan downgrade',
          severity: 'MEDIUM',
          organizationId: 'org-5',
          organizationName: 'Local Agency',
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get subscription issues: ${err.message}`);
      throw error;
    }
  }

  async verifySubscription(subscriptionId: string, action: string, reason: string) {
    try {
      // Mock subscription verification - in a real implementation, this would update the subscription
      this.logger.log(`Subscription ${subscriptionId} verification: ${action} - ${reason}`);
      
      // In a real implementation, this would:
      // 1. Update the organization's plan/status
      // 2. Log the admin action
      // 3. Send notifications
      // 4. Update billing records
      
      return {
        success: true,
        message: `Subscription ${action.toLowerCase()}d successfully`,
        subscriptionId,
        action,
        reason,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to verify subscription: ${err.message}`);
      throw error;
    }
  }

  async getInvoices(filters: any = {}) {
    try {
      // Mock invoice data - in a real implementation, these would come from an invoice table
      return [
        {
          id: 'inv-001',
          organizationId: 'org-1',
          organizationName: 'TechCorp Ltd',
          amount: 50000,
          currency: 'NGN',
          status: 'PAID',
          dueDate: new Date().toISOString(),
          paidDate: new Date(Date.now() - 86400000).toISOString(),
          invoiceNumber: 'INV-2024-001',
        },
        {
          id: 'inv-002',
          organizationId: 'org-2',
          organizationName: 'Marketing Pro',
          amount: 25000,
          currency: 'NGN',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          paidDate: null,
          invoiceNumber: 'INV-2024-002',
        },
        {
          id: 'inv-003',
          organizationId: 'org-3',
          organizationName: 'StartupXYZ',
          amount: 100000,
          currency: 'NGN',
          status: 'OVERDUE',
          dueDate: new Date(Date.now() - 172800000).toISOString(),
          paidDate: null,
          invoiceNumber: 'INV-2024-003',
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get invoices: ${err.message}`);
      throw error;
    }
  }

  async getPayments(filters: any = {}) {
    try {
      // Mock payment data - in a real implementation, these would come from a payment table
      return [
        {
          id: 'pay-001',
          organizationId: 'org-1',
          organizationName: 'TechCorp Ltd',
          amount: 50000,
          currency: 'NGN',
          status: 'SUCCESS',
          method: 'CARD',
          transactionId: 'txn_abc123',
          processedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'pay-002',
          organizationId: 'org-2',
          organizationName: 'Marketing Pro',
          amount: 25000,
          currency: 'NGN',
          status: 'FAILED',
          method: 'CARD',
          transactionId: 'txn_def456',
          processedAt: new Date(Date.now() - 172800000).toISOString(),
          failureReason: 'Insufficient funds',
        },
        {
          id: 'pay-003',
          organizationId: 'org-3',
          organizationName: 'StartupXYZ',
          amount: 100000,
          currency: 'NGN',
          status: 'PENDING',
          method: 'BANK_TRANSFER',
          transactionId: 'txn_ghi789',
          processedAt: null,
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get payments: ${err.message}`);
      throw error;
    }
  }

  // Helper methods
  private getMonthlyRevenueByPlan(plan: string): number {
    switch (plan) {
      case 'ENTERPRISE': return 100000;
      case 'PROFESSIONAL': return 50000;
      case 'STARTER': return 25000;
      case 'FREE': return 0;
      default: return 0;
    }
  }

  private getMonthsSinceCreation(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  }

  private getSubscriptionStatus(plan: string): string {
    return plan === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE';
  }

  private getExpirationDate(plan: string, createdAt: Date): string | null {
    if (plan === 'FREE') return null;
    
    const expirationDate = new Date(createdAt);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year subscription
    return expirationDate.toISOString();
  }

  private getLastPaymentDate(updatedAt: Date): string {
    return updatedAt.toISOString();
  }

  private calculateRiskLevel(plan: string, userCount: number, lastUpdated: Date): 'LOW' | 'MEDIUM' | 'HIGH' {
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (plan === 'SUSPENDED' || daysSinceUpdate > 30) return 'HIGH';
    if (plan === 'FREE' && userCount > 10) return 'MEDIUM';
    if (daysSinceUpdate > 7) return 'MEDIUM';
    return 'LOW';
  }

  private getRiskFlags(plan: string, userCount: number, lastUpdated: Date): string[] {
    const flags: string[] = [];
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (plan === 'SUSPENDED') flags.push('SUSPENDED');
    if (daysSinceUpdate > 30) flags.push('INACTIVE');
    if (plan === 'FREE' && userCount > 10) flags.push('HIGH_USAGE_FREE');
    if (daysSinceUpdate > 7) flags.push('STALE');
    
    return flags;
  }
}
