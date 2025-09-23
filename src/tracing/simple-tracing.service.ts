import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, any>;
  logs: Array<{ timestamp: number; message: string; level: string }>;
  status: 'success' | 'error' | 'pending';
}

@Injectable()
export class SimpleTracingService {
  private readonly logger = new Logger(SimpleTracingService.name);
  private spans = new Map<string, TraceSpan>();
  private activeSpans = new Map<string, string>(); // correlationId -> spanId

  createSpan(
    operationName: string,
    correlationId?: string,
    parentSpanId?: string,
  ): string {
    const spanId = uuidv4();
    const traceId = correlationId || uuidv4();
    
    const span: TraceSpan = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: Date.now(),
      tags: {},
      logs: [],
      status: 'pending',
    };

    this.spans.set(spanId, span);
    
    if (correlationId) {
      this.activeSpans.set(correlationId, spanId);
    }

    this.logger.debug(`Created span [${spanId}] for operation: ${operationName}`);
    return spanId;
  }

  finishSpan(spanId: string, status: 'success' | 'error' = 'success'): void {
    const span = this.spans.get(spanId);
    if (!span) {
      this.logger.warn(`Span ${spanId} not found`);
      return;
    }

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
    span.status = status;

    this.logger.log(
      `Span completed [${spanId}] ${span.operationName}: ${span.duration}ms - ${status}`
    );
  }

  addTag(spanId: string, key: string, value: any): void {
    const span = this.spans.get(spanId);
    if (span) {
      span.tags[key] = value;
    }
  }

  addLog(
    spanId: string,
    message: string,
    level: 'info' | 'warn' | 'error' = 'info'
  ): void {
    const span = this.spans.get(spanId);
    if (span) {
      span.logs.push({
        timestamp: Date.now(),
        message,
        level,
      });
    }
  }

  getSpan(spanId: string): TraceSpan | undefined {
    return this.spans.get(spanId);
  }

  getActiveSpan(correlationId: string): TraceSpan | undefined {
    const spanId = this.activeSpans.get(correlationId);
    return spanId ? this.spans.get(spanId) : undefined;
  }

  // Get all spans for a trace
  getTrace(traceId: string): TraceSpan[] {
    return Array.from(this.spans.values()).filter(
      span => span.traceId === traceId
    );
  }

  // Cleanup old spans (keep only last 1000)
  cleanup(): void {
    if (this.spans.size > 1000) {
      const sortedSpans = Array.from(this.spans.entries())
        .sort(([, a], [, b]) => (b.startTime || 0) - (a.startTime || 0));
      
      // Keep only the 1000 most recent spans
      const toKeep = sortedSpans.slice(0, 1000);
      this.spans.clear();
      
      toKeep.forEach(([spanId, span]) => {
        this.spans.set(spanId, span);
      });

      this.logger.debug(`Cleaned up old spans, keeping ${toKeep.length}`);
    }
  }

  // Export trace data for monitoring
  exportTraceData(traceId: string): any {
    const spans = this.getTrace(traceId);
    return {
      traceId,
      spans: spans.map(span => ({
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        operationName: span.operationName,
        startTime: span.startTime,
        endTime: span.endTime,
        duration: span.duration,
        status: span.status,
        tags: span.tags,
        logs: span.logs,
      })),
      totalDuration: spans.reduce((total, span) => total + (span.duration || 0), 0),
      spanCount: spans.length,
    };
  }

  getAllTraces() {
    try {
      // Return mock tracing data
      return {
        totalTraces: 5,
        activeTraces: 2,
        completedTraces: 3,
        traces: [
          {
            traceId: 'trace-1',
            operationName: 'API Request',
            status: 'success',
            duration: 150,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
          },
          {
            traceId: 'trace-2',
            operationName: 'Database Query',
            status: 'success',
            duration: 45,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting all traces: ${err.message}`);
      throw error;
    }
  }
}