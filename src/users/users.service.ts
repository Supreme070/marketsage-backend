import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserRole } from '../types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly saltRounds = 12;

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);

      // Create organization if provided
      let organization = null;
      if (createUserDto.organizationName) {
        organization = await this.prisma.organization.create({
          data: {
            name: createUserDto.organizationName,
            plan: 'FREE',
          },
        });
      }

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
          role: createUserDto.role || UserRole.USER,
          organizationId: createUserDto.organizationId || organization?.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organizationId: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          organization: {
            select: {
              id: true,
              name: true,
              plan: true,
            },
          },
        },
      });

      this.logger.log(`User created successfully: ${user.id} (${user.email})`);
      return user;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create user: ${err.message}`);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, role?: string, status?: string) {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = {};
      
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ];
      }
      
      if (role && role !== 'all') {
        where.role = role;
      }
      
      if (status && status !== 'all') {
        switch (status) {
          case 'active':
            where.emailVerified = { not: null };
            where.isSuspended = false;
            break;
          case 'pending_verification':
            where.emailVerified = null;
            where.isSuspended = false;
            break;
          case 'suspended':
            where.isSuspended = true;
            break;
        }
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            organizationId: true,
            emailVerified: true,
            image: true,
            isSuspended: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
            organization: {
              select: {
                id: true,
                name: true,
                plan: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find users: ${err.message}`);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organizationId: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          organization: {
            select: {
              id: true,
              name: true,
              plan: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              contacts: true,
              emailCampaigns: true,
              workflows: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find user ${id}: ${err.message}`);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organizationId: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          organization: {
            select: {
              id: true,
              name: true,
              plan: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find user by email ${email}: ${err.message}`);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Check if email is being updated and doesn't conflict
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: updateUserDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Email already in use');
        }
      }

      // Hash password if provided
      const updateData: any = { ...updateUserDto };
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organizationId: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          organization: {
            select: {
              id: true,
              name: true,
              plan: true,
            },
          },
        },
      });

      this.logger.log(`User updated successfully: ${user.id} (${user.email})`);
      return user;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update user ${id}: ${err.message}`);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Soft delete approach - we might want to keep user data for audit purposes
      // For now, we'll do a hard delete but this should be reconsidered for production
      await this.prisma.user.delete({
        where: { id },
      });

      this.logger.log(`User deleted successfully: ${id} (${existingUser.email})`);
      return { message: 'User deleted successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete user ${id}: ${err.message}`);
      throw error;
    }
  }

  async getUserStats(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          createdAt: true,
          _count: {
            select: {
              contacts: true,
              emailCampaigns: true,
              workflows: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get additional stats
      const [recentContacts, recentCampaigns] = await Promise.all([
        this.prisma.contact.findMany({
          where: { createdById: id },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        }),
        this.prisma.emailCampaign.findMany({
          where: { createdById: id },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

      return {
        userId: user.id,
        accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        counts: user._count,
        recentActivity: {
          contacts: recentContacts,
          campaigns: recentCampaigns,
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get user stats for ${id}: ${err.message}`);
      throw error;
    }
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, password: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.password) {
        throw new ConflictException('User has no password set (OAuth user)');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new ConflictException('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, this.saltRounds);

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
      });

      this.logger.log(`Password changed successfully for user: ${id}`);
      return { message: 'Password changed successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to change password for user ${id}: ${err.message}`);
      throw error;
    }
  }

  async getAdminStats() {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [total, active, suspended, pending] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: {
            emailVerified: { not: null },
            isSuspended: false,
            lastLoginAt: {
              gte: thirtyDaysAgo,
            },
          },
        }),
        this.prisma.user.count({
          where: {
            isSuspended: true,
          },
        }),
        this.prisma.user.count({
          where: {
            emailVerified: null,
            isSuspended: false,
          },
        }),
      ]);

      return {
        total,
        active,
        suspended,
        pending,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin stats: ${err.message}`);
      throw error;
    }
  }

  async suspendUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isSuspended) {
        throw new ConflictException('User is already suspended');
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { isSuspended: true },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isSuspended: true,
          updatedAt: true,
        },
      });

      this.logger.log(`User suspended: ${id} (${user.email})`);
      return updatedUser;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to suspend user ${id}: ${err.message}`);
      throw error;
    }
  }

  async activateUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isSuspended) {
        throw new ConflictException('User is not suspended');
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { isSuspended: false },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isSuspended: true,
          updatedAt: true,
        },
      });

      this.logger.log(`User activated: ${id} (${user.email})`);
      return updatedUser;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to activate user ${id}: ${err.message}`);
      throw error;
    }
  }
}