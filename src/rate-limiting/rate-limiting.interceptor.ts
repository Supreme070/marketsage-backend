import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { RateLimitingService } from './rate-limiting.service';
import { rateLimitConfigs, createRoleBasedRateLimitConfig } from './rate-limiting.config';

@Injectable()
export class RateLimitingInterceptor implements NestInterceptor {
  constructor(
    private readonly rateLimitingService: RateLimitingService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    // Get rate limit metadata from decorator
    const rateLimitKey = this.reflector.get<string>('rateLimitKey', context.getHandler());
    const customLimit = this.reflector.get<number>('rateLimit', context.getHandler());
    const customWindow = this.reflector.get<number>('rateLimitWindow', context.getHandler());
    
    // Skip rate limiting if no rate limit key is specified
    if (!rateLimitKey && !customLimit) {
      return next.handle();
    }

    // Get client identifier
    const identifier = this.getClientIdentifier(request);
    const endpoint = request.path || request.url || 'unknown';
    
    let config;
    
    if (rateLimitKey && rateLimitConfigs[rateLimitKey]) {
      // Use predefined config
      config = rateLimitConfigs[rateLimitKey];
    } else if (customLimit && customWindow) {
      // Use custom config from decorator
      config = {
        windowMs: customWindow,
        maxRequests: customLimit,
        onLimitReached: (id: string, ep: string) => {
          console.warn('Rate limit exceeded', { identifier: id, endpoint: ep });
        }
      };
    } else {
      // Use default API rate limit
      config = rateLimitConfigs.api;
    }

    // Check rate limit
    const result = await this.rateLimitingService.check(identifier, endpoint, config);

    // Add rate limit headers
    response.setHeader('X-RateLimit-Limit', result.limit.toString());
    response.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    response.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

    if (!result.allowed) {
      if (result.retryAfter) {
        response.setHeader('Retry-After', result.retryAfter.toString());
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          error: 'Too Many Requests',
          retryAfter: result.retryAfter,
          limit: result.limit,
          remaining: result.remaining,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }

  private getClientIdentifier(request: Request): string {
    // Extract IP from various headers
    const forwarded = request.headers['x-forwarded-for'];
    const realIp = request.headers['x-real-ip'];
    const cfConnectingIP = request.headers['cf-connecting-ip'];
    
    let ip = 'unknown';
    
    if (forwarded && typeof forwarded === 'string') {
      ip = forwarded.split(',')[0].trim();
    } else if (realIp && typeof realIp === 'string') {
      ip = realIp;
    } else if (cfConnectingIP && typeof cfConnectingIP === 'string') {
      ip = cfConnectingIP;
    } else if (request.connection?.remoteAddress) {
      ip = request.connection.remoteAddress;
    } else if (request.socket?.remoteAddress) {
      ip = request.socket.remoteAddress;
    } else if (request.ip) {
      ip = request.ip;
    }

    // Add user agent hash for additional uniqueness
    const userAgent = request.headers['user-agent'] || 'unknown';
    const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 10);
    
    return `${ip}:${userAgentHash}`;
  }
}