import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaService, PrismaHealthIndicator, RedisHealthIndicator, RedisService],
})
export class HealthModule {}