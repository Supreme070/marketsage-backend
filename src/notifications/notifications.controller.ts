import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto, MarkAsReadDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { OwnershipGuard } from '../auth/guards/ownership.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RequireOwnership } from '../auth/decorators/ownership.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  async findAll(
    @Request() req: any,
    @Query('limit') limit: string = '50',
    @Query('includeRead') includeRead: string = 'false',
    @Query('category') category?: string,
    @Query('type') type?: string,
  ): Promise<ApiResponse> {
    try {
      const limitNum = parseInt(limit, 10) || 50;
      const includeReadBool = includeRead === 'true';
      
      const notifications = await this.notificationsService.findAllForUser(
        req.user.id,
        limitNum,
        includeReadBool,
        category,
        type,
      );
      
      return {
        success: true,
        data: notifications,
        message: 'Notifications retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'NOTIFICATION_FETCH_ERROR',
          message: err.message || 'Failed to fetch notifications',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('unread-count')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getUnreadCount(@Request() req: any): Promise<ApiResponse> {
    try {
      const count = await this.notificationsService.getUnreadCount(req.user.id);
      return {
        success: true,
        data: { count },
        message: 'Unread count retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'UNREAD_COUNT_ERROR',
          message: err.message || 'Failed to get unread count',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RequireOwnership('notification')
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const notification = await this.notificationsService.findOneForUser(
        id,
        req.user.id,
      );
      return {
        success: true,
        data: notification,
        message: 'Notification retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'NOTIFICATION_FETCH_ERROR',
          message: err.message || 'Failed to fetch notification',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.CREATE_USER)
  @RateLimit(20, 60 * 1000) // 20 notifications per minute
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const notification = await this.notificationsService.create(
        createNotificationDto,
        req.user.id,
      );
      return {
        success: true,
        data: notification,
        message: 'Notification created successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'NOTIFICATION_CREATION_ERROR',
          message: err.message || 'Failed to create notification',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Patch(':id/read')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.UPDATE_USER)
  @RequireOwnership('notification')
  @RateLimit(100, 60 * 1000) // 100 mark as read per minute
  async markAsRead(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const notification = await this.notificationsService.markAsRead(
        id,
        req.user.id,
      );
      return {
        success: true,
        data: notification,
        message: 'Notification marked as read',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'MARK_READ_ERROR',
          message: err.message || 'Failed to mark notification as read',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Patch('mark-all-read')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.UPDATE_USER)
  @RateLimit(10, 60 * 1000) // 10 mark all read per minute
  async markAllAsRead(@Request() req: any): Promise<ApiResponse> {
    try {
      const result = await this.notificationsService.markAllAsRead(req.user.id);
      return {
        success: true,
        data: result,
        message: 'All notifications marked as read',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'MARK_ALL_READ_ERROR',
          message: err.message || 'Failed to mark all notifications as read',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.UPDATE_USER)
  @RequireOwnership('notification')
  @RateLimit(20, 60 * 1000) // 20 updates per minute
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const notification = await this.notificationsService.update(
        id,
        updateNotificationDto,
        req.user.id,
      );
      return {
        success: true,
        data: notification,
        message: 'Notification updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'NOTIFICATION_UPDATE_ERROR',
          message: err.message || 'Failed to update notification',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.DELETE_USER)
  @RequireOwnership('notification')
  @RateLimit(10, 60 * 1000) // 10 deletions per minute
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.notificationsService.remove(id, req.user.id);
      return {
        success: true,
        data: result,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'NOTIFICATION_DELETE_ERROR',
          message: err.message || 'Failed to delete notification',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Delete('clear-all')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.DELETE_USER)
  @RateLimit(5, 60 * 1000) // 5 clear all per minute
  async clearAll(@Request() req: any): Promise<ApiResponse> {
    try {
      const result = await this.notificationsService.clearAll(req.user.id);
      return {
        success: true,
        data: result,
        message: 'All notifications cleared',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'CLEAR_ALL_ERROR',
          message: err.message || 'Failed to clear all notifications',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}