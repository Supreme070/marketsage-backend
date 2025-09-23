import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncidentsService {
  private readonly logger = new Logger(IncidentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getIncidents() {
    try {
      // Mock incidents data - in a real implementation, these would come from an incidents table
      return [
        {
          id: 'INC-001',
          title: 'Database Connection Pool Exhaustion',
          description: 'High number of concurrent connections causing timeouts and degraded performance',
          severity: 'critical',
          status: 'investigating',
          affectedSystems: ['Database', 'API', 'Web Application'],
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          resolvedAt: null,
          assignedTo: 'John Smith',
          reporter: 'System Monitor',
          impactDescription: 'Users experiencing slow response times and occasional timeouts',
          resolutionNotes: null,
          escalationLevel: 2,
          estimatedResolutionTime: '2 hours',
          actualResolutionTime: null,
          rootCause: null,
          followUpActions: [],
        },
        {
          id: 'INC-002',
          title: 'SMS Service Provider Rate Limiting',
          description: 'SMS messages failing due to provider rate limiting',
          severity: 'high',
          status: 'identified',
          affectedSystems: ['SMS Service', 'Campaign System'],
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          resolvedAt: null,
          assignedTo: 'Sarah Johnson',
          reporter: 'Alert System',
          impactDescription: 'SMS campaigns delayed, affecting customer communication',
          resolutionNotes: 'Contacted provider support, implementing backoff strategy',
          escalationLevel: 1,
          estimatedResolutionTime: '1 hour',
          actualResolutionTime: null,
          rootCause: 'Provider API rate limiting',
          followUpActions: ['Implement exponential backoff', 'Add provider failover'],
        },
        {
          id: 'INC-003',
          title: 'Email Delivery Issues',
          description: 'Email delivery rates dropped significantly',
          severity: 'medium',
          status: 'monitoring',
          affectedSystems: ['Email Service', 'Campaign System'],
          createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
          updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          resolvedAt: null,
          assignedTo: 'Mike Chen',
          reporter: 'Monitoring System',
          impactDescription: 'Email campaigns experiencing lower delivery rates',
          resolutionNotes: 'Working with email provider to resolve delivery issues',
          escalationLevel: 1,
          estimatedResolutionTime: '3 hours',
          actualResolutionTime: null,
          rootCause: 'Email provider reputation issues',
          followUpActions: ['Review email content', 'Update sender reputation'],
        },
        {
          id: 'INC-004',
          title: 'Redis Cache Performance Degradation',
          description: 'Redis cache response times increased significantly',
          severity: 'low',
          status: 'resolved',
          affectedSystems: ['Redis Cache', 'API'],
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          resolvedAt: new Date(Date.now() - 43200000).toISOString(),
          assignedTo: 'Alex Rodriguez',
          reporter: 'Performance Monitor',
          impactDescription: 'API response times increased by 200ms',
          resolutionNotes: 'Cleared cache and restarted Redis service',
          escalationLevel: 0,
          estimatedResolutionTime: '30 minutes',
          actualResolutionTime: '45 minutes',
          rootCause: 'Memory fragmentation in Redis',
          followUpActions: ['Monitor Redis memory usage', 'Implement cache cleanup routine'],
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get incidents: ${err.message}`);
      throw error;
    }
  }

  async getSystemComponents() {
    try {
      // Mock system components data - in a real implementation, these would come from a system monitoring service
      return [
        {
          name: 'Database',
          status: 'operational',
          description: 'Primary PostgreSQL database',
          lastIncident: 'INC-004',
          uptime: '99.9%',
          dependencies: ['Redis Cache'],
        },
        {
          name: 'API',
          status: 'operational',
          description: 'REST API service',
          lastIncident: 'INC-001',
          uptime: '99.8%',
          dependencies: ['Database', 'Redis Cache'],
        },
        {
          name: 'Web Application',
          status: 'operational',
          description: 'Frontend application',
          lastIncident: 'INC-001',
          uptime: '99.9%',
          dependencies: ['API'],
        },
        {
          name: 'SMS Service',
          status: 'degraded',
          description: 'SMS messaging service',
          lastIncident: 'INC-002',
          uptime: '98.5%',
          dependencies: ['API'],
        },
        {
          name: 'Email Service',
          status: 'operational',
          description: 'Email delivery service',
          lastIncident: 'INC-003',
          uptime: '99.2%',
          dependencies: ['API'],
        },
        {
          name: 'WhatsApp API',
          status: 'operational',
          description: 'WhatsApp Business API',
          lastIncident: null,
          uptime: '99.9%',
          dependencies: ['API'],
        },
        {
          name: 'Redis Cache',
          status: 'operational',
          description: 'Redis caching layer',
          lastIncident: 'INC-004',
          uptime: '99.7%',
          dependencies: [],
        },
        {
          name: 'Message Queue',
          status: 'operational',
          description: 'Bull queue system',
          lastIncident: null,
          uptime: '99.9%',
          dependencies: ['Redis Cache'],
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get system components: ${err.message}`);
      throw error;
    }
  }

  async getPostMortems() {
    try {
      // Mock post-mortem data - in a real implementation, these would come from a post-mortem table
      return [
        {
          id: 'PM-001',
          incidentId: 'INC-004',
          incidentTitle: 'Redis Cache Performance Degradation',
          createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          duration: '45 minutes',
          severity: 'low',
          rootCause: 'Memory fragmentation in Redis due to improper cache eviction policies',
          timeline: [
            {
              time: '14:30',
              event: 'Redis response time exceeded 100ms threshold',
              action: 'Alert triggered',
            },
            {
              time: '14:32',
              event: 'Incident created and assigned',
              action: 'Alex Rodriguez assigned',
            },
            {
              time: '14:45',
              event: 'Root cause identified',
              action: 'Memory fragmentation detected',
            },
            {
              time: '15:15',
              event: 'Issue resolved',
              action: 'Redis restarted and cache cleared',
            },
          ],
          lessonsLearned: [
            'Implement proper cache eviction policies',
            'Monitor Redis memory usage more closely',
            'Add automated cache cleanup routines',
          ],
          actionItems: [
            {
              description: 'Implement Redis memory monitoring',
              assignee: 'Alex Rodriguez',
              dueDate: '2024-01-15',
              status: 'pending',
            },
            {
              description: 'Add automated cache cleanup',
              assignee: 'Mike Chen',
              dueDate: '2024-01-20',
              status: 'in_progress',
            },
          ],
          affectedUsers: 150,
          financialImpact: '$500 in lost productivity',
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get post-mortems: ${err.message}`);
      throw error;
    }
  }

  async getEscalationRules() {
    try {
      // Mock escalation rules data - in a real implementation, these would come from an escalation rules table
      return [
        {
          id: 'ESC-001',
          name: 'Critical System Outage',
          severity: 'critical',
          triggerConditions: ['System down for > 5 minutes', 'Multiple systems affected'],
          escalationPath: [
            {
              level: 1,
              role: 'On-call Engineer',
              timeoutMinutes: 5,
              notificationMethods: ['email', 'sms'],
            },
            {
              level: 2,
              role: 'Engineering Manager',
              timeoutMinutes: 15,
              notificationMethods: ['email', 'sms', 'slack'],
            },
            {
              level: 3,
              role: 'CTO',
              timeoutMinutes: 30,
              notificationMethods: ['email', 'sms', 'slack'],
            },
          ],
          isActive: true,
        },
        {
          id: 'ESC-002',
          name: 'High Severity Incident',
          severity: 'high',
          triggerConditions: ['Service degradation', 'User impact > 100 users'],
          escalationPath: [
            {
              level: 1,
              role: 'On-call Engineer',
              timeoutMinutes: 10,
              notificationMethods: ['email', 'slack'],
            },
            {
              level: 2,
              role: 'Engineering Manager',
              timeoutMinutes: 30,
              notificationMethods: ['email', 'slack'],
            },
          ],
          isActive: true,
        },
        {
          id: 'ESC-003',
          name: 'Medium Severity Incident',
          severity: 'medium',
          triggerConditions: ['Performance degradation', 'User impact < 100 users'],
          escalationPath: [
            {
              level: 1,
              role: 'On-call Engineer',
              timeoutMinutes: 30,
              notificationMethods: ['email'],
            },
          ],
          isActive: true,
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get escalation rules: ${err.message}`);
      throw error;
    }
  }

  async getAlerts() {
    try {
      // Mock alerts data - in a real implementation, these would come from an alerts table
      return [
        {
          id: 'ALT-001',
          name: 'Database Connection Pool',
          description: 'Monitor database connection pool usage',
          metric: 'connection_pool_usage',
          threshold: {
            warning: 80,
            critical: 95,
          },
          currentValue: 92,
          status: 'critical',
          lastTriggered: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isEnabled: true,
        },
        {
          id: 'ALT-002',
          name: 'API Response Time',
          description: 'Monitor API response times',
          metric: 'api_response_time',
          threshold: {
            warning: 500,
            critical: 1000,
          },
          currentValue: 750,
          status: 'warning',
          lastTriggered: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          isEnabled: true,
        },
        {
          id: 'ALT-003',
          name: 'SMS Delivery Rate',
          description: 'Monitor SMS delivery success rate',
          metric: 'sms_delivery_rate',
          threshold: {
            warning: 95,
            critical: 90,
          },
          currentValue: 88,
          status: 'critical',
          lastTriggered: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          isEnabled: true,
        },
        {
          id: 'ALT-004',
          name: 'Email Delivery Rate',
          description: 'Monitor email delivery success rate',
          metric: 'email_delivery_rate',
          threshold: {
            warning: 95,
            critical: 90,
          },
          currentValue: 96,
          status: 'normal',
          lastTriggered: null,
          isEnabled: true,
        },
        {
          id: 'ALT-005',
          name: 'Redis Memory Usage',
          description: 'Monitor Redis memory usage',
          metric: 'redis_memory_usage',
          threshold: {
            warning: 80,
            critical: 90,
          },
          currentValue: 75,
          status: 'normal',
          lastTriggered: null,
          isEnabled: true,
        },
      ];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get alerts: ${err.message}`);
      throw error;
    }
  }

  async getIncidentMetrics() {
    try {
      const incidents = await this.getIncidents();
      const systemComponents = await this.getSystemComponents();
      const alerts = await this.getAlerts();

      const activeIncidents = incidents.filter(i => i.status !== 'resolved');
      const criticalIncidents = incidents.filter(i => i.severity === 'critical');
      const systemHealth = Math.round((systemComponents.filter(c => c.status === 'operational').length / systemComponents.length) * 100);
      const activeAlerts = alerts.filter(a => a.status !== 'normal');

      // Calculate average resolution time
      const resolvedIncidents = incidents.filter(i => i.status === 'resolved' && i.actualResolutionTime);
      const avgResolutionTime = resolvedIncidents.length > 0 ? 
        resolvedIncidents.reduce((acc, incident) => {
          const created = new Date(incident.createdAt);
          const resolved = new Date(incident.resolvedAt!);
          return acc + (resolved.getTime() - created.getTime());
        }, 0) / resolvedIncidents.length : 0;

      const avgResolutionHours = avgResolutionTime > 0 ? 
        Math.round(avgResolutionTime / (1000 * 60 * 60) * 10) / 10 : 0;

      return {
        activeIncidents: activeIncidents.length,
        criticalIncidents: criticalIncidents.length,
        systemHealth,
        avgResolutionTime: avgResolutionHours > 0 ? `${avgResolutionHours}h` : 'N/A',
        activeAlerts: activeAlerts.length,
        totalIncidents: incidents.length,
        resolvedIncidents: incidents.filter(i => i.status === 'resolved').length,
        escalationLevel: Math.max(...activeIncidents.map(i => i.escalationLevel), 0),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get incident metrics: ${err.message}`);
      throw error;
    }
  }

  async updateIncidentStatus(incidentId: string, status: string, notes?: string) {
    try {
      // Mock incident update - in a real implementation, this would update an incidents table
      this.logger.log(`Incident ${incidentId} status updated to ${status}`, { notes });
      
      return {
        success: true,
        message: `Incident ${incidentId} status updated to ${status}`,
        incidentId,
        status,
        notes,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update incident status: ${err.message}`);
      throw error;
    }
  }

  async createIncident(incidentData: any) {
    try {
      // Mock incident creation - in a real implementation, this would create a new incident
      this.logger.log(`Creating new incident: ${incidentData.title}`);
      
      return {
        success: true,
        message: 'Incident created successfully',
        incidentId: `INC-${Date.now()}`,
        incident: {
          ...incidentData,
          id: `INC-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'investigating',
          escalationLevel: 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create incident: ${err.message}`);
      throw error;
    }
  }

  async getUserIncidents(userId: string) {
    try {
      this.logger.log(`Getting incidents information for user ${userId}`);
      
      // Return mock user incidents data
      return {
        userId,
        incidents: [
          {
            id: 'INC-001',
            title: 'Email delivery delay',
            description: 'Emails are being delayed by 5-10 minutes',
            severity: 'medium',
            status: 'investigating',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'INC-002',
            title: 'Campaign analytics not updating',
            description: 'Real-time analytics are not updating',
            severity: 'low',
            status: 'resolved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resolvedAt: new Date().toISOString(),
          },
        ],
        systemStatus: {
          overall: 'operational',
          services: {
            email: 'degraded',
            sms: 'operational',
            whatsapp: 'operational',
            analytics: 'operational',
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting user incidents for user ${userId}: ${err.message}`);
      throw error;
    }
  }
}
