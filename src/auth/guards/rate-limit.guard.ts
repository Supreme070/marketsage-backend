import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RateLimitingService, RateLimitConfig } from '../../rate-limiting/rate-limiting.service';
import { rateLimitConfigs, authRateLimitConfigs } from '../../rate-limiting/rate-limiting.config';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly defaultLimit = 5; // 5 attempts
  private readonly defaultWindow = 15 * 60 * 1000; // 15 minutes

  constructor(
    private reflector: Reflector,
    private rateLimitingService: RateLimitingService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const limit = this.reflector.get<number>('rateLimit', context.getHandler()) || this.defaultLimit;
    const windowMs = this.reflector.get<number>('rateLimitWindow', context.getHandler()) || this.defaultWindow;

    // Use IP address as the key for rate limiting
    const identifier = this.getClientKey(request);
    const endpoint = request.path || request.url || 'unknown';

    // Create rate limit config
    const config: RateLimitConfig = {
      windowMs,
      maxRequests: limit,
      onLimitReached: (id: string, ep: string) => {
        console.warn('Rate limit exceeded in guard', { identifier: id, endpoint: ep });
      }
    };

    // Check rate limit
    const result = await this.rateLimitingService.check(identifier, endpoint, config);

    if (!result.allowed) {
      const resetTimeSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. Try again in ${resetTimeSeconds} seconds.`,
          error: 'Rate Limit Exceeded',
          retryAfter: result.retryAfter,
          limit: result.limit,
          remaining: result.remaining,
        },
        HttpStatus.TOO_MANY_REQUESTS,
        {
          cause: 'RATE_LIMIT_EXCEEDED'
        }
      );
    }

    return true;
  }

  private getClientKey(request: Request): string {
    // Try to get real IP from various headers
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

    return ip;
  }
}