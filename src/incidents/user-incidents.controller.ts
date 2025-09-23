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
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('incidents')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UserIncidentsController {
  private readonly logger = new Logger(UserIncidentsController.name);

  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getIncidents(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const incidents = await this.incidentsService.getUserIncidents(req.user.id);
      return {
        success: true,
        data: incidents,
        message: 'Incidents information retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get incidents error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'INCIDENTS_RETRIEVAL_FAILED',
          message: 'Failed to retrieve incidents information',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
