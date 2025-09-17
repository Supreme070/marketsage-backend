import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('admin/support')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getSupportData(
    @Query('type') type: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      let data;
      
      switch (type) {
        case 'metrics':
          data = await this.supportService.getSupportMetrics();
          break;
        case 'tickets':
          data = await this.supportService.getSupportTickets();
          break;
        case 'chat_sessions':
          data = await this.supportService.getChatSessions();
          break;
        case 'staff':
          data = await this.supportService.getSupportStaff();
          break;
        case 'knowledge':
          data = await this.supportService.getKnowledgeArticles();
          break;
        default:
          return {
            success: false,
            error: {
              code: 'INVALID_TYPE',
              message: 'Invalid support data type specified',
              timestamp: new Date().toISOString(),
            },
          };
      }

      return {
        success: true,
        data,
        message: 'Support data retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SUPPORT_DATA_ERROR',
          message: err.message || 'Failed to fetch support data',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('tickets/:id/status')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 updates per minute
  async updateTicketStatus(
    @Param('id') ticketId: string,
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

      const result = await this.supportService.updateTicketStatus(ticketId, status, notes);
      
      return {
        success: true,
        data: result,
        message: 'Ticket status updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'TICKET_UPDATE_ERROR',
          message: err.message || 'Failed to update ticket status',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('tickets/:id/assign')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 assignments per minute
  async assignTicket(
    @Param('id') ticketId: string,
    @Body() body: { agentId: string },
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const { agentId } = body;
      
      if (!agentId) {
        return {
          success: false,
          error: {
            code: 'MISSING_AGENT_ID',
            message: 'Agent ID is required',
            timestamp: new Date().toISOString(),
          },
        };
      }

      const result = await this.supportService.assignTicket(ticketId, agentId);
      
      return {
        success: true,
        data: result,
        message: 'Ticket assigned successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'TICKET_ASSIGNMENT_ERROR',
          message: err.message || 'Failed to assign ticket',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('metrics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getSupportMetrics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const metrics = await this.supportService.getSupportMetrics();
      
      return {
        success: true,
        data: metrics,
        message: 'Support metrics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SUPPORT_METRICS_ERROR',
          message: err.message || 'Failed to fetch support metrics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('tickets')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getSupportTickets(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const tickets = await this.supportService.getSupportTickets();
      
      return {
        success: true,
        data: tickets,
        message: 'Support tickets retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SUPPORT_TICKETS_ERROR',
          message: err.message || 'Failed to fetch support tickets',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('chat-sessions')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getChatSessions(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const sessions = await this.supportService.getChatSessions();
      
      return {
        success: true,
        data: sessions,
        message: 'Chat sessions retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'CHAT_SESSIONS_ERROR',
          message: err.message || 'Failed to fetch chat sessions',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('staff')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getSupportStaff(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const staff = await this.supportService.getSupportStaff();
      
      return {
        success: true,
        data: staff,
        message: 'Support staff retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SUPPORT_STAFF_ERROR',
          message: err.message || 'Failed to fetch support staff',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('knowledge')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getKnowledgeArticles(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const articles = await this.supportService.getKnowledgeArticles();
      
      return {
        success: true,
        data: articles,
        message: 'Knowledge articles retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'KNOWLEDGE_ARTICLES_ERROR',
          message: err.message || 'Failed to fetch knowledge articles',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
