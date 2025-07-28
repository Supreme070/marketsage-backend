import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RateLimitingService } from './rate-limiting.service';
import { createRoleBasedRateLimitConfig } from './rate-limiting.config';

@Injectable()
export class RoleBasedRateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rateLimitingService: RateLimitingService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const rateLimitType = this.reflector.get<string>('roleRateLimitType', context.getHandler());

    if (!rateLimitType) {
      // If no role-based rate limiting is specified, allow the request
      return true;
    }

    // Get user from request (should be set by JWT guard)
    const user = (request as any).user;
    const userRole = user?.role || 'USER';

    // Create role-based rate limit config
    const config = createRoleBasedRateLimitConfig(userRole as any, rateLimitType as any);

    // Use user ID as identifier for authenticated requests, IP for unauthenticated
    const identifier = user?.id || this.getClientIdentifier(request);
    const endpoint = request.path || request.url || 'unknown';

    // Check rate limit
    const result = await this.rateLimitingService.check(identifier, endpoint, config);

    if (!result.allowed) {
      const resetTimeSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Rate limit exceeded for ${userRole} role. Try again in ${resetTimeSeconds} seconds.`,
          error: 'Role-Based Rate Limit Exceeded',
          retryAfter: result.retryAfter,
          limit: result.limit,
          remaining: result.remaining,
          role: userRole,
          rateLimitType,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getClientIdentifier(request: Request): string {
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