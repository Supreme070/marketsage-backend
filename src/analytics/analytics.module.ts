import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ReportingService } from './reporting.service';
import { PerformanceAnalyticsService } from './performance-analytics.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [PrismaModule, QueueModule, MetricsModule],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    ReportingService,
    PerformanceAnalyticsService,
  ],
  exports: [
    AnalyticsService,
    ReportingService,
    PerformanceAnalyticsService,
  ],
})
export class AnalyticsModule {}
