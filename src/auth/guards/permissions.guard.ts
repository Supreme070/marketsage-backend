import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Permission } from '../../types/permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No specific permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // Check if user has all required permissions
    const userPermissions = this.getUserPermissions(user.role);
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(`Insufficient permissions. Required: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }

  private getUserPermissions(role: string): Permission[] {
    const rolePermissions: Record<string, Permission[]> = {
      USER: [
        Permission.VIEW_USER, Permission.UPDATE_USER, Permission.CREATE_CONTACT, Permission.UPDATE_CONTACT, Permission.VIEW_CONTACT,
        Permission.CREATE_CAMPAIGN, Permission.UPDATE_CAMPAIGN, Permission.VIEW_CAMPAIGN, Permission.SEND_CAMPAIGN,
        Permission.CREATE_TASK, Permission.UPDATE_TASK, Permission.VIEW_TASK, Permission.CREATE_WORKFLOW, Permission.UPDATE_WORKFLOW,
        Permission.VIEW_WORKFLOW, Permission.EXECUTE_WORKFLOW, Permission.USE_AI_FEATURES, Permission.VIEW_ANALYTICS
      ],
      ADMIN: [
        Permission.DELETE_CONTACT, Permission.BULK_CONTACT_OPERATIONS, Permission.EXPORT_CONTACTS, Permission.DELETE_CAMPAIGN,
        Permission.DELETE_TASK, Permission.ASSIGN_TASK, Permission.DELETE_WORKFLOW, Permission.EXECUTE_AI_TASKS,
        Permission.DELETE_DATA, Permission.MANAGE_INTEGRATIONS, Permission.MANAGE_BILLING, Permission.UPDATE_ORGANIZATION,
        Permission.VIEW_ORGANIZATION, Permission.MANAGE_ORGANIZATION_SETTINGS
      ],
      IT_ADMIN: [
        Permission.CREATE_USER, Permission.UPDATE_USER, Permission.DELETE_USER, Permission.VIEW_SYSTEM_LOGS,
        Permission.MANAGE_SYSTEM_SETTINGS, Permission.MANAGE_SECURITY_SETTINGS, Permission.VIEW_SECURITY_LOGS,
        Permission.MANAGE_API_KEYS, Permission.CONFIGURE_AI_SETTINGS, Permission.APPROVE_AI_OPERATIONS
      ],
      SUPER_ADMIN: Object.values(Permission),
      AI_AGENT: [
        Permission.VIEW_USER, Permission.CREATE_CONTACT, Permission.UPDATE_CONTACT, Permission.VIEW_CONTACT,
        Permission.BULK_CONTACT_OPERATIONS, Permission.CREATE_CAMPAIGN, Permission.UPDATE_CAMPAIGN,
        Permission.VIEW_CAMPAIGN, Permission.SEND_CAMPAIGN, Permission.SCHEDULE_CAMPAIGN, Permission.CREATE_TASK,
        Permission.UPDATE_TASK, Permission.VIEW_TASK, Permission.ASSIGN_TASK, Permission.CREATE_WORKFLOW,
        Permission.UPDATE_WORKFLOW, Permission.VIEW_WORKFLOW, Permission.EXECUTE_WORKFLOW, Permission.USE_AI_FEATURES,
        Permission.EXECUTE_AI_TASKS, Permission.VIEW_ANALYTICS, Permission.EXPORT_DATA, Permission.IMPORT_DATA
      ]
    };

    return rolePermissions[role] || [];
  }
}
