import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // Get resource type from decorator
    const resourceType = this.reflector.getAllAndOverride<string>('resourceType', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!resourceType || !params.id) {
      return true; // No ownership check required
    }

    // Check resource ownership
    const hasAccess = await this.checkResourceOwnership(
      user.id,
      user.role,
      user.organizationId,
      resourceType,
      params.id
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied: You can only access your own resources');
    }

    return true;
  }

  private async checkResourceOwnership(
    userId: string,
    userRole: string,
    organizationId: string,
    resourceType: string,
    resourceId: string
  ): Promise<boolean> {
    try {
      // Super admin can access everything
      if (userRole === 'SUPER_ADMIN') {
        return true;
      }

      switch (resourceType) {
        case 'workflow':
          const workflow = await this.prisma.workflow.findUnique({
            where: { id: resourceId },
            select: { createdById: true }
          });
          
          if (!workflow) return false;
          
          // Regular users can only access their own workflows
          if (userRole === 'USER' && workflow.createdById !== userId) return false;
          
          return true;

        case 'contact':
          const contact = await this.prisma.contact.findUnique({
            where: { id: resourceId },
            select: { createdById: true, organizationId: true }
          });
          
          if (!contact) return false;
          
          if (contact.organizationId !== organizationId) return false;
          if (userRole === 'USER' && contact.createdById !== userId) return false;
          
          return true;

        case 'campaign':
          const campaign = await this.prisma.emailCampaign.findUnique({
            where: { id: resourceId },
            select: { createdById: true, organizationId: true }
          });
          
          if (!campaign) return false;
          
          if (campaign.organizationId !== organizationId) return false;
          if (userRole === 'USER' && campaign.createdById !== userId) return false;
          
          return true;

        case 'task':
          const task = await this.prisma.task.findUnique({
            where: { id: resourceId },
            select: { assigneeId: true, organizationId: true }
          });
          
          if (!task) return false;
          
          if (task.organizationId !== organizationId) return false;
          
          // Users can access tasks assigned to them
          if (userRole === 'USER' && task.assigneeId !== userId) {
            return false;
          }
          
          return true;

        case 'user':
          const user = await this.prisma.user.findUnique({
            where: { id: resourceId },
            select: { id: true, organizationId: true }
          });
          
          if (!user) return false;
          
          if (user.organizationId !== organizationId) return false;
          
          // Users can only access their own profile
          if (userRole === 'USER' && user.id !== userId) return false;
          
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error('Ownership check failed:', error);
      return false;
    }
  }
}
