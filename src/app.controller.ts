import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitGuard } from './auth/guards/rate-limit.guard';
import { RateLimit } from './auth/decorators/rate-limit.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(1000, 60 * 1000) // 1000 requests per minute for root endpoint
  getHello(): string {
    return this.appService.getHello();
  }
}
