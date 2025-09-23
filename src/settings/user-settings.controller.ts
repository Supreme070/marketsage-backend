import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('settings')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UserSettingsController {
  private readonly logger = new Logger(UserSettingsController.name);

  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getSettings(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const settings = await this.settingsService.getUserSettings(req.user.id);
      return {
        success: true,
        data: settings,
        message: 'User settings retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get settings error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'SETTINGS_RETRIEVAL_FAILED',
          message: 'Failed to retrieve user settings',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Put()
  @UseGuards(RateLimitGuard)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async updateSettings(
    @Body() settingsData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const updatedSettings = await this.settingsService.updateUserSettings(req.user.id, settingsData);
      return {
        success: true,
        data: updatedSettings,
        message: 'User settings updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Update settings error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'SETTINGS_UPDATE_FAILED',
          message: 'Failed to update user settings',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
