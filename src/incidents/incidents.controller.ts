import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('admin/incidents')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getIncidentsData(
    @Query('type') type: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      let data;
      
      switch (type) {
        case 'incidents':
          data = await this.incidentsService.getIncidents();
          break;
        case 'components':
          data = await this.incidentsService.getSystemComponents();
          break;
        case 'postmortems':
          data = await this.incidentsService.getPostMortems();
          break;
        case 'escalation':
          data = await this.incidentsService.getEscalationRules();
          break;
        case 'alerts':
          data = await this.incidentsService.getAlerts();
          break;
        case 'metrics':
          data = await this.incidentsService.getIncidentMetrics();
          break;
        default:
          return {
            success: false,
            error: {
              code: 'INVALID_TYPE',
              message: 'Invalid incidents data type specified',
              timestamp: new Date().toISOString(),
            },
          };
      }

      return {
        success: true,
        data,
        message: 'Incidents data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'INCIDENTS_DATA_ERROR',
          message: err.message || 'Failed to fetch incidents data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('incidents')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getIncidents(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const incidents = await this.incidentsService.getIncidents();
      
      return {
        success: true,
        data: incidents,
        message: 'Incidents retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'INCIDENTS_ERROR',
          message: err.message || 'Failed to fetch incidents',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('components')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getSystemComponents(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const components = await this.incidentsService.getSystemComponents();
      
      return {
        success: true,
        data: components,
        message: 'System components retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SYSTEM_COMPONENTS_ERROR',
          message: err.message || 'Failed to fetch system components',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('postmortems')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getPostMortems(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const postMortems = await this.incidentsService.getPostMortems();
      
      return {
        success: true,
        data: postMortems,
        message: 'Post-mortems retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'POST_MORTEMS_ERROR',
          message: err.message || 'Failed to fetch post-mortems',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('escalation')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getEscalationRules(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const escalationRules = await this.incidentsService.getEscalationRules();
      
      return {
        success: true,
        data: escalationRules,
        message: 'Escalation rules retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ESCALATION_RULES_ERROR',
          message: err.message || 'Failed to fetch escalation rules',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('alerts')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getAlerts(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const alerts = await this.incidentsService.getAlerts();
      
      return {
        success: true,
        data: alerts,
        message: 'Alerts retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ALERTS_ERROR',
          message: err.message || 'Failed to fetch alerts',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('metrics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getIncidentMetrics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const metrics = await this.incidentsService.getIncidentMetrics();
      
      return {
        success: true,
        data: metrics,
        message: 'Incident metrics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'INCIDENT_METRICS_ERROR',
          message: err.message || 'Failed to fetch incident metrics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('incidents')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 incidents per minute
  async createIncident(
    @Body() incidentData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.incidentsService.createIncident(incidentData);
      
      return {
        success: true,
        data: result,
        message: 'Incident created successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'INCIDENT_CREATION_ERROR',
          message: err.message || 'Failed to create incident',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('incidents/:id/status')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(20, 60 * 1000) // 20 updates per minute
  async updateIncidentStatus(
    @Param('id') incidentId: string,
    @Body() body: { status: string; notes?: string },
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const { status, notes } = body;
      
      if (!status) {
        return {
          success: false,
          error: {
            code: 'MISSING_STATUS',
            message: 'Status is required',
            timestamp: new Date().toISOString(),
          },
        };
      }

      const result = await this.incidentsService.updateIncidentStatus(incidentId, status, notes);
      
      return {
        success: true,
        data: result,
        message: 'Incident status updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'INCIDENT_UPDATE_ERROR',
          message: err.message || 'Failed to update incident status',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
