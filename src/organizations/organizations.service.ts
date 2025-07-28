import { Injectable, NotFoundException, ConflictException, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto, createdById: string) {
    try {
      // Check if organization with same name already exists
      const existingOrg = await this.prisma.organization.findFirst({
        where: { name: createOrganizationDto.name },
      });

      if (existingOrg) {
        throw new ConflictException('Organization with this name already exists');
      }

      // Create organization
      const organization = await this.prisma.organization.create({
        data: {
          name: createOrganizationDto.name,
          plan: createOrganizationDto.plan || 'FREE',
          websiteUrl: createOrganizationDto.website,
          address: createOrganizationDto.country, // Use address field for country
        },
        select: {
          id: true,
          name: true,
          plan: true,
          websiteUrl: true,
          address: true,
          logoUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              users: true,
              contacts: true,
              emailCampaigns: true,
            },
          },
        },
      });

      this.logger.log(`Organization created successfully: ${organization.id} (${organization.name})`);
      return organization;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create organization: ${err.message}`);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { address: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {};

      const [organizations, total] = await Promise.all([
        this.prisma.organization.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            plan: true,
            websiteUrl: true,
            address: true,
            logoUrl: true,
            billingEmail: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                users: true,
                contacts: true,
                emailCampaigns: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.organization.count({ where }),
      ]);

      return {
        organizations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find organizations: ${err.message}`);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          plan: true,
          websiteUrl: true,
          address: true,
          logoUrl: true,
          billingEmail: true,
          billingName: true,
          billingAddress: true,
          messagingModel: true,
          creditBalance: true,
          region: true,
          createdAt: true,
          updatedAt: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              users: true,
              contacts: true,
              emailCampaigns: true,
            },
          },
        },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      return organization;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find organization ${id}: ${err.message}`);
      throw error;
    }
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto, userId: string, userRole: string) {
    try {
      // Check if organization exists
      const existingOrg = await this.prisma.organization.findUnique({
        where: { id },
        select: { id: true, name: true },
      });

      if (!existingOrg) {
        throw new NotFoundException('Organization not found');
      }

      // Check permissions - only admins or super admins can update
      const canUpdate = userRole === 'SUPER_ADMIN' || userRole === 'IT_ADMIN' || userRole === 'ADMIN';

      if (!canUpdate) {
        throw new ForbiddenException('You do not have permission to update this organization');
      }

      // Check if name is being updated and doesn't conflict
      if (updateOrganizationDto.name && updateOrganizationDto.name !== existingOrg.name) {
        const nameExists = await this.prisma.organization.findFirst({
          where: { 
            name: updateOrganizationDto.name,
            id: { not: id },
          },
        });

        if (nameExists) {
          throw new ConflictException('Organization name already in use');
        }
      }

      // Map DTO fields to actual schema fields
      const updateData: any = {};
      if (updateOrganizationDto.name) updateData.name = updateOrganizationDto.name;
      if (updateOrganizationDto.plan) updateData.plan = updateOrganizationDto.plan;
      if (updateOrganizationDto.website) updateData.websiteUrl = updateOrganizationDto.website;
      if (updateOrganizationDto.country) updateData.address = updateOrganizationDto.country;

      const organization = await this.prisma.organization.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          plan: true,
          websiteUrl: true,
          address: true,
          logoUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              users: true,
              contacts: true,
              emailCampaigns: true,
            },
          },
        },
      });

      this.logger.log(`Organization updated successfully: ${organization.id} (${organization.name})`);
      return organization;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update organization ${id}: ${err.message}`);
      throw error;
    }
  }

  async remove(id: string, userId: string, userRole: string) {
    try {
      // Check if organization exists
      const existingOrg = await this.prisma.organization.findUnique({
        where: { id },
        select: { 
          id: true, 
          name: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      if (!existingOrg) {
        throw new NotFoundException('Organization not found');
      }

      // Check permissions - only super admins can delete organizations
      if (userRole !== 'SUPER_ADMIN') {
        throw new ForbiddenException('Only super administrators can delete organizations');
      }

      // Check if organization has users
      if (existingOrg._count.users > 0) {
        throw new ConflictException('Cannot delete organization with existing users. Please remove all users first.');
      }

      // Hard delete for now since the schema doesn't have isActive field
      await this.prisma.organization.delete({
        where: { id },
      });

      this.logger.log(`Organization deleted successfully: ${id} (${existingOrg.name})`);
      return { message: 'Organization deleted successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete organization ${id}: ${err.message}`);
      throw error;
    }
  }

  async getOrganizationStats(id: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          plan: true,
          createdAt: true,
          _count: {
            select: {
              users: true,
              contacts: true,
              emailCampaigns: true,
            },
          },
        },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      // Get additional stats
      const [recentUsers, recentCampaigns, recentContacts] = await Promise.all([
        this.prisma.user.findMany({
          where: { organizationId: id },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        }),
        this.prisma.emailCampaign.findMany({
          where: { 
            createdBy: {
              organizationId: id,
            },
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
        }),
        this.prisma.contact.findMany({
          where: { 
            createdBy: {
              organizationId: id,
            },
          },
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
      ]);

      return {
        organizationId: organization.id,
        organizationName: organization.name,
        plan: organization.plan,
        accountAge: Math.floor((Date.now() - organization.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        counts: organization._count,
        recentActivity: {
          users: recentUsers,
          campaigns: recentCampaigns,
          contacts: recentContacts,
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get organization stats for ${id}: ${err.message}`);
      throw error;
    }
  }

  async getOrganizationUsers(id: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where: { organizationId: id },
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where: { organizationId: id } }),
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
      this.logger.error(`Failed to get organization users for ${id}: ${err.message}`);
      throw error;
    }
  }
}