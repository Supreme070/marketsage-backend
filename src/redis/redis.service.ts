import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis | null = null;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const redisUrl = this.configService.get<string>('REDIS_URL');
      const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
      const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
      const redisDb = this.configService.get<number>('REDIS_DB', 0);

      if (redisUrl) {
        // Use Redis URL if provided (for production/cloud environments)
        this.redisClient = new Redis(redisUrl, {
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });
        this.logger.log(`Connecting to Redis using URL: ${redisUrl.replace(/:[^:]*@/, ':***@')}`);
      } else {
        // Use individual config values (for local development)
        this.redisClient = new Redis({
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          db: redisDb,
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });
        this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort} (DB: ${redisDb})`);
      }

      // Event listeners
      this.redisClient.on('connect', () => {
        this.logger.log('Connected to Redis server');
        this.isConnected = true;
      });

      this.redisClient.on('ready', () => {
        this.logger.log('Redis client ready for commands');
      });

      this.redisClient.on('error', (error) => {
        this.logger.error(`Redis connection error: ${error.message}`);
        this.isConnected = false;
      });

      this.redisClient.on('close', () => {
        this.logger.warn('Redis connection closed');
        this.isConnected = false;
      });

      this.redisClient.on('reconnecting', () => {
        this.logger.log('Reconnecting to Redis...');
      });

      // Attempt to connect
      await this.redisClient.connect();
      
      // Test connection
      await this.redisClient.ping();
      this.logger.log('✅ Redis connection successful');

    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to connect to Redis: ${err.message}`);
      this.isConnected = false;
      // Don't throw error to prevent app startup failure
      // The app should work without Redis, with degraded functionality
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.redisClient) {
        await this.redisClient.quit();
        this.logger.log('Redis connection closed gracefully');
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error closing Redis connection: ${err.message}`);
    }
  }

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.redisClient || !this.isConnected) {
        return false;
      }
      const result = await this.redisClient.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  // Generic Redis operations
  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected || !this.redisClient) {
        this.logger.warn('Redis not connected, cannot get key');
        return null;
      }
      return await this.redisClient.get(key);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting key ${key}: ${err.message}`);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (!this.isConnected || !this.redisClient) {
        this.logger.warn('Redis not connected, cannot set key');
        return false;
      }
      
      if (ttlSeconds) {
        await this.redisClient.setex(key, ttlSeconds, value);
      } else {
        await this.redisClient.set(key, value);
      }
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error setting key ${key}: ${err.message}`);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected || !this.redisClient) {
        this.logger.warn('Redis not connected, cannot delete key');
        return false;
      }
      const result = await this.redisClient.del(key);
      return result > 0;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error deleting key ${key}: ${err.message}`);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected || !this.redisClient) {
        return false;
      }
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error checking existence of key ${key}: ${err.message}`);
      return false;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      if (!this.isConnected || !this.redisClient) {
        return false;
      }
      const result = await this.redisClient.expire(key, ttlSeconds);
      return result === 1;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error setting expiration for key ${key}: ${err.message}`);
      return false;
    }
  }

  // Session management specific methods
  async getSession(sessionId: string): Promise<any | null> {
    try {
      const sessionKey = `session:${sessionId}`;
      const sessionData = await this.get(sessionKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting session ${sessionId}: ${err.message}`);
      return null;
    }
  }

  async setSession(sessionId: string, sessionData: any, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      const sessionKey = `session:${sessionId}`;
      const serializedData = JSON.stringify(sessionData);
      return await this.set(sessionKey, serializedData, ttlSeconds);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error setting session ${sessionId}: ${err.message}`);
      return false;
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const sessionKey = `session:${sessionId}`;
      return await this.del(sessionKey);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error deleting session ${sessionId}: ${err.message}`);
      return false;
    }
  }

  // Cache management methods
  async getCache(key: string): Promise<any | null> {
    try {
      const cacheKey = `cache:${key}`;
      const cachedData = await this.get(cacheKey);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting cache ${key}: ${err.message}`);
      return null;
    }
  }

  async setCache(key: string, data: any, ttlSeconds: number = 300): Promise<boolean> {
    try {
      const cacheKey = `cache:${key}`;
      const serializedData = JSON.stringify(data);
      return await this.set(cacheKey, serializedData, ttlSeconds);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error setting cache ${key}: ${err.message}`);
      return false;
    }
  }

  async deleteCache(key: string): Promise<boolean> {
    try {
      const cacheKey = `cache:${key}`;
      return await this.del(cacheKey);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error deleting cache ${key}: ${err.message}`);
      return false;
    }
  }

  // Rate limiting support
  async incrementCounter(key: string, windowSeconds: number = 60): Promise<number> {
    try {
      if (!this.isConnected || !this.redisClient) {
        return 0;
      }

      const counterKey = `counter:${key}`;
      const pipeline = this.redisClient.pipeline();
      pipeline.incr(counterKey);
      pipeline.expire(counterKey, windowSeconds);
      
      const results = await pipeline.exec();
      return results?.[0]?.[1] as number || 0;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error incrementing counter ${key}: ${err.message}`);
      return 0;
    }
  }

  // Get Redis client for advanced operations
  getClient(): Redis | null {
    return this.isConnected ? this.redisClient : null;
  }

  // Connection status
  isRedisConnected(): boolean {
    return this.isConnected;
  }

  // Get connection info for monitoring
  getConnectionInfo(): any {
    return {
      connected: this.isConnected,
      host: this.redisClient?.options?.host || 'unknown',
      port: this.redisClient?.options?.port || 'unknown',
      db: this.redisClient?.options?.db || 0,
    };
  }
}