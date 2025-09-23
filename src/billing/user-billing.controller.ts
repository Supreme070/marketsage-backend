import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('billing')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UserBillingController {
  private readonly logger = new Logger(UserBillingController.name);

  constructor(private readonly billingService: BillingService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getBilling(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const billing = await this.billingService.getUserBilling(req.user.id);
      return {
        success: true,
        data: billing,
        message: 'Billing information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get billing error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'BILLING_RETRIEVAL_FAILED',
          message: 'Failed to retrieve billing information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post()
  @UseGuards(RateLimitGuard)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async updateBilling(
    @Body() billingData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const updatedBilling = await this.billingService.updateUserBilling(req.user.id, billingData);
      return {
        success: true,
        data: updatedBilling,
        message: 'Billing information updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Update billing error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'BILLING_UPDATE_FAILED',
          message: 'Failed to update billing information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
