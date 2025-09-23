import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('audit')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UserAuditController {
  private readonly logger = new Logger(UserAuditController.name);

  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getAudit(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const audit = await this.auditService.getUserAudit(req.user.id);
      return {
        success: true,
        data: audit,
        message: 'Audit information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get audit error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'AUDIT_RETRIEVAL_FAILED',
          message: 'Failed to retrieve audit information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
