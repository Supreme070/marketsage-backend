import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JWTPayload } from '../../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('NEXTAUTH_SECRET') || configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
    });
  }

  async validate(payload: JWTPayload) {
    try {
      console.log('JWT Strategy - Validating payload:', payload);
      const user = await this.authService.validateUser(payload);
      console.log('JWT Strategy - User found:', user);
      
      if (!user) {
        console.log('JWT Strategy - User not found for payload:', payload);
        throw new UnauthorizedException('User not found');
      }
      
      return user;
    } catch (error) {
      console.log('JWT Strategy - Validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}