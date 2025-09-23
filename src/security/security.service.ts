import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSecurityStats() {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get user activity stats
      const [totalUsers, activeUsers, recentLogins] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: {
            lastLoginAt: {
              gte: last24Hours,
            },
          },
        }),
        this.prisma.user.count({
          where: {
            lastLoginAt: {
              gte: last7Days,
            },
          },
        }),
      ]);

      // Get API key stats
      const [totalApiKeys, activeApiKeys, expiredApiKeys] = await Promise.all([
        this.prisma.apiKey.count(),
        this.prisma.apiKey.count({
          where: {
            isActive: true,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: now } },
            ],
          },
        }),
        this.prisma.apiKey.count({
          where: {
            expiresAt: {
              lt: now,
            },
          },
        }),
      ]);

      // Mock security events (in a real implementation, these would come from security logs)
      const mockSecurityEvents = [
        {
          id: 'event_1',
          eventType: 'LOGIN_ATTEMPT',
          severity: 'medium',
          title: 'Multiple failed login attempts',
          description: 'Detected 5 failed login attempts from IP 192.168.1.100',
          ipAddress: '192.168.1.100',
          userId: null,
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          resolved: false,
          metadata: {
            attempts: 5,
            timeWindow: '10 minutes',
            blocked: true,
          },
        },
        {
          id: 'event_2',
          eventType: 'API_ABUSE',
          severity: 'high',
          title: 'Suspicious API usage pattern',
          description: 'High frequency API calls detected from API key',
          ipAddress: '192.168.1.50',
          userId: 'user_123',
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          resolved: true,
          metadata: {
            callsPerMinute: 150,
            threshold: 100,
            apiKeyId: 'key_456',
          },
        },
      ];

      // Mock threat detection data
      const mockThreats = [
        {
          ipAddress: '192.168.1.100',
          threatType: 'brute_force',
          riskScore: 85,
          eventCount: 12,
          blocked: true,
          location: 'Nigeria',
          lastSeen: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          ipAddress: '10.0.0.50',
          threatType: 'suspicious_activity',
          riskScore: 65,
          eventCount: 8,
          blocked: false,
          location: 'Unknown',
          lastSeen: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ];

      return {
        overview: {
          totalUsers,
          activeUsers,
          recentLogins,
          totalApiKeys,
          activeApiKeys,
          expiredApiKeys,
        },
        recentEvents: mockSecurityEvents,
        topThreats: mockThreats,
        systemStatus: {
          firewall: 'active',
          ddosProtection: 'online',
          intrusionDetection: 'monitoring',
          vulnerabilityScan: 'scheduled',
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get security stats: ${err.message}`);
      throw error;
    }
  }

  async getSecurityEvents(limit: number = 50, offset: number = 0) {
    try {
      // In a real implementation, this would query security event logs
      // For now, we'll return mock data
      const mockEvents = [
        {
          id: 'event_1',
          eventType: 'LOGIN_ATTEMPT',
          severity: 'medium',
          title: 'Multiple failed login attempts',
          description: 'Detected 5 failed login attempts from IP 192.168.1.100',
          ipAddress: '192.168.1.100',
          userId: null,
          timestamp: new Date().toISOString(),
          resolved: false,
          metadata: {
            attempts: 5,
            timeWindow: '10 minutes',
            blocked: true,
          },
        },
        {
          id: 'event_2',
          eventType: 'API_ABUSE',
          severity: 'high',
          title: 'Suspicious API usage pattern',
          description: 'High frequency API calls detected from API key',
          ipAddress: '192.168.1.50',
          userId: 'user_123',
          timestamp: new Date().toISOString(),
          resolved: true,
          metadata: {
            callsPerMinute: 150,
            threshold: 100,
            apiKeyId: 'key_456',
          },
        },
        {
          id: 'event_3',
          eventType: 'DATA_ACCESS',
          severity: 'low',
          title: 'Bulk data export',
          description: 'Large data export initiated by user',
          ipAddress: '192.168.1.75',
          userId: 'user_789',
          timestamp: new Date().toISOString(),
          resolved: false,
          metadata: {
            recordCount: 10000,
            exportType: 'contacts',
          },
        },
      ];

      return {
        events: mockEvents.slice(offset, offset + limit),
        total: mockEvents.length,
        hasMore: offset + limit < mockEvents.length,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get security events: ${err.message}`);
      throw error;
    }
  }

  async getAccessLogs(limit: number = 50, offset: number = 0) {
    try {
      // In a real implementation, this would query audit logs
      // For now, we'll return mock data
      const mockLogs = [
        {
          id: 'log_1',
          userId: 'user_123',
          action: 'VIEW_SECURITY_STATS',
          resource: 'Security Center',
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (compatible)',
          timestamp: new Date().toISOString(),
          success: true,
        },
        {
          id: 'log_2',
          userId: 'user_456',
          action: 'CREATE_API_KEY',
          resource: 'API Management',
          ipAddress: '192.168.1.75',
          userAgent: 'Mozilla/5.0 (compatible)',
          timestamp: new Date().toISOString(),
          success: true,
        },
        {
          id: 'log_3',
          userId: null,
          action: 'LOGIN_ATTEMPT',
          resource: 'Authentication',
          ipAddress: '192.168.1.100',
          userAgent: 'curl/7.68.0',
          timestamp: new Date().toISOString(),
          success: false,
        },
      ];

      return {
        logs: mockLogs.slice(offset, offset + limit),
        total: mockLogs.length,
        hasMore: offset + limit < mockLogs.length,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get access logs: ${err.message}`);
      throw error;
    }
  }

  async getApiKeys() {
    try {
      const apiKeys = await this.prisma.apiKey.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          lastUsedAt: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform to match frontend interface
      return apiKeys.map(key => ({
        id: key.id,
        name: key.name,
        organization: key.organization.name,
        keyPreview: `ms_${key.id.substring(0, 8)}...***`,
        permissions: ['system:read'], // Mock permissions
        lastUsed: key.lastUsedAt?.toISOString() || new Date().toISOString(),
        createdAt: key.createdAt.toISOString(),
        status: key.isActive ? 'active' : 'revoked',
        usageCount: Math.floor(Math.random() * 10000) + 1000, // Mock usage count
      }));
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get API keys: ${err.message}`);
      throw error;
    }
  }

  async getThreatDetection() {
    try {
      // In a real implementation, this would query threat detection logs
      // For now, we'll return mock data
      const mockThreats = [
        {
          id: 'threat_1',
          type: 'brute_force',
          source: '192.168.1.100',
          target: '/admin/login',
          severity: 'high',
          blocked: true,
          timestamp: new Date().toISOString(),
          details: 'Multiple failed login attempts detected',
        },
        {
          id: 'threat_2',
          type: 'suspicious_activity',
          source: '10.0.0.50',
          target: 'Various endpoints',
          severity: 'medium',
          blocked: false,
          timestamp: new Date().toISOString(),
          details: 'Unusual request patterns detected',
        },
        {
          id: 'threat_3',
          type: 'api_abuse',
          source: '192.168.1.75',
          target: '/api/v2/campaigns',
          severity: 'critical',
          blocked: true,
          timestamp: new Date().toISOString(),
          details: 'Excessive API calls detected',
        },
      ];

      return mockThreats;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get threat detection: ${err.message}`);
      throw error;
    }
  }

  async resolveSecurityEvent(eventId: string) {
    try {
      // In a real implementation, this would update the security event status
      this.logger.log(`Security event ${eventId} resolved`);
      return { success: true, message: 'Security event resolved successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to resolve security event: ${err.message}`);
      throw error;
    }
  }

  async blockThreat(threatId: string) {
    try {
      // In a real implementation, this would block the threat source
      this.logger.log(`Threat ${threatId} blocked`);
      return { success: true, message: 'Threat blocked successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to block threat: ${err.message}`);
      throw error;
    }
  }

  async revokeApiKey(apiKeyId: string) {
    try {
      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: { isActive: false },
      });

      this.logger.log(`API key ${apiKeyId} revoked`);
      return { success: true, message: 'API key revoked successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to revoke API key: ${err.message}`);
      throw error;
    }
  }

  async getUserSecurity(userId: string) {
    try {
      this.logger.log(`Getting security information for user ${userId}`);
      
      // Return mock user security data
      return {
        userId,
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: new Date().toISOString(),
          loginHistory: [
            {
              timestamp: new Date().toISOString(),
              ipAddress: '192.168.1.100',
              userAgent: 'Mozilla/5.0...',
              success: true,
            },
          ],
          activeSessions: 1,
          securityScore: 85,
        },
        alerts: [
          {
            type: 'login_from_new_location',
            message: 'Login from new IP address detected',
            severity: 'medium',
            timestamp: new Date().toISOString(),
          },
        ],
        recommendations: [
          {
            type: 'enable_2fa',
            message: 'Enable two-factor authentication for better security',
            priority: 'high',
          },
        ],
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting user security for user ${userId}: ${err.message}`);
      throw error;
    }
  }
}
