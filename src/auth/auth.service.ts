import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto, RegisterDto } from './dto';
import { LoginResponse, RegisterResponse, JWTPayload, UserRole } from '../types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12; // High security salt rounds

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      this.logger.debug(`Registration attempt for email: ${registerDto.email}`);
      
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        this.logger.warn(`Registration failed: User already exists for ${registerDto.email}`);
        throw new ConflictException('User with this email already exists');
      }

      this.logger.debug('User does not exist, proceeding with creation');

      // Hash password with high-security bcrypt
      this.logger.debug('Hashing password...');
      const hashedPassword = await bcrypt.hash(registerDto.password, this.saltRounds);
      this.logger.debug('Password hashed successfully');

      // Create organization if provided
      let organization = null;
      if (registerDto.organizationName) {
        this.logger.debug(`Creating organization: ${registerDto.organizationName}`);
        organization = await this.prisma.organization.create({
          data: {
            name: registerDto.organizationName,
            plan: 'FREE',
          },
        });
        this.logger.debug(`Organization created with ID: ${organization.id}`);
      }

      // Create user
      this.logger.debug('Creating user record...');
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          role: UserRole.USER,
          organizationId: organization?.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(`User created successfully: ${user.id} (${user.email})`);

      // Generate JWT token for immediate login
      const payload: JWTPayload = {
        sub: user.id,
        email: user.email,
        role: user.role as UserRole,
        organizationId: user.organizationId,
      };

      const accessToken = this.jwtService.sign(payload);
      this.logger.debug('JWT token generated for new user');

      // Store session in Redis for tracking
      const sessionData = {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        loginTime: new Date().toISOString(),
        userAgent: 'registration',
      };
      
      const sessionStored = await this.redisService.setSession(
        user.id, 
        sessionData, 
        24 * 60 * 60 // 24 hours
      );

      if (sessionStored) {
        this.logger.debug(`Session stored in Redis for user: ${user.id}`);
      } else {
        this.logger.warn(`Failed to store session in Redis for user: ${user.id}`);
      }

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          organizationId: user.organizationId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      };

    } catch (error) {
      const err = error as Error;
      this.logger.error(`Registration failed for ${registerDto.email}: ${err.message}`);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      return {
        success: false,
        message: 'Registration failed',
      };
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      // Find user with password
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organizationId: true,
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user has a password (not OAuth user)
      if (!user.password) {
        throw new UnauthorizedException('Please use OAuth to log in');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload: JWTPayload = {
        sub: user.id,
        email: user.email,
        role: user.role as UserRole,
        organizationId: user.organizationId,
      };

      const accessToken = this.jwtService.sign(payload);

      // Store session in Redis for tracking
      const sessionData = {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        loginTime: new Date().toISOString(),
        userAgent: 'login',
      };
      
      const sessionStored = await this.redisService.setSession(
        user.id, 
        sessionData, 
        24 * 60 * 60 // 24 hours
      );

      if (sessionStored) {
        this.logger.debug(`Session stored in Redis for user: ${user.id}`);
      } else {
        this.logger.warn(`Failed to store session in Redis for user: ${user.id}`);
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      this.logger.log(`Successful login for user: ${user.id} (${user.email})`);

      return {
        success: true,
        message: 'Login successful',
        user: {
          ...userWithoutPassword,
          role: userWithoutPassword.role as UserRole,
        },
        accessToken,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.warn(`Login failed for ${loginDto.email}: ${err.message}`);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Login failed');
    }
  }

  async validateUser(payload: JWTPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Token validation failed: ${err.message}`);
      return null;
    }
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async logout(userId: string): Promise<boolean> {
    try {
      // Remove session from Redis
      const sessionDeleted = await this.redisService.deleteSession(userId);
      
      if (sessionDeleted) {
        this.logger.log(`Session removed from Redis for user: ${userId}`);
      } else {
        this.logger.warn(`Failed to remove session from Redis for user: ${userId}`);
      }
      
      return sessionDeleted;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Logout failed for user ${userId}: ${err.message}`);
      return false;
    }
  }

  async validateSession(userId: string): Promise<any | null> {
    try {
      // Check if session exists in Redis
      const sessionData = await this.redisService.getSession(userId);
      
      if (sessionData) {
        this.logger.debug(`Valid session found in Redis for user: ${userId}`);
        return sessionData;
      } else {
        this.logger.debug(`No session found in Redis for user: ${userId}`);
        return null;
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Session validation failed for user ${userId}: ${err.message}`);
      return null;
    }
  }

  async refreshSession(userId: string, ttlSeconds: number = 24 * 60 * 60): Promise<boolean> {
    try {
      // Get current session data
      const sessionData = await this.redisService.getSession(userId);
      
      if (sessionData) {
        // Update the session with new TTL
        sessionData.lastActivity = new Date().toISOString();
        const sessionUpdated = await this.redisService.setSession(userId, sessionData, ttlSeconds);
        
        if (sessionUpdated) {
          this.logger.debug(`Session refreshed for user: ${userId}`);
        }
        
        return sessionUpdated;
      }
      
      return false;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Session refresh failed for user ${userId}: ${err.message}`);
      return false;
    }
  }

  async getActiveSessions(): Promise<any[]> {
    try {
      // This is a simple implementation - in production you might want to 
      // maintain a set of active session IDs for efficiency
      this.logger.debug('Getting active sessions (basic implementation)');
      return [];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get active sessions: ${err.message}`);
      return [];
    }
  }

  async testDatabaseConnection(): Promise<number> {
    const userCount = await this.prisma.user.count();
    this.logger.debug(`Database test: Found ${userCount} users`);
    return userCount;
  }

  async testRedisConnection(): Promise<boolean> {
    return await this.redisService.isHealthy();
  }
}