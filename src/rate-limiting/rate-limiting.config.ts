import { RateLimitConfig } from './rate-limiting.service';

// Predefined rate limiters matching Next.js configuration
export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // Authentication attempts
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 attempts per 15 minutes
    onLimitReached: (identifier: string) => {
      console.warn('Authentication rate limit exceeded', { identifier });
    }
  } as RateLimitConfig,

  // API requests
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    onLimitReached: (identifier: string, endpoint: string) => {
      console.warn('API rate limit exceeded', { identifier, endpoint });
    }
  } as RateLimitConfig,

  // AI operations
  ai: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50, // 50 AI operations per 5 minutes
    onLimitReached: (identifier: string) => {
      console.warn('AI rate limit exceeded', { identifier });
    }
  } as RateLimitConfig,

  // Email sending
  email: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000, // 1000 emails per hour
    onLimitReached: (identifier: string) => {
      console.warn('Email rate limit exceeded', { identifier });
    }
  } as RateLimitConfig,

  // SMS sending
  sms: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100, // 100 SMS per hour
    onLimitReached: (identifier: string) => {
      console.warn('SMS rate limit exceeded', { identifier });
    }
  } as RateLimitConfig,

  // File uploads
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50, // 50 uploads per hour
    onLimitReached: (identifier: string) => {
      console.warn('Upload rate limit exceeded', { identifier });
    }
  } as RateLimitConfig,

  // Data exports
  export: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 10, // 10 exports per day
    onLimitReached: (identifier: string) => {
      console.warn('Export rate limit exceeded', { identifier });
    }
  } as RateLimitConfig,

  // Password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 password resets per hour
    onLimitReached: (identifier: string) => {
      console.warn('Password reset rate limit exceeded', { identifier });
    }
  } as RateLimitConfig,

  // Account creation
  registration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registrations per hour per IP
    onLimitReached: (identifier: string) => {
      console.warn('Registration rate limit exceeded', { identifier });
    }
  } as RateLimitConfig
};

// Role-based rate limits matching Next.js
export const roleBasedRateLimits = {
  USER: {
    api: { windowMs: 60 * 1000, maxRequests: 60 },
    ai: { windowMs: 5 * 60 * 1000, maxRequests: 20 },
    email: { windowMs: 60 * 60 * 1000, maxRequests: 100 },
    sms: { windowMs: 60 * 60 * 1000, maxRequests: 50 }
  },
  ADMIN: {
    api: { windowMs: 60 * 1000, maxRequests: 200 },
    ai: { windowMs: 5 * 60 * 1000, maxRequests: 100 },
    email: { windowMs: 60 * 60 * 1000, maxRequests: 500 },
    sms: { windowMs: 60 * 60 * 1000, maxRequests: 200 }
  },
  IT_ADMIN: {
    api: { windowMs: 60 * 1000, maxRequests: 500 },
    ai: { windowMs: 5 * 60 * 1000, maxRequests: 200 },
    email: { windowMs: 60 * 60 * 1000, maxRequests: 1000 },
    sms: { windowMs: 60 * 60 * 1000, maxRequests: 500 }
  },
  SUPER_ADMIN: {
    api: { windowMs: 60 * 1000, maxRequests: 1000 },
    ai: { windowMs: 5 * 60 * 1000, maxRequests: 500 },
    email: { windowMs: 60 * 60 * 1000, maxRequests: 5000 },
    sms: { windowMs: 60 * 60 * 1000, maxRequests: 1000 }
  }
};

/**
 * Create role-based rate limit config
 */
export function createRoleBasedRateLimitConfig(
  role: keyof typeof roleBasedRateLimits,
  type: keyof typeof roleBasedRateLimits.USER
): RateLimitConfig {
  const config = roleBasedRateLimits[role][type];
  
  return {
    windowMs: config.windowMs,
    maxRequests: config.maxRequests,
    keyGenerator: (identifier, endpoint) => `${role}:${identifier}:${endpoint}`,
    onLimitReached: (identifier, endpoint) => {
      console.warn(`${role} rate limit exceeded`, { 
        identifier, 
        endpoint, 
        type,
        role 
      });
    }
  };
}

// Authentication-specific rate limiting configurations
export const authRateLimitConfigs = {
  '/api/v2/auth/login': { 
    windowMs: 15 * 60 * 1000, 
    maxRequests: 5, 
    blockDurationMs: 30 * 60 * 1000 
  }, // 5 attempts per 15min, block 30min
  '/api/v2/auth/register': { 
    windowMs: 60 * 60 * 1000, 
    maxRequests: 3, 
    blockDurationMs: 60 * 60 * 1000 
  }, // 3 attempts per hour, block 1hr
  '/api/v2/auth/forgot-password': { 
    windowMs: 60 * 60 * 1000, 
    maxRequests: 3, 
    blockDurationMs: 60 * 60 * 1000 
  }, // 3 attempts per hour
  '/api/v2/auth/reset-password': { 
    windowMs: 60 * 60 * 1000, 
    maxRequests: 5, 
    blockDurationMs: 30 * 60 * 1000 
  }, // 5 attempts per hour
  'default': { 
    windowMs: 60 * 1000, 
    maxRequests: 60, 
    blockDurationMs: 5 * 60 * 1000 
  } // Default: 60 per minute
};