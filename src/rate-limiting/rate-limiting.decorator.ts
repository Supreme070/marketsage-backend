import { SetMetadata } from '@nestjs/common';

/**
 * Apply predefined rate limiting configuration
 * @param key Key from rateLimitConfigs (e.g., 'auth', 'api', 'ai', etc.)
 */
export const UseRateLimit = (key: string) => SetMetadata('rateLimitKey', key);

/**
 * Apply custom rate limiting configuration
 * @param limit Maximum number of requests
 * @param windowMs Time window in milliseconds
 */
export const CustomRateLimit = (limit: number, windowMs: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata('rateLimit', limit)(target, propertyKey, descriptor);
    SetMetadata('rateLimitWindow', windowMs)(target, propertyKey, descriptor);
  };
};

/**
 * Apply role-based rate limiting
 * @param type Type of operation ('api', 'ai', 'email', 'sms')
 */
export const UseRoleBasedRateLimit = (type: string) => SetMetadata('roleRateLimitType', type);