import { Module, Global } from '@nestjs/common';
import { SimpleTracingService } from './simple-tracing.service';
import { CorrelationInterceptor } from './correlation.interceptor';
import { TracingController } from './tracing.controller';

@Global()
@Module({
  controllers: [TracingController],
  providers: [SimpleTracingService, CorrelationInterceptor],
  exports: [SimpleTracingService, CorrelationInterceptor],
})
export class TracingModule {}