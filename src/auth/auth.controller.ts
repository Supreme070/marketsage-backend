import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Get,
  Request,
  Logger,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RateLimit } from './decorators/rate-limit.decorator';
import { LoginDto, RegisterDto, RegisterInitialDto, RegisterVerifyDto, RegisterCompleteDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { ApiResponse } from '../types';

@Controller('auth')
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(RateLimitGuard)
  @RateLimit(3, 60 * 60 * 1000) // 3 attempts per hour
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse> {
    try {
      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('DTO received:', JSON.stringify(registerDto, null, 2));
      
      const result = await this.authService.register(registerDto);
      console.log('Service result:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        return {
          success: true,
          data: result.user,
          message: result.message,
        };
      } else {
        return {
          success: false,
          error: {
            code: 'REGISTRATION_FAILED',
            message: result.message || 'Registration failed',
            timestamp: new Date().toISOString(),
          },
        };
      }
    } catch (error) {
      const err = error as Error;
      console.log('=== REGISTRATION EXCEPTION ===');
      console.log('Error:', err.message);
      console.log('Stack:', err.stack);
      this.logger.error(`Registration error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: err.name || 'REGISTRATION_ERROR',
          message: err.message || 'Registration failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('login')
  @UseGuards(RateLimitGuard)
  @RateLimit(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    try {
      const result = await this.authService.login(loginDto);
      
      if (result.success) {
        return {
          success: true,
          data: {
            user: result.user,
            token: result.accessToken,
          },
          message: result.message,
        };
      } else {
        return {
          success: false,
          error: {
            code: 'LOGIN_FAILED',
            message: result.message || 'Login failed',
            timestamp: new Date().toISOString(),
          },
        };
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Login error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: err.name || 'LOGIN_ERROR',
          message: err.message || 'Login failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any): Promise<ApiResponse> {
    try {
      return {
        success: true,
        data: req.user,
        message: 'Profile retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Profile retrieval error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: 'PROFILE_ERROR',
          message: 'Failed to retrieve profile',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }


  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req: any): Promise<ApiResponse> {
    try {
      const result = await this.authService.refreshToken(req.user.id);
      return {
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Token refresh error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'TOKEN_REFRESH_FAILED',
          message: 'Token refresh failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any): Promise<ApiResponse> {
    try {
      await this.authService.logout(req.user.id);
      return {
        success: true,
        data: null,
        message: 'Logged out successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Logout error: ${err.message}`);
      return {
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Logout failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('verify-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Request() req: any): Promise<ApiResponse> {
    try {
      return {
        success: true,
        data: {
          valid: true,
          user: req.user,
        },
        message: 'Token is valid',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Token verification error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: 'TOKEN_INVALID',
          message: 'Token verification failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('test-db')
  @UseGuards(RateLimitGuard)
  @RateLimit(10, 60 * 1000) // 10 attempts per minute
  @HttpCode(HttpStatus.OK)
  async testDatabase(): Promise<ApiResponse> {
    try {
      const userCount = await this.authService.testDatabaseConnection();
      return {
        success: true,
        data: { userCount },
        message: 'Database connection test successful',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Database test error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  // Multi-step registration endpoints
  @Post('register/initial')
  @UseGuards(RateLimitGuard)
  @RateLimit(20, 15 * 60 * 1000) // 20 attempts per 15 minutes (increased for development)
  @HttpCode(HttpStatus.OK)
  async registerInitial(@Body() registerDto: RegisterInitialDto): Promise<ApiResponse> {
    try {
      const result = await this.authService.registerInitial(registerDto);
      
      return {
        success: result.success,
        data: { 
          registrationId: result.registrationId,
          ...(result.verificationPin && { verificationPin: result.verificationPin }),
        },
        message: result.message,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Initial registration error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: err.name || 'INITIAL_REGISTRATION_ERROR',
          message: err.message || 'Initial registration failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('register/verify')
  @UseGuards(RateLimitGuard)
  @RateLimit(10, 15 * 60 * 1000) // 10 attempts per 15 minutes
  @HttpCode(HttpStatus.OK)
  async registerVerify(@Body() verifyDto: RegisterVerifyDto): Promise<ApiResponse> {
    try {
      const result = await this.authService.registerVerify(verifyDto);
      
      return {
        success: result.success,
        message: result.message,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Verification error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: err.name || 'VERIFICATION_ERROR',
          message: err.message || 'Verification failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('register/complete')
  @UseGuards(RateLimitGuard)
  @RateLimit(3, 15 * 60 * 1000) // 3 attempts per 15 minutes
  @HttpCode(HttpStatus.CREATED)
  async registerComplete(@Body() completeDto: RegisterCompleteDto): Promise<ApiResponse> {
    try {
      const result = await this.authService.registerComplete(completeDto);
      
      return {
        success: result.success,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
        message: result.message,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Registration completion error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: err.name || 'REGISTRATION_COMPLETION_ERROR',
          message: err.message || 'Registration completion failed',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('forgot-password')
  @UseGuards(RateLimitGuard)
  @RateLimit(3, 15 * 60 * 1000) // 3 attempts per 15 minutes
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ApiResponse> {
    try {
      await this.authService.forgotPassword(forgotPasswordDto.email);
      return {
        success: true,
        message: 'Password reset email sent successfully',
        data: { email: forgotPasswordDto.email }
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Forgot password error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_FAILED',
          message: err.message || 'Failed to send password reset email',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('reset-password')
  @UseGuards(RateLimitGuard)
  @RateLimit(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ApiResponse> {
    try {
      const result = await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.password
      );
      return {
        success: true,
        message: 'Password reset successfully',
        data: { userId: result.userId }
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Reset password error: ${err.message}`);
      
      return {
        success: false,
        error: {
          code: 'RESET_PASSWORD_FAILED',
          message: err.message || 'Failed to reset password',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}