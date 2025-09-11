import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { RateLimitingModule } from '../rate-limiting/rate-limiting.module';
import { RateLimitGuard } from './guards/rate-limit.guard';
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
    RateLimitingModule,
    RedisModule,
  ],
  providers: [AuthService, JwtStrategy, PrismaService, RateLimitGuard, EmailService, AwsSesService],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule, RateLimitGuard],
})
export class AuthModule {}