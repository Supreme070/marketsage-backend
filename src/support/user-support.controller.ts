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
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('support')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UserSupportController {
  private readonly logger = new Logger(UserSupportController.name);

  constructor(private readonly supportService: SupportService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getSupport(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const support = await this.supportService.getUserSupport(req.user.id);
      return {
        success: true,
        data: support,
        message: 'Support information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get support error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'SUPPORT_RETRIEVAL_FAILED',
          message: 'Failed to retrieve support information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post()
  @UseGuards(RateLimitGuard)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async createSupportTicket(
    @Body() ticketData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const ticket = await this.supportService.createUserSupportTicket(req.user.id, ticketData);
      return {
        success: true,
        data: ticket,
        message: 'Support ticket created successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Create support ticket error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'SUPPORT_TICKET_CREATION_FAILED',
          message: 'Failed to create support ticket',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
