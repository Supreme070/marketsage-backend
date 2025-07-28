import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.redisService.isHealthy();
      const connectionInfo = this.redisService.getConnectionInfo();
      
      if (isHealthy) {
        return this.getStatus(key, true, {
          status: 'connected',
          ...connectionInfo,
        });
      } else {
        throw new HealthCheckError(
          'Redis Health Check Failed',
          this.getStatus(key, false, {
            status: 'disconnected',
            ...connectionInfo,
          }),
        );
      }
    } catch (error) {
      const err = error as Error;
      throw new HealthCheckError(
        'Redis Health Check Failed',
        this.getStatus(key, false, {
          status: 'error',
          message: err.message,
        }),
      );
    }
  }
}