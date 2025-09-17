import { Controller, Get, Post, Body, Query, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('admin/billing')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('stats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getBillingStats(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const stats = await this.billingService.getBillingStats();
      
      return {
        success: true,
        data: stats,
        message: 'Billing stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'BILLING_STATS_ERROR',
          message: err.message || 'Failed to fetch billing stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('subscriptions/audit')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getSubscriptionAudits(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const audits = await this.billingService.getSubscriptionAudits();
      
      return {
        success: true,
        data: audits,
        message: 'Subscription audits retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SUBSCRIPTION_AUDIT_ERROR',
          message: err.message || 'Failed to fetch subscription audits',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('subscriptions/analytics')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getRevenueAnalytics(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const analytics = await this.billingService.getRevenueAnalytics();
      
      return {
        success: true,
        data: analytics,
        message: 'Revenue analytics retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'REVENUE_ANALYTICS_ERROR',
          message: err.message || 'Failed to fetch revenue analytics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('subscriptions/verify')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getSubscriptionIssues(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const issues = await this.billingService.getSubscriptionIssues();
      
      return {
        success: true,
        data: issues,
        message: 'Subscription issues retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SUBSCRIPTION_ISSUES_ERROR',
          message: err.message || 'Failed to fetch subscription issues',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('subscriptions/verify')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(20, 60 * 1000) // 20 verifications per minute
  async verifySubscription(
    @Body() body: { subscriptionId: string; action: string; reason: string },
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const { subscriptionId, action, reason } = body;
      
      if (!subscriptionId || !action || !reason) {
        return {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Subscription ID, action, and reason are required',
            timestamp: new Date().toISOString(),
          },
        };
      }

      const result = await this.billingService.verifySubscription(subscriptionId, action, reason);
      
      return {
        success: true,
        data: result,
        message: 'Subscription verification completed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'SUBSCRIPTION_VERIFICATION_ERROR',
          message: err.message || 'Failed to verify subscription',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('invoices')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getInvoices(
    @Query('status') status: string,
    @Query('organizationId') organizationId: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const filters = { status, organizationId };
      const invoices = await this.billingService.getInvoices(filters);
      
      return {
        success: true,
        data: invoices,
        message: 'Invoices retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'INVOICES_ERROR',
          message: err.message || 'Failed to fetch invoices',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('payments')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getPayments(
    @Query('status') status: string,
    @Query('organizationId') organizationId: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const filters = { status, organizationId };
      const payments = await this.billingService.getPayments(filters);
      
      return {
        success: true,
        data: payments,
        message: 'Payments retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'PAYMENTS_ERROR',
          message: err.message || 'Failed to fetch payments',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
