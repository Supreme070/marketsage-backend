import { Injectable, Logger } from '@nestjs/common';
import { collectDefaultMetrics, register, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  // HTTP Request Metrics
  private readonly httpRequestCounter = new Counter({
    name: 'nestjs_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  private readonly httpRequestDuration = new Histogram({
    name: 'nestjs_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  });

  // Authentication Metrics
  private readonly authAttemptsCounter = new Counter({
    name: 'nestjs_auth_attempts_total',
    help: 'Total authentication attempts',
    labelNames: ['type', 'status'],
  });

  private readonly authDuration = new Histogram({
    name: 'nestjs_auth_duration_seconds',
    help: 'Duration of authentication operations in seconds',
    labelNames: ['type'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  });

  // Database Metrics
  private readonly dbConnectionsGauge = new Gauge({
    name: 'nestjs_db_connections_active',
    help: 'Number of active database connections',
  });

  private readonly dbQueryDuration = new Histogram({
    name: 'nestjs_db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  });

  // Business Metrics
  private readonly usersCreatedCounter = new Counter({
    name: 'nestjs_users_created_total',
    help: 'Total number of users created',
  });

  private readonly activeUsersGauge = new Gauge({
    name: 'nestjs_active_users',
    help: 'Number of currently active users',
  });

  // JWT Token Metrics
  private readonly jwtTokensIssued = new Counter({
    name: 'nestjs_jwt_tokens_issued_total',
    help: 'Total JWT tokens issued',
  });

  private readonly jwtTokensValidated = new Counter({
    name: 'nestjs_jwt_tokens_validated_total',
    help: 'Total JWT tokens validated',
    labelNames: ['status'],
  });

  // Error Metrics
  private readonly errorsCounter = new Counter({
    name: 'nestjs_errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'code'],
  });

  constructor() {
    // Collect default Node.js metrics
    collectDefaultMetrics({ prefix: 'nestjs_' });
    
    this.logger.log('Prometheus metrics initialized successfully');
  }

  /**
   * Get all metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  /**
   * Record HTTP request metrics
   */
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    const labels = { method, route, status_code: statusCode.toString() };
    this.httpRequestCounter.inc(labels);
    this.httpRequestDuration.observe(labels, duration);
  }

  /**
   * Record authentication attempt
   */
  recordAuthAttempt(type: 'login' | 'register' | 'verify', status: 'success' | 'failed', duration?: number) {
    this.authAttemptsCounter.inc({ type, status });
    
    if (duration !== undefined) {
      this.authDuration.observe({ type }, duration);
    }
  }

  /**
   * Record user creation
   */
  recordUserCreated() {
    this.usersCreatedCounter.inc();
  }

  /**
   * Update active users count
   */
  updateActiveUsers(count: number) {
    this.activeUsersGauge.set(count);
  }

  /**
   * Record JWT token issued
   */
  recordJwtTokenIssued() {
    this.jwtTokensIssued.inc();
  }

  /**
   * Record JWT token validation
   */
  recordJwtTokenValidated(status: 'valid' | 'invalid' | 'expired') {
    this.jwtTokensValidated.inc({ status });
  }

  /**
   * Record database connection count
   */
  updateDbConnections(count: number) {
    this.dbConnectionsGauge.set(count);
  }

  /**
   * Record database query duration
   */
  recordDbQuery(operation: string, duration: number) {
    this.dbQueryDuration.observe({ operation }, duration);
  }

  /**
   * Record error
   */
  recordError(type: string, code: string) {
    this.errorsCounter.inc({ type, code });
  }

  /**
   * Get health metrics summary
   */
  async getHealthMetrics() {
    const metrics = await register.getSingleMetricAsString('nestjs_http_requests_total');
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return {
      uptime,
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      },
      httpRequests: metrics || 'No data available',
    };
  }

  /**
   * Reset all metrics (useful for testing)
   */
  reset() {
    register.clear();
    this.logger.warn('All Prometheus metrics have been reset');
  }
}