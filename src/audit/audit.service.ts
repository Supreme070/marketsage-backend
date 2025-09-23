import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAuditStats() {
    try {
      // Mock audit stats - in a real implementation, these would come from an audit log table
      const totalEvents = 15420;
      const todayEvents = 234;
      const activeUsers = 12;
      const systemChanges = 45;

      // Mock recent activities
      const recentActivities = [
        {
          id: 'audit-1',
          action: 'UPDATE',
          resource: 'user',
          resourceId: 'user-123',
          userId: 'admin-1',
          userEmail: 'admin@marketsage.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date().toISOString(),
          changes: {
            before: { status: 'active' },
            after: { status: 'suspended' }
          }
        },
        {
          id: 'audit-2',
          action: 'CREATE',
          resource: 'campaign',
          resourceId: 'campaign-456',
          userId: 'admin-2',
          userEmail: 'manager@marketsage.com',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          changes: {
            after: { name: 'Summer Campaign', type: 'email' }
          }
        },
        {
          id: 'audit-3',
          action: 'LOGIN',
          resource: 'system',
          resourceId: 'auth-session',
          userId: 'admin-3',
          userEmail: 'superadmin@marketsage.com',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date(Date.now() - 600000).toISOString(),
        },
        {
          id: 'audit-4',
          action: 'DELETE',
          resource: 'organization',
          resourceId: 'org-789',
          userId: 'admin-1',
          userEmail: 'admin@marketsage.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          changes: {
            before: { name: 'Test Org', status: 'active' }
          }
        },
        {
          id: 'audit-5',
          action: 'CONFIG_CHANGE',
          resource: 'settings',
          resourceId: 'security-settings',
          userId: 'admin-2',
          userEmail: 'manager@marketsage.com',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          changes: {
            before: { twoFactorRequired: false },
            after: { twoFactorRequired: true }
          }
        }
      ];

      // Mock top resources
      const topResources = [
        { resource: 'user', count: 3420 },
        { resource: 'campaign', count: 2890 },
        { resource: 'organization', count: 1560 },
        { resource: 'settings', count: 890 },
        { resource: 'contact', count: 2340 }
      ];

      // Mock top users
      const topUsers = [
        { userId: 'admin-1', email: 'admin@marketsage.com', count: 2340 },
        { userId: 'admin-2', email: 'manager@marketsage.com', count: 1890 },
        { userId: 'admin-3', email: 'superadmin@marketsage.com', count: 1560 },
        { userId: 'admin-4', email: 'support@marketsage.com', count: 1230 },
        { userId: 'admin-5', email: 'dev@marketsage.com', count: 980 }
      ];

      return {
        totalEvents,
        todayEvents,
        activeUsers,
        systemChanges,
        recentActivities,
        topResources,
        topUsers
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get audit stats: ${err.message}`);
      throw error;
    }
  }

  async getAuditLogs(filters: any, pagination: any) {
    try {
      const { page = 1, limit = 20, type = 'admin-actions' } = pagination;
      const { action, resource, userId, dateFrom, dateTo, search } = filters;

      // Mock audit logs - in a real implementation, these would come from an audit log table
      const mockLogs = [
        {
          id: 'audit-log-1',
          action: 'UPDATE',
          resource: 'user',
          resourceId: 'user-123',
          userId: 'admin-1',
          userEmail: 'admin@marketsage.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date().toISOString(),
          changes: {
            before: { status: 'active', lastLoginAt: '2024-01-15T10:30:00Z' },
            after: { status: 'suspended', lastLoginAt: '2024-01-15T10:30:00Z' }
          },
          metadata: {
            reason: 'Policy violation',
            adminNotes: 'User suspended due to suspicious activity'
          }
        },
        {
          id: 'audit-log-2',
          action: 'CREATE',
          resource: 'campaign',
          resourceId: 'campaign-456',
          userId: 'admin-2',
          userEmail: 'manager@marketsage.com',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          changes: {
            after: { 
              name: 'Summer Campaign 2024', 
              type: 'email',
              status: 'draft',
              targetAudience: 'all_users'
            }
          },
          metadata: {
            template: 'summer-promotion',
            estimatedRecipients: 50000
          }
        },
        {
          id: 'audit-log-3',
          action: 'LOGIN',
          resource: 'system',
          resourceId: 'auth-session-789',
          userId: 'admin-3',
          userEmail: 'superadmin@marketsage.com',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          metadata: {
            sessionId: 'sess_abc123def456',
            loginMethod: 'password',
            twoFactorUsed: true
          }
        },
        {
          id: 'audit-log-4',
          action: 'DELETE',
          resource: 'organization',
          resourceId: 'org-789',
          userId: 'admin-1',
          userEmail: 'admin@marketsage.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          changes: {
            before: { 
              name: 'Test Organization', 
              status: 'active',
              userCount: 25,
              plan: 'premium'
            }
          },
          metadata: {
            reason: 'Account closure requested',
            dataRetention: '30 days',
            backupCreated: true
          }
        },
        {
          id: 'audit-log-5',
          action: 'CONFIG_CHANGE',
          resource: 'settings',
          resourceId: 'security-settings',
          userId: 'admin-2',
          userEmail: 'manager@marketsage.com',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          changes: {
            before: { 
              twoFactorRequired: false,
              sessionTimeout: 1800,
              maxLoginAttempts: 5
            },
            after: { 
              twoFactorRequired: true,
              sessionTimeout: 3600,
              maxLoginAttempts: 3
            }
          },
          metadata: {
            policyUpdate: 'Enhanced security requirements',
            effectiveDate: new Date().toISOString()
          }
        },
        {
          id: 'audit-log-6',
          action: 'VIEW',
          resource: 'analytics',
          resourceId: 'dashboard-data',
          userId: 'admin-4',
          userEmail: 'support@marketsage.com',
          ipAddress: '192.168.1.103',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 1500000).toISOString(),
          metadata: {
            reportType: 'user_activity',
            dateRange: 'last_30_days',
            filters: { status: 'active' }
          }
        },
        {
          id: 'audit-log-7',
          action: 'PERMISSION_CHANGE',
          resource: 'user',
          resourceId: 'user-456',
          userId: 'admin-1',
          userEmail: 'admin@marketsage.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          changes: {
            before: { role: 'USER', permissions: ['VIEW_CAMPAIGNS'] },
            after: { role: 'ADMIN', permissions: ['VIEW_CAMPAIGNS', 'MANAGE_USERS', 'VIEW_ANALYTICS'] }
          },
          metadata: {
            reason: 'Promotion to admin role',
            approvedBy: 'superadmin@marketsage.com'
          }
        },
        {
          id: 'audit-log-8',
          action: 'SYSTEM_UPDATE',
          resource: 'system',
          resourceId: 'maintenance-mode',
          userId: 'admin-3',
          userEmail: 'superadmin@marketsage.com',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 2100000).toISOString(),
          changes: {
            before: { maintenanceMode: false },
            after: { maintenanceMode: true, message: 'Scheduled maintenance window' }
          },
          metadata: {
            duration: '2 hours',
            affectedServices: ['api', 'dashboard', 'notifications'],
            notificationSent: true
          }
        }
      ];

      // Apply filters (mock implementation)
      let filteredLogs = mockLogs;

      if (action) {
        filteredLogs = filteredLogs.filter(log => log.action === action);
      }

      if (resource) {
        filteredLogs = filteredLogs.filter(log => log.resource === resource);
      }

      if (userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === userId);
      }

      if (search) {
        filteredLogs = filteredLogs.filter(log => 
          log.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
          log.resource?.toLowerCase().includes(search.toLowerCase()) ||
          log.action?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

      return {
        logs: paginatedLogs,
        total: filteredLogs.length,
        page,
        limit,
        totalPages: Math.ceil(filteredLogs.length / limit)
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get audit logs: ${err.message}`);
      throw error;
    }
  }

  async exportAuditLogs(filters: any) {
    try {
      // Mock export - in a real implementation, this would generate a CSV/JSON file
      const logs = await this.getAuditLogs(filters, { page: 1, limit: 10000 });
      
      // Convert to CSV format
      const csvHeaders = 'ID,Timestamp,User,Action,Resource,Resource ID,IP Address,User Agent,Changes,Metadata\n';
      const csvRows = logs.logs.map(log => {
        const changes = log.changes ? JSON.stringify(log.changes).replace(/"/g, '""') : '';
        const metadata = log.metadata ? JSON.stringify(log.metadata).replace(/"/g, '""') : '';
        
        return [
          log.id,
          log.timestamp,
          log.userEmail || 'System',
          log.action,
          log.resource,
          log.resourceId,
          log.ipAddress || '',
          log.userAgent || '',
          changes,
          metadata
        ].map(field => `"${field}"`).join(',');
      }).join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to export audit logs: ${err.message}`);
      throw error;
    }
  }

  async createAuditLog(auditData: any) {
    try {
      // Mock audit log creation - in a real implementation, this would save to an audit log table
      this.logger.log('Audit log created', auditData);
      return { success: true, message: 'Audit log created successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create audit log: ${err.message}`);
      throw error;
    }
  }

  async getUserAudit(userId: string) {
    try {
      this.logger.log(`Getting audit information for user ${userId}`);
      
      // Return mock user audit data
      return {
        userId,
        activities: [
          {
            id: 'audit-1',
            action: 'LOGIN',
            resource: 'auth',
            timestamp: new Date().toISOString(),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0...',
            success: true,
          },
          {
            id: 'audit-2',
            action: 'CREATE',
            resource: 'campaign',
            resourceId: 'campaign-123',
            timestamp: new Date().toISOString(),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0...',
            success: true,
          },
        ],
        stats: {
          totalActivities: 2,
          successfulActions: 2,
          failedActions: 0,
          lastActivity: new Date().toISOString(),
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting user audit for user ${userId}: ${err.message}`);
      throw error;
    }
  }
}
