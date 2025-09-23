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
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { ApiResponse } from '../types';

@Controller('messages')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UserMessagesController {
  private readonly logger = new Logger(UserMessagesController.name);

  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const messages = await this.messagesService.getUserMessages(req.user.id);
      return {
        success: true,
        data: messages,
        message: 'Messages retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Get messages error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'MESSAGES_RETRIEVAL_FAILED',
          message: 'Failed to retrieve messages',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post()
  @UseGuards(RateLimitGuard)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Body() messageData: any,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const message = await this.messagesService.sendUserMessage(req.user.id, messageData);
      return {
        success: true,
        data: message,
        message: 'Message sent successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Send message error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'MESSAGE_SEND_FAILED',
          message: 'Failed to send message',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
