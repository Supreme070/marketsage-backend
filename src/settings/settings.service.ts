import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStaffMembers() {
    try {
      const staffMembers = await this.prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'SUPER_ADMIN', 'IT_ADMIN'],
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isSuspended: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform to match frontend interface
      return staffMembers.map(member => ({
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role as 'ADMIN' | 'SUPER_ADMIN' | 'IT_ADMIN',
        status: member.isSuspended ? 'inactive' : member.emailVerified ? 'active' : 'pending',
        permissions: this.getPermissionsForRole(member.role),
        lastActive: member.lastLoginAt?.toISOString() || member.updatedAt.toISOString(),
        createdAt: member.createdAt.toISOString(),
        ipWhitelist: [], // Mock data - would come from separate IP whitelist table
        twoFactorEnabled: false, // Mock data - would come from 2FA settings
      }));
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get staff members: ${err.message}`);
      throw error;
    }
  }

  async getSecuritySettings() {
    try {
      // Mock security settings - in a real implementation, these would come from a settings table
      return {
        sessionTimeout: 1800, // 30 minutes
        twoFactorRequired: false,
        ipWhitelistEnabled: false,
        ipWhitelist: [],
        passwordPolicy: {
          minLength: 12,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: true,
          maxAge: 90, // days
        },
        loginAttempts: {
          maxAttempts: 5,
          lockoutDuration: 300, // 5 minutes
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get security settings: ${err.message}`);
      throw error;
    }
  }

  async getNotificationSettings() {
    try {
      // Mock notification settings - in a real implementation, these would come from a settings table
      return {
        emailEnabled: true,
        slackEnabled: false,
        smsEnabled: false,
        channels: {
          security: ['email'],
          system: ['email'],
          user: ['email'],
          billing: ['email'],
        },
        escalation: {
          highPriorityMinutes: 30,
          criticalMinutes: 5,
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get notification settings: ${err.message}`);
      throw error;
    }
  }

  async getSystemSettings() {
    try {
      // Mock system settings - in a real implementation, these would come from a settings table
      return {
        maintenanceMode: false,
        maintenanceMessage: "MarketSage is undergoing scheduled maintenance. We'll be back shortly.",
        featureFlags: {
          'new-dashboard': true,
          'advanced-analytics': false,
          'beta-features': false,
        },
        rateLimiting: {
          api: 1000, // requests per minute
          auth: 10, // login attempts per minute
          bulk: 100, // bulk operations per minute
        },
        cacheTTL: {
          session: 1800, // 30 minutes
          data: 300, // 5 minutes
          static: 3600, // 1 hour
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get system settings: ${err.message}`);
      throw error;
    }
  }

  async getLogSettings() {
    try {
      // Mock log settings - in a real implementation, these would come from a settings table
      return {
        retention: {
          audit: 365, // days
          system: 90, // days
          security: 180, // days
        },
        levels: {
          application: 'info',
          security: 'warn',
          audit: 'info',
        },
        export: {
          format: 'json',
          compression: true,
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get log settings: ${err.message}`);
      throw error;
    }
  }

  async updateSecuritySettings(settings: any) {
    try {
      // In a real implementation, this would update a settings table
      this.logger.log('Security settings updated', settings);
      return { success: true, message: 'Security settings updated successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update security settings: ${err.message}`);
      throw error;
    }
  }

  async updateNotificationSettings(settings: any) {
    try {
      // In a real implementation, this would update a settings table
      this.logger.log('Notification settings updated', settings);
      return { success: true, message: 'Notification settings updated successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update notification settings: ${err.message}`);
      throw error;
    }
  }

  async updateSystemSettings(settings: any) {
    try {
      // In a real implementation, this would update a settings table
      this.logger.log('System settings updated', settings);
      return { success: true, message: 'System settings updated successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update system settings: ${err.message}`);
      throw error;
    }
  }

  async updateLogSettings(settings: any) {
    try {
      // In a real implementation, this would update a settings table
      this.logger.log('Log settings updated', settings);
      return { success: true, message: 'Log settings updated successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update log settings: ${err.message}`);
      throw error;
    }
  }

  async addStaffMember(staffData: any) {
    try {
      // In a real implementation, this would create a new user with admin role
      this.logger.log('Staff member added', staffData);
      return { success: true, message: 'Staff member added successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to add staff member: ${err.message}`);
      throw error;
    }
  }

  async updateStaffMember(id: string, staffData: any) {
    try {
      // In a real implementation, this would update the user
      this.logger.log(`Staff member ${id} updated`, staffData);
      return { success: true, message: 'Staff member updated successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update staff member: ${err.message}`);
      throw error;
    }
  }

  async removeStaffMember(id: string) {
    try {
      // In a real implementation, this would deactivate or delete the user
      this.logger.log(`Staff member ${id} removed`);
      return { success: true, message: 'Staff member removed successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to remove staff member: ${err.message}`);
      throw error;
    }
  }

  private getPermissionsForRole(role: string): string[] {
    // Mock permissions based on role
    switch (role) {
      case 'SUPER_ADMIN':
        return ['VIEW_ADMIN', 'VIEW_USER', 'UPDATE_USER', 'VIEW_ORGANIZATION', 'VIEW_SYSTEM_LOGS'];
      case 'IT_ADMIN':
        return ['VIEW_ADMIN', 'VIEW_SYSTEM_LOGS'];
      case 'ADMIN':
        return ['VIEW_ADMIN', 'VIEW_USER', 'VIEW_ORGANIZATION'];
      default:
        return [];
    }
  }

  async getUserSettings(userId: string) {
    try {
      this.logger.log(`Getting user settings for user ${userId}`);
      
      // Return mock user settings
      return {
        userId,
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
        },
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false,
          security: true,
        },
        privacy: {
          profileVisibility: 'private',
          dataSharing: false,
          analytics: true,
        },
        security: {
          twoFactorEnabled: false,
          sessionTimeout: 30,
          loginNotifications: true,
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting user settings for user ${userId}: ${err.message}`);
      throw error;
    }
  }

  async updateUserSettings(userId: string, settingsData: any) {
    try {
      this.logger.log(`Updating user settings for user ${userId}`);
      
      // Return mock updated settings
      return {
        userId,
        ...settingsData,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error updating user settings for user ${userId}: ${err.message}`);
      throw error;
    }
  }
}
