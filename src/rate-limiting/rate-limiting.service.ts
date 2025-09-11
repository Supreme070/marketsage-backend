import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string, endpoint: string) => string;
  skipIf?: (identifier: string, endpoint: string) => boolean;
  onLimitReached?: (identifier: string, endpoint: string) => void;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  violations: number;
}

@Injectable()
export class RateLimitingService {
  private readonly logger = new Logger(RateLimitingService.name);
  private readonly fallbackStorage = new Map<string, RateLimitEntry>();

  constructor(private readonly redisService: RedisService) {}

  /**
   * Check if request is allowed with Redis-backed rate limiting
   */
  async check(identifier: string, endpoint: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const key = config.keyGenerator 
      ? config.keyGenerator(identifier, endpoint)
      : `rate_limit:${identifier}:${endpoint}`;

    // Skip rate limiting in development mode
    if (process.env.NODE_ENV === 'development') {
      return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: now + config.windowMs
      };
    }

    // Check if this request should be skipped
    if (config.skipIf && config.skipIf(identifier, endpoint)) {
      return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: now + config.windowMs
      };
    }

    try {
      // Try to use Redis first
      if (this.redisService.isRedisConnected()) {
        return await this.checkWithRedis(key, config, now, identifier, endpoint);
      } else {
        // Fallback to in-memory storage
        return this.checkWithMemory(key, config, now, identifier, endpoint);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Rate limiting error for ${key}: ${err.message}`);
      // Fail open - allow request if there's an error
      return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: now + config.windowMs
      };
    }
  }

  private async checkWithRedis(
    key: string, 
    config: RateLimitConfig, 
    now: number, 
    identifier: string, 
    endpoint: string
  ): Promise<RateLimitResult> {
    const client = this.redisService.getClient();
    if (!client) {
      return this.checkWithMemory(key, config, now, identifier, endpoint);
    }

    // Get current entry from Redis
    const entryData = await this.redisService.get(key);
    let entry: RateLimitEntry;

    if (entryData) {
      entry = JSON.parse(entryData);
    } else {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
        firstRequest: now,
        lastRequest: now,
        blocked: false,
        violations: 0
      };
    }

    // Reset if window has passed
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
      entry.blocked = false;
      entry.firstRequest = now;
    }

    // Update last request time
    entry.lastRequest = now;

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      entry.blocked = true;
      entry.violations++;

      // Store updated entry in Redis
      await this.redisService.set(key, JSON.stringify(entry), Math.ceil(config.windowMs / 1000));

      // Call limit reached callback
      if (config.onLimitReached) {
        config.onLimitReached(identifier, endpoint);
      }

      this.logger.warn('Rate limit exceeded', {
        identifier,
        endpoint,
        count: entry.count,
        limit: config.maxRequests,
        violations: entry.violations,
        windowMs: config.windowMs
      });

      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    // Increment counter
    entry.count++;

    // Store updated entry in Redis
    await this.redisService.set(key, JSON.stringify(entry), Math.ceil(config.windowMs / 1000));

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime
    };
  }

  private checkWithMemory(
    key: string, 
    config: RateLimitConfig, 
    now: number, 
    identifier: string, 
    endpoint: string
  ): RateLimitResult {
    let entry = this.fallbackStorage.get(key);
    
    // Create new entry if doesn't exist
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
        firstRequest: now,
        lastRequest: now,
        blocked: false,
        violations: 0
      };
      this.fallbackStorage.set(key, entry);
    }

    // Reset if window has passed
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
      entry.blocked = false;
      entry.firstRequest = now;
    }

    // Update last request time
    entry.lastRequest = now;

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      entry.blocked = true;
      entry.violations++;

      // Call limit reached callback
      if (config.onLimitReached) {
        config.onLimitReached(identifier, endpoint);
      }

      this.logger.warn('Rate limit exceeded (memory)', {
        identifier,
        endpoint,
        count: entry.count,
        limit: config.maxRequests,
        violations: entry.violations,
        windowMs: config.windowMs
      });

      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    // Increment counter
    entry.count++;

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime
    };
  }

  /**
   * Record a failed attempt (for progressive penalties)
   */
  async recordFailedAttempt(identifier: string, endpoint: string, config: RateLimitConfig): Promise<void> {
    const key = config.keyGenerator 
      ? config.keyGenerator(identifier, endpoint)
      : `rate_limit:${identifier}:${endpoint}`;

    try {
      if (this.redisService.isRedisConnected()) {
        const entryData = await this.redisService.get(key);
        if (entryData) {
          const entry: RateLimitEntry = JSON.parse(entryData);
          entry.violations++;
          
          // Apply progressive penalty
          if (entry.violations > 5) {
            entry.resetTime = Date.now() + (config.windowMs * Math.min(entry.violations, 10));
          }
          
          await this.redisService.set(key, JSON.stringify(entry), Math.ceil(config.windowMs / 1000));
        }
      } else {
        const entry = this.fallbackStorage.get(key);
        if (entry) {
          entry.violations++;
          
          // Apply progressive penalty
          if (entry.violations > 5) {
            entry.resetTime = Date.now() + (config.windowMs * Math.min(entry.violations, 10));
          }
        }
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to record failed attempt for ${key}: ${err.message}`);
    }
  }

  /**
   * Record a successful attempt (clears violations)
   */
  async recordSuccessfulAttempt(identifier: string, endpoint: string, config: RateLimitConfig): Promise<void> {
    const key = config.keyGenerator 
      ? config.keyGenerator(identifier, endpoint)
      : `rate_limit:${identifier}:${endpoint}`;

    try {
      if (this.redisService.isRedisConnected()) {
        const entryData = await this.redisService.get(key);
        if (entryData) {
          const entry: RateLimitEntry = JSON.parse(entryData);
          entry.violations = Math.max(0, entry.violations - 1);
          entry.blocked = false;
          
          await this.redisService.set(key, JSON.stringify(entry), Math.ceil(config.windowMs / 1000));
        }
      } else {
        const entry = this.fallbackStorage.get(key);
        if (entry) {
          entry.violations = Math.max(0, entry.violations - 1);
          entry.blocked = false;
        }
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to record successful attempt for ${key}: ${err.message}`);
    }
  }

  /**
   * Clear rate limit for identifier
   */
  async clear(identifier: string, endpoint: string, config: RateLimitConfig): Promise<void> {
    const key = config.keyGenerator 
      ? config.keyGenerator(identifier, endpoint)
      : `rate_limit:${identifier}:${endpoint}`;

    try {
      if (this.redisService.isRedisConnected()) {
        await this.redisService.del(key);
      } else {
        this.fallbackStorage.delete(key);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to clear rate limit for ${key}: ${err.message}`);
    }
  }

  /**
   * Get current status for identifier
   */
  async getStatus(identifier: string, endpoint: string, config: RateLimitConfig): Promise<RateLimitEntry | null> {
    const key = config.keyGenerator 
      ? config.keyGenerator(identifier, endpoint)
      : `rate_limit:${identifier}:${endpoint}`;

    try {
      if (this.redisService.isRedisConnected()) {
        const entryData = await this.redisService.get(key);
        return entryData ? JSON.parse(entryData) : null;
      } else {
        return this.fallbackStorage.get(key) || null;
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get status for ${key}: ${err.message}`);
      return null;
    }
  }

  /**
   * Clean up expired entries from memory storage
   */
  cleanupMemoryStorage(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.fallbackStorage) {
      // Remove entries that are expired and have no violations
      if (now > entry.resetTime && entry.violations === 0) {
        this.fallbackStorage.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug('Memory rate limiter cleanup completed', {
        entriesRemoved: cleanedCount,
        remainingEntries: this.fallbackStorage.size
      });
    }
  }
}