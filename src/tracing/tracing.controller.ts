import { Controller, Get, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SimpleTracingService } from './simple-tracing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../types/permissions';

@Controller('tracing')
@UseGuards(JwtAuthGuard)
export class TracingController {
  constructor(private readonly tracingService: SimpleTracingService) {}

  @Get('trace/:traceId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.VIEW_SYSTEM_LOGS)
  @HttpCode(HttpStatus.OK)
  getTrace(@Param('traceId') traceId: string) {
    return {
      success: true,
      data: this.tracingService.exportTraceData(traceId),
    };
  }

  @Get('span/:spanId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.VIEW_SYSTEM_LOGS)
  @HttpCode(HttpStatus.OK)
  getSpan(@Param('spanId') spanId: string) {
    const span = this.tracingService.getSpan(spanId);
    return {
      success: !!span,
      data: span || null,
    };
  }

  @Get('health')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.VIEW_SYSTEM_LOGS)
  @HttpCode(HttpStatus.OK)
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