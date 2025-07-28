import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Simple database ping
      await this.prisma.$queryRaw`SELECT 1`;
      
      return this.getStatus(key, true, {
        message: 'Database connection is healthy',
      });
    } catch (error) {
      const result = this.getStatus(key, false, {
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw new HealthCheckError('Database check failed', result);
    }
  }
}