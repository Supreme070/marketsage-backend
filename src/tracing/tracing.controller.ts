import { Controller, Get, Param, Query } from '@nestjs/common';
import { SimpleTracingService } from './simple-tracing.service';

@Controller('tracing')
export class TracingController {
  constructor(private readonly tracingService: SimpleTracingService) {}

  @Get('trace/:traceId')
  getTrace(@Param('traceId') traceId: string) {
    return {
      success: true,
      data: this.tracingService.exportTraceData(traceId),
    };
  }

  @Get('span/:spanId')
  getSpan(@Param('spanId') spanId: string) {
    const span = this.tracingService.getSpan(spanId);
    return {
      success: !!span,
      data: span || null,
    };
  }

  @Get('health')
  getTracingHealth() {
    return {
      success: true,
      data: {
        service: 'SimpleTracingService',
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
    };
  }
}