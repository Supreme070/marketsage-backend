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

  /**
   * Get admin system statistics
   */
  async getAdminSystemStats() {
    try {
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();
      const cpuUsage = await this.getCpuUsage();
      
      return {
        systemResources: {
          cpu: cpuUsage,
          memory: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
          disk: await this.getDiskUsage(),
          network: await this.getNetworkUsage(),
        },
        uptime: {
          seconds: uptime,
          formatted: this.formatUptime(uptime),
        },
        performance: {
          responseTime: await this.getAverageResponseTime(),
          throughput: await this.getThroughput(),
          errorRate: await this.getErrorRate(),
        },
        alerts: await this.getSystemAlerts(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin system stats: ${err.message}`);
      throw error;
    }
  }

  /**
   * Get admin system services
   */
  async getAdminSystemServices() {
    try {
      // Mock service data - in a real implementation, this would query actual service health
      const services = [
        {
          name: 'Database',
          status: 'operational',
          uptime: '99.9%',
          responseTime: '12ms',
          lastCheck: new Date().toISOString(),
          endpoint: 'postgresql://localhost:5432',
          version: 'PostgreSQL 15.2',
          dependencies: ['Redis', 'Prisma'],
          issues: [],
        },
        {
          name: 'Redis Cache',
          status: 'degraded',
          uptime: '98.5%',
          responseTime: '5ms',
          lastCheck: new Date().toISOString(),
          endpoint: 'redis://localhost:6379',
          version: 'Redis 7.0',
          dependencies: [],
          issues: ['High memory usage detected'],
        },
        {
          name: 'Email Service',
          status: 'operational',
          uptime: '99.8%',
          responseTime: '250ms',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://api.sendgrid.com',
          version: 'SendGrid v3',
          dependencies: ['Database'],
          issues: [],
        },
        {
          name: 'SMS Service',
          status: 'operational',
          uptime: '99.7%',
          responseTime: '180ms',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://api.twilio.com',
          version: 'Twilio API v1',
          dependencies: ['Database'],
          issues: [],
        },
        {
          name: 'WhatsApp Service',
          status: 'maintenance',
          uptime: '95.2%',
          responseTime: 'N/A',
          lastCheck: new Date().toISOString(),
          endpoint: 'https://api.whatsapp.com',
          version: 'WhatsApp Business API v2',
          dependencies: ['Database'],
          issues: ['Scheduled maintenance window'],
        },
      ];

      return services;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin system services: ${err.message}`);
      throw error;
    }
  }

  /**
   * Get admin system infrastructure
   */
  async getAdminSystemInfrastructure() {
    try {
      const infrastructure = [
        {
          category: 'Compute',
          metrics: [
            {
              name: 'CPU Cores',
              current: 8,
              max: 16,
              unit: 'cores',
              status: 'healthy',
            },
            {
              name: 'CPU Usage',
              current: 45,
              max: 100,
              unit: '%',
              status: 'healthy',
            },
            {
              name: 'Memory',
              current: 8192,
              max: 16384,
              unit: 'MB',
              status: 'healthy',
            },
            {
              name: 'Memory Usage',
              current: 65,
              max: 100,
              unit: '%',
              status: 'warning',
            },
          ],
        },
        {
          category: 'Storage',
          metrics: [
            {
              name: 'Disk Space',
              current: 500,
              max: 1000,
              unit: 'GB',
              status: 'healthy',
            },
            {
              name: 'Disk Usage',
              current: 50,
              max: 100,
              unit: '%',
              status: 'healthy',
            },
            {
              name: 'Database Size',
              current: 25,
              max: 100,
              unit: 'GB',
              status: 'healthy',
            },
            {
              name: 'Log Storage',
              current: 8,
              max: 50,
              unit: 'GB',
              status: 'healthy',
            },
          ],
        },
        {
          category: 'Network',
          metrics: [
            {
              name: 'Bandwidth',
              current: 100,
              max: 1000,
              unit: 'Mbps',
              status: 'healthy',
            },
            {
              name: 'Active Connections',
              current: 150,
              max: 500,
              unit: 'connections',
              status: 'healthy',
            },
            {
              name: 'Request Rate',
              current: 1200,
              max: 5000,
              unit: 'req/min',
              status: 'healthy',
            },
            {
              name: 'Error Rate',
              current: 2,
              max: 100,
              unit: '%',
              status: 'healthy',
            },
          ],
        },
      ];

      return infrastructure;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get admin system infrastructure: ${err.message}`);
      throw error;
    }
  }

  /**
   * Get CPU usage percentage
   */
  private async getCpuUsage(): Promise<number> {
    // Mock CPU usage - in a real implementation, this would use actual system metrics
    return Math.floor(Math.random() * 30) + 20; // 20-50%
  }

  /**
   * Get disk usage percentage
   */
  private async getDiskUsage(): Promise<number> {
    // Mock disk usage - in a real implementation, this would use actual system metrics
    return Math.floor(Math.random() * 20) + 30; // 30-50%
  }

  /**
   * Get network usage
   */
  private async getNetworkUsage(): Promise<number> {
    // Mock network usage - in a real implementation, this would use actual system metrics
    return Math.floor(Math.random() * 50) + 25; // 25-75 Mbps
  }

  /**
   * Get average response time
   */
  private async getAverageResponseTime(): Promise<number> {
    // Mock response time - in a real implementation, this would calculate from actual metrics
    return Math.floor(Math.random() * 50) + 100; // 100-150ms
  }

  /**
   * Get throughput
   */
  private async getThroughput(): Promise<number> {
    // Mock throughput - in a real implementation, this would calculate from actual metrics
    return Math.floor(Math.random() * 200) + 800; // 800-1000 req/min
  }

  /**
   * Get error rate
   */
  private async getErrorRate(): Promise<number> {
    // Mock error rate - in a real implementation, this would calculate from actual metrics
    return Math.floor(Math.random() * 2) + 1; // 1-3%
  }

  /**
   * Get system alerts
   */
  private async getSystemAlerts() {
    // Mock system alerts - in a real implementation, this would query actual alerting system
    return [
      {
        id: 'alert_1',
        type: 'warning',
        title: 'High Memory Usage',
        description: 'Redis cache memory 89% utilized',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        resolved: false,
      },
      {
        id: 'alert_2',
        type: 'info',
        title: 'Scheduled Maintenance',
        description: 'WhatsApp API maintenance window active',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        resolved: false,
      },
    ];
  }

  /**
   * Format uptime in human readable format
   */
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}