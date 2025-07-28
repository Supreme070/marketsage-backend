import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheckService, 
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }

  @Get('simple')
  getSimpleHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'marketsage-backend',
      version: '1.0.0',
    };
  }
}