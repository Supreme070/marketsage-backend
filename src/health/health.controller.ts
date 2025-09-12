import { Controller, Get, UseGuards } from '@nestjs/common';
import { 
  HealthCheckService, 
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
  ) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(100, 60 * 1000) // 100 requests per minute for health checks
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }

  @Get('simple')
  @UseGuards(RateLimitGuard)
  @RateLimit(200, 60 * 1000) // 200 requests per minute for simple health checks
  getSimpleHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'marketsage-backend',
      version: '1.0.0',
    };
  }
}