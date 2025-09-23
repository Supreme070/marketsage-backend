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
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('security')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UserSecurityController {
  private readonly logger = new Logger(UserSecurityController.name);

  constructor(private readonly securityService: SecurityService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getSecurity(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const security = await this.securityService.getUserSecurity(req.user.id);
      return {
        success: true,
        data: security,
        message: 'Security information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get security error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'SECURITY_RETRIEVAL_FAILED',
          message: 'Failed to retrieve security information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
