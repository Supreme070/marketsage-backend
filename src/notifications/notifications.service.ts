import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(
    userId: string,
    limit: number = 50,
    includeRead: boolean = false,
    category?: string,
    type?: string,
  ) {
    try {
      const whereClause: any = {
        userId: userId,
      };

      if (!includeRead) {
        whereClause.read = false;
      }

      if (category) {
        whereClause.category = category;
      }

      if (type) {
        whereClause.type = type;
      }

      const notifications = await this.prisma.notification.findMany({
        where: whereClause,
        orderBy: {
          timestamp: 'desc',
        },
        take: Math.min(limit, 100), // Cap at 100 for performance
        select: {
          id: true,
          title: true,
          message: true,
          timestamp: true,
          read: true,
          type: true,
          category: true,
          link: true,
        },
      });

      this.logger.debug(`Retrieved ${notifications.length} notifications for user ${userId}`);
      return notifications;
    } catch (error) {
      this.logger.error(`Failed to fetch notifications for user ${userId}:`, error);
      throw error;
    }
  }

  async findOneForUser(id: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findFirst({
        where: {
          id: id,
          userId: userId,
        },
        select: {
          id: true,
          title: true,
          message: true,
          timestamp: true,
          read: true,
          type: true,
          category: true,
          link: true,
        },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      return notification;
    } catch (error) {
      this.logger.error(`Failed to fetch notification ${id} for user ${userId}:`, error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await this.prisma.notification.count({
        where: {
          userId: userId,
          read: false,
        },
      });

      this.logger.debug(`User ${userId} has ${count} unread notifications`);
      return count;
    } catch (error) {
      this.logger.error(`Failed to get unread count for user ${userId}:`, error);
      throw error;
    }
  }

  async create(createNotificationDto: CreateNotificationDto, userId: string) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          title: createNotificationDto.title,
          message: createNotificationDto.message,
          type: createNotificationDto.type || 'INFO',
          category: createNotificationDto.category || 'GENERAL',
          userId: userId,
          timestamp: new Date(),
          read: false,
          // Note: metadata field doesn't exist in current schema
        },
        select: {
          id: true,
          title: true,
          message: true,
          timestamp: true,
          read: true,
          type: true,
          category: true,
          link: true,
        },
      });

      this.logger.log(`Created notification ${notification.id} for user ${userId}`);
      return notification;
    } catch (error) {
      this.logger.error(`Failed to create notification for user ${userId}:`, error);
      throw error;
    }
  }

  async markAsRead(id: string, userId: string) {
    try {
      // First check if notification exists and belongs to user
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existingNotification) {
        throw new NotFoundException('Notification not found');
      }

      const notification = await this.prisma.notification.update({
        where: {
          id: id,
        },
        data: {
          read: true,
        },
        select: {
          id: true,
          title: true,
          message: true,
          timestamp: true,
          read: true,
          type: true,
          category: true,
          link: true,
        },
      });

      this.logger.debug(`Marked notification ${id} as read for user ${userId}`);
      return notification;
    } catch (error) {
      this.logger.error(`Failed to mark notification ${id} as read for user ${userId}:`, error);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          userId: userId,
          read: false,
        },
        data: {
          read: true,
        },
      });

      this.logger.log(`Marked ${result.count} notifications as read for user ${userId}`);
      return { updatedCount: result.count };
    } catch (error) {
      this.logger.error(`Failed to mark all notifications as read for user ${userId}:`, error);
      throw error;
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto, userId: string) {
    try {
      // First check if notification exists and belongs to user
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existingNotification) {
        throw new NotFoundException('Notification not found');
      }

      const notification = await this.prisma.notification.update({
        where: {
          id: id,
        },
        data: {
          ...updateNotificationDto,
        },
        select: {
          id: true,
          title: true,
          message: true,
          timestamp: true,
          read: true,
          type: true,
          category: true,
          link: true,
        },
      });

      this.logger.debug(`Updated notification ${id} for user ${userId}`);
      return notification;
    } catch (error) {
      this.logger.error(`Failed to update notification ${id} for user ${userId}:`, error);
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    try {
      // First check if notification exists and belongs to user
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existingNotification) {
        throw new NotFoundException('Notification not found');
      }

      await this.prisma.notification.delete({
        where: {
          id: id,
        },
      });

      this.logger.log(`Deleted notification ${id} for user ${userId}`);
      return { deleted: true, id: id };
    } catch (error) {
      this.logger.error(`Failed to delete notification ${id} for user ${userId}:`, error);
      throw error;
    }
  }

  async clearAll(userId: string) {
    try {
      const result = await this.prisma.notification.deleteMany({
        where: {
          userId: userId,
        },
      });

      this.logger.log(`Cleared ${result.count} notifications for user ${userId}`);
      return { deletedCount: result.count };
    } catch (error) {
      this.logger.error(`Failed to clear all notifications for user ${userId}:`, error);
      throw error;
    }
  }

  // Admin methods for system notifications
  async createSystemNotification(
    title: string,
    message: string,
    type: string = 'INFO',
    category: string = 'SYSTEM',
    metadata?: any,
  ) {
    try {
      // Get all users to send system notification
      const users = await this.prisma.user.findMany({
        select: { id: true },
      });

      const notifications = await Promise.all(
        users.map(user =>
          this.prisma.notification.create({
            data: {
              title,
              message,
              type,
              category,
              userId: user.id,
              timestamp: new Date(),
              read: false,
              // Note: metadata field doesn't exist in current schema
            },
          }),
        ),
      );

      this.logger.log(`Created system notification for ${notifications.length} users`);
      return { created: notifications.length };
    } catch (error) {
      this.logger.error('Failed to create system notification:', error);
      throw error;
    }
  }
}