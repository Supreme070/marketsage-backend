import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSupportMetrics() {
    try {
      // Get user counts for support metrics
      const totalUsers = await this.prisma.user.count();
      const activeUsers = await this.prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      });

      // Mock support metrics - in a real implementation, these would come from support/ticket tables
      return {
        activeTickets: 23,
        averageResponseTime: 2.4, // hours
        customerSatisfactionScore: 4.7,
        onlineStaff: 5,
        todayTicketsResolved: 12,
        ticketsOpenedToday: 8,
        averageResolutionTime: 18.5, // hours
        firstResponseRate: 95.2, // percentage within SLA
        resolutionRate: 88.7,
        escalationRate: 12.3,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get support metrics: ${err.message}`);
      throw error;
    }
  }

  async getSupportTickets() {
    try {
      // Mock support tickets - in a real implementation, these would come from a support ticket table
      return [
        {
          id: 'TICKET-001',
          subject: 'Email delivery issues with campaign',
          description: 'Our email campaign is not being delivered to recipients. Need urgent assistance.',
          status: 'open',
          priority: 'urgent',
          category: 'technical',
          customer: {
            name: 'John Smith',
            email: 'john@techcorp.com',
            organization: 'TechCorp Ltd',
            tier: 'enterprise',
            avatar: null,
          },
          assignedTo: {
            name: 'Sarah Johnson',
            email: 'sarah@marketsage.com',
            avatar: null,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          responseTime: 15, // minutes
          resolutionTime: null,
          satisfaction: null,
          tags: ['email', 'delivery', 'campaign'],
          messages: 3,
          lastMessage: 'Still investigating the issue...',
        },
        {
          id: 'TICKET-002',
          subject: 'Billing inquiry for monthly charges',
          description: 'I need clarification on the charges for this month. The amount seems higher than expected.',
          status: 'in_progress',
          priority: 'medium',
          category: 'billing',
          customer: {
            name: 'Maria Garcia',
            email: 'maria@startup.com',
            organization: 'StartupXYZ',
            tier: 'pro',
            avatar: null,
          },
          assignedTo: {
            name: 'Mike Chen',
            email: 'mike@marketsage.com',
            avatar: null,
          },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 1800000).toISOString(),
          responseTime: 8, // minutes
          resolutionTime: null,
          satisfaction: null,
          tags: ['billing', 'charges', 'clarification'],
          messages: 5,
          lastMessage: 'Please check your usage details...',
        },
        {
          id: 'TICKET-003',
          subject: 'Feature request: Advanced analytics dashboard',
          description: 'Would love to see more detailed analytics for our campaigns. Current dashboard is limited.',
          status: 'pending_customer',
          priority: 'low',
          category: 'feature_request',
          customer: {
            name: 'David Wilson',
            email: 'david@agency.com',
            organization: 'Marketing Agency',
            tier: 'starter',
            avatar: null,
          },
          assignedTo: {
            name: 'Lisa Park',
            email: 'lisa@marketsage.com',
            avatar: null,
          },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          responseTime: 25, // minutes
          resolutionTime: null,
          satisfaction: null,
          tags: ['feature', 'analytics', 'dashboard'],
          messages: 2,
          lastMessage: 'We will consider this for future updates.',
        },
        {
          id: 'TICKET-004',
          subject: 'Bug: SMS messages not sending',
          description: 'SMS messages are failing to send through the platform. Getting error messages.',
          status: 'resolved',
          priority: 'high',
          category: 'bug_report',
          customer: {
            name: 'Emma Thompson',
            email: 'emma@retail.com',
            organization: 'Retail Chain',
            tier: 'enterprise',
            avatar: null,
          },
          assignedTo: {
            name: 'Alex Rodriguez',
            email: 'alex@marketsage.com',
            avatar: null,
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString(),
          responseTime: 12, // minutes
          resolutionTime: 180, // minutes
          satisfaction: 5,
          tags: ['sms', 'bug', 'sending'],
          messages: 8,
          lastMessage: 'Issue resolved. SMS service restored.',
        },
        {
          id: 'TICKET-005',
          subject: 'General inquiry about pricing plans',
          description: 'Interested in upgrading to Enterprise plan. Need more information about features and pricing.',
          status: 'closed',
          priority: 'low',
          category: 'general',
          customer: {
            name: 'Robert Brown',
            email: 'robert@smallbiz.com',
            organization: 'Small Business Co',
            tier: 'free',
            avatar: null,
          },
          assignedTo: {
            name: 'Jennifer Lee',
            email: 'jennifer@marketsage.com',
            avatar: null,
          },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 129600000).toISOString(),
          responseTime: 30, // minutes
          resolutionTime: 120, // minutes
          satisfaction: 4,
          tags: ['pricing', 'upgrade', 'enterprise'],
          messages: 4,
          lastMessage: 'Thank you for your interest. Pricing details sent.',
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get support tickets: ${err.message}`);
      throw error;
    }
  }

  async getChatSessions() {
    try {
      // Mock chat sessions - in a real implementation, these would come from a chat session table
      return [
        {
          id: 'CHAT-001',
          customer: {
            name: 'Alice Johnson',
            email: 'alice@company.com',
            organization: 'Company Inc',
            avatar: null,
          },
          agent: {
            name: 'Tom Wilson',
            avatar: null,
          },
          status: 'active',
          startTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          duration: 30, // minutes
          messageCount: 15,
          lastMessage: 'Let me check that for you...',
          lastActivity: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          tags: ['technical', 'urgent'],
          waitTime: 2, // minutes
          satisfactionScore: null,
        },
        {
          id: 'CHAT-002',
          customer: {
            name: 'Bob Smith',
            email: 'bob@startup.com',
            organization: 'Startup Co',
            avatar: null,
          },
          agent: {
            name: 'Sarah Davis',
            avatar: null,
          },
          status: 'waiting',
          startTime: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          duration: 15, // minutes
          messageCount: 8,
          lastMessage: 'Please hold while I investigate...',
          lastActivity: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          tags: ['billing'],
          waitTime: 5, // minutes
          satisfactionScore: null,
        },
        {
          id: 'CHAT-003',
          customer: {
            name: 'Carol White',
            email: 'carol@business.com',
            organization: 'Business Ltd',
            avatar: null,
          },
          agent: {
            name: 'Mark Johnson',
            avatar: null,
          },
          status: 'ended',
          startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          duration: 45, // minutes
          messageCount: 22,
          lastMessage: 'Thank you for contacting us!',
          lastActivity: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          tags: ['feature', 'question'],
          waitTime: 1, // minutes
          satisfactionScore: 5,
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get chat sessions: ${err.message}`);
      throw error;
    }
  }

  async getSupportStaff() {
    try {
      // Get admin users from the database
      const adminUsers = await this.prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'SUPER_ADMIN', 'IT_ADMIN'],
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          lastLoginAt: true,
        },
        take: 10,
      });

      // Transform to support agent format
      return adminUsers.map((user, index) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: null,
        status: this.getAgentStatus(user.lastLoginAt),
        activeTickets: Math.floor(Math.random() * 5) + 1,
        activeChatSessions: Math.floor(Math.random() * 3) + 1,
        todayTicketsResolved: Math.floor(Math.random() * 8) + 2,
        averageResponseTime: Math.floor(Math.random() * 30) + 10, // minutes
        satisfactionRating: 4.5 + Math.random() * 0.5, // 4.5-5.0
        specialties: this.getSpecialties(user.role),
        shift: {
          start: '09:00',
          end: '17:00',
          timezone: 'UTC',
        },
        performance: {
          ticketsResolved: Math.floor(Math.random() * 50) + 20,
          averageResolutionTime: Math.floor(Math.random() * 10) + 5, // hours
          customerSatisfaction: 4.5 + Math.random() * 0.5,
          responseTime: Math.floor(Math.random() * 20) + 10, // minutes
        },
      }));
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get support staff: ${err.message}`);
      throw error;
    }
  }

  async getKnowledgeArticles() {
    try {
      // Mock knowledge articles - in a real implementation, these would come from a knowledge base table
      return [
        {
          id: 'KB-001',
          title: 'Getting Started with Email Campaigns',
          content: 'Learn how to create and send your first email campaign...',
          category: 'getting_started',
          tags: ['email', 'campaigns', 'beginner'],
          author: 'Support Team',
          createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          views: 1250,
          helpful: 89,
          notHelpful: 12,
          status: 'published',
          difficulty: 'beginner',
        },
        {
          id: 'KB-002',
          title: 'Advanced Analytics Dashboard Guide',
          content: 'Master the advanced analytics features...',
          category: 'features',
          tags: ['analytics', 'dashboard', 'advanced'],
          author: 'Product Team',
          createdAt: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
          updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          views: 456,
          helpful: 67,
          notHelpful: 8,
          status: 'published',
          difficulty: 'advanced',
        },
        {
          id: 'KB-003',
          title: 'Troubleshooting SMS Delivery Issues',
          content: 'Common SMS delivery problems and solutions...',
          category: 'troubleshooting',
          tags: ['sms', 'delivery', 'troubleshooting'],
          author: 'Technical Team',
          createdAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
          updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          views: 789,
          helpful: 78,
          notHelpful: 15,
          status: 'published',
          difficulty: 'intermediate',
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get knowledge articles: ${err.message}`);
      throw error;
    }
  }

  async updateTicketStatus(ticketId: string, status: string, notes?: string) {
    try {
      // Mock ticket update - in a real implementation, this would update a support ticket table
      this.logger.log(`Ticket ${ticketId} status updated to ${status}`, { notes });
      
      return {
        success: true,
        message: `Ticket ${ticketId} status updated to ${status}`,
        ticketId,
        status,
        notes,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update ticket status: ${err.message}`);
      throw error;
    }
  }

  async assignTicket(ticketId: string, agentId: string) {
    try {
      // Mock ticket assignment - in a real implementation, this would update a support ticket table
      this.logger.log(`Ticket ${ticketId} assigned to agent ${agentId}`);
      
      return {
        success: true,
        message: `Ticket ${ticketId} assigned successfully`,
        ticketId,
        agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to assign ticket: ${err.message}`);
      throw error;
    }
  }

  // Helper methods
  private getAgentStatus(lastLoginAt: Date | null): 'online' | 'away' | 'busy' | 'offline' {
    if (!lastLoginAt) return 'offline';
    
    const minutesSinceLogin = Math.floor((Date.now() - lastLoginAt.getTime()) / (1000 * 60));
    
    if (minutesSinceLogin < 5) return 'online';
    if (minutesSinceLogin < 30) return 'away';
    if (minutesSinceLogin < 120) return 'busy';
    return 'offline';
  }

  private getSpecialties(role: string): string[] {
    switch (role) {
      case 'SUPER_ADMIN':
        return ['technical', 'billing', 'feature_request', 'bug_report', 'general'];
      case 'IT_ADMIN':
        return ['technical', 'bug_report'];
      case 'ADMIN':
        return ['billing', 'general', 'feature_request'];
      default:
        return ['general'];
    }
  }

  async getUserSupport(userId: string) {
    try {
      this.logger.log(`Getting support information for user ${userId}`);
      
      // Return mock user support data
      return {
        userId,
        tickets: [
          {
            id: 'TICKET-001',
            subject: 'Email delivery issues',
            status: 'open',
            priority: 'high',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'TICKET-002',
            subject: 'Account upgrade request',
            status: 'resolved',
            priority: 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        knowledgeBase: [
          {
            id: 'KB-001',
            title: 'How to create a campaign',
            category: 'Campaigns',
            views: 1250,
          },
          {
            id: 'KB-002',
            title: 'Email delivery troubleshooting',
            category: 'Email',
            views: 890,
          },
        ],
        chatSessions: [
          {
            id: 'CHAT-001',
            status: 'active',
            startedAt: new Date().toISOString(),
            agent: 'Support Agent 1',
          },
        ],
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting user support for user ${userId}: ${err.message}`);
      throw error;
    }
  }

  async createUserSupportTicket(userId: string, ticketData: any) {
    try {
      this.logger.log(`Creating support ticket for user ${userId}`);
      
      // Return mock created ticket
      return {
        id: `TICKET-${Date.now()}`,
        userId,
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority || 'medium',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error creating support ticket for user ${userId}: ${err.message}`);
      throw error;
    }
  }
}
