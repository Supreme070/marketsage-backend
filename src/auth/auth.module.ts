import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { OwnershipGuard } from './guards/ownership.guard';
import { RedisModule } from '../redis/redis.module';
import { EmailService } from './email.service';
import { AwsSesService } from './aws-ses.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    RedisModule,
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    PrismaService, 
    RateLimitGuard, 
    PermissionsGuard,
    OwnershipGuard,
    EmailService, 
    AwsSesService
  ],
  controllers: [AuthController],
  exports: [
    AuthService, 
    JwtStrategy, 
    PassportModule, 
    RateLimitGuard,
    PermissionsGuard,
    OwnershipGuard
  ],
})
export class AuthModule {}