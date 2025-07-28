import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SimpleTracingService } from './simple-tracing.service';

@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
  constructor(private readonly tracingService: SimpleTracingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Get or create correlation ID
    let correlationId = request.headers['x-correlation-id'] || 
                       request.headers['x-request-id'] ||
                       uuidv4();

    // Store correlation ID in request for access in controllers
    request.correlationId = correlationId;

    // Create a span for this request
    const operationName = `${request.method} ${request.route?.path || request.url}`;
    const spanId = this.tracingService.createSpan(operationName, correlationId);

    // Add request tags
    this.tracingService.addTag(spanId, 'http.method', request.method);
    this.tracingService.addTag(spanId, 'http.url', request.url);
    this.tracingService.addTag(spanId, 'http.user_agent', request.headers['user-agent']);
    this.tracingService.addTag(spanId, 'correlation_id', correlationId);

    // Store span ID in request
    request.spanId = spanId;

    // Add to response headers for debugging
    response.setHeader('x-correlation-id', correlationId);
    response.setHeader('x-span-id', spanId);

    return next.handle().pipe(
      tap((responseData) => {
        // Log successful completion
        this.tracingService.addTag(spanId, 'http.status_code', response.statusCode);
        this.tracingService.addLog(spanId, `Request completed successfully`);
        this.tracingService.finishSpan(spanId, 'success');
        
        console.log(`✅ Request completed [${correlationId}]: ${request.method} ${request.url} - ${response.statusCode}`);
      }),
      catchError((error) => {
        // Log error completion
        this.tracingService.addTag(spanId, 'http.status_code', response.statusCode || 500);
        this.tracingService.addTag(spanId, 'error', true);
        this.tracingService.addTag(spanId, 'error.message', error.message);
        this.tracingService.addLog(spanId, `Request failed: ${error.message}`, 'error');
        this.tracingService.finishSpan(spanId, 'error');
        
        console.log(`❌ Request failed [${correlationId}]: ${request.method} ${request.url} - ${error.message}`);
        throw error;
      })
    );
  }
}