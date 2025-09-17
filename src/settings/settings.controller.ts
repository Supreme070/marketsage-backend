import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getSettings(
    @Query('type') type: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      let data;
      
      switch (type) {
        case 'staff':
          data = await this.settingsService.getStaffMembers();
          break;
        case 'security':
          data = await this.settingsService.getSecuritySettings();
          break;
        case 'notifications':
          data = await this.settingsService.getNotificationSettings();
          break;
        case 'system':
          data = await this.settingsService.getSystemSettings();
          break;
        case 'logs':
          data = await this.settingsService.getLogSettings();
          break;
        default:
          return {
            success: false,
            error: {
              code: 'INVALID_TYPE',
              message: 'Invalid settings type specified',
              timestamp: new Date().toISOString(),
            },
          };
      }

      return {
        success: true,
        data,
        message: 'Settings retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SETTINGS_ERROR',
          message: err.message || 'Failed to fetch settings',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(20, 60 * 1000) // 20 updates per minute
  async updateSettings(
    @Body() body: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const { type, category, ...settingsData } = body;
      
      let result;
      
      switch (category) {
        case 'security':
          result = await this.settingsService.updateSecuritySettings(settingsData);
          break;
        case 'notifications':
          result = await this.settingsService.updateNotificationSettings(settingsData);
          break;
        case 'system':
          result = await this.settingsService.updateSystemSettings(settingsData);
          break;
        case 'logging':
          result = await this.settingsService.updateLogSettings(settingsData);
          break;
        default:
          return {
            success: false,
            error: {
              code: 'INVALID_CATEGORY',
              message: 'Invalid settings category specified',
              timestamp: new Date().toISOString(),
            },
          };
      }

      return {
        success: true,
        data: result,
        message: 'Settings updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SETTINGS_UPDATE_ERROR',
          message: err.message || 'Failed to update settings',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('staff')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 staff operations per minute
  async addStaffMember(
    @Body() staffData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.settingsService.addStaffMember(staffData);
      return {
        success: true,
        data: result,
        message: 'Staff member added successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'STAFF_ADD_ERROR',
          message: err.message || 'Failed to add staff member',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('staff/:id')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(20, 60 * 1000) // 20 staff updates per minute
  async updateStaffMember(
    @Param('id') id: string,
    @Body() staffData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.settingsService.updateStaffMember(id, staffData);
      return {
        success: true,
        data: result,
        message: 'Staff member updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'STAFF_UPDATE_ERROR',
          message: err.message || 'Failed to update staff member',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('staff/:id/remove')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(5, 60 * 1000) // 5 staff removals per minute
  async removeStaffMember(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.settingsService.removeStaffMember(id);
      return {
        success: true,
        data: result,
        message: 'Staff member removed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'STAFF_REMOVE_ERROR',
          message: err.message || 'Failed to remove staff member',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
