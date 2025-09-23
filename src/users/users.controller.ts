import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { OwnershipGuard } from '../auth/guards/ownership.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RequireOwnership } from '../auth/decorators/ownership.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.CREATE_USER)
  @RateLimit(10, 60 * 1000) // 10 user creations per minute
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        success: true,
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_CREATION_ERROR',
          message: err.message || 'Failed to create user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      
      const result = await this.usersService.findAll(pageNum, limitNum, search, role, status);
      return {
        success: true,
        data: result,
        message: 'Users retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_FETCH_ERROR',
          message: err.message || 'Failed to fetch users',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('admin/stats')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getAdminStats(): Promise<ApiResponse> {
    try {
      const stats = await this.usersService.getAdminStats();
      return {
        success: true,
        data: stats,
        message: 'Admin user stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ADMIN_STATS_ERROR',
          message: err.message || 'Failed to fetch admin stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('admin/suspend/:id')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 suspensions per minute
  @HttpCode(HttpStatus.OK)
  async suspendUser(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const result = await this.usersService.suspendUser(id);
      return {
        success: true,
        data: result,
        message: 'User suspended successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_SUSPEND_ERROR',
          message: err.message || 'Failed to suspend user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post('admin/activate/:id')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ADMIN)
  @RateLimit(10, 60 * 1000) // 10 activations per minute
  @HttpCode(HttpStatus.OK)
  async activateUser(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const result = await this.usersService.activateUser(id);
      return {
        success: true,
        data: result,
        message: 'User activated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_ACTIVATE_ERROR',
          message: err.message || 'Failed to activate user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RequireOwnership('user')
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const user = await this.usersService.findOne(id);
      return {
        success: true,
        data: user,
        message: 'User retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_FETCH_ERROR',
          message: err.message || 'Failed to fetch user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get(':id/stats')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RequireOwnership('user')
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getUserStats(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const stats = await this.usersService.getUserStats(id);
      return {
        success: true,
        data: stats,
        message: 'User stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_STATS_ERROR',
          message: err.message || 'Failed to fetch user stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('email/:email')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RateLimit(20, 60 * 1000) // 20 requests per minute
  async findByEmail(@Param('email') email: string): Promise<ApiResponse> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            timestamp: new Date().toISOString(),
          },
        };
      }
      return {
        success: true,
        data: user,
        message: 'User retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_FETCH_ERROR',
          message: err.message || 'Failed to fetch user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.UPDATE_USER)
  @RequireOwnership('user')
  @RateLimit(20, 60 * 1000) // 20 updates per minute
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse> {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return {
        success: true,
        data: user,
        message: 'User updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_UPDATE_ERROR',
          message: err.message || 'Failed to update user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.DELETE_USER)
  @RateLimit(5, 60 * 1000) // 5 deletions per minute
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const result = await this.usersService.remove(id);
      return {
        success: true,
        data: result,
        message: 'User deleted successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_DELETE_ERROR',
          message: err.message || 'Failed to delete user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post(':id/change-password')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.UPDATE_USER)
  @RequireOwnership('user')
  @RateLimit(5, 60 * 1000) // 5 password changes per minute
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string },
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      // Ensure users can only change their own password unless they're admin
      const requestingUser = req.user;
      if (requestingUser.id !== id && requestingUser.role !== 'ADMIN' && requestingUser.role !== 'SUPER_ADMIN') {
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only change your own password',
            timestamp: new Date().toISOString(),
          },
        };
      }

      const result = await this.usersService.changePassword(
        id,
        body.currentPassword,
        body.newPassword,
      );
      return {
        success: true,
        data: result,
        message: 'Password changed successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'PASSWORD_CHANGE_ERROR',
          message: err.message || 'Failed to change password',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('me/profile')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_USER)
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getMyProfile(@Request() req: any): Promise<ApiResponse> {
    try {
      const user = await this.usersService.findOne(req.user.id);
      return {
        success: true,
        data: user,
        message: 'Profile retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'PROFILE_FETCH_ERROR',
          message: err.message || 'Failed to fetch profile',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Patch('me/profile')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.UPDATE_USER)
  @RateLimit(10, 60 * 1000) // 10 profile updates per minute
  async updateMyProfile(
    @Request() req: any,
    @Body() updateUserDto: Omit<UpdateUserDto, 'role' | 'organizationId'>,
  ): Promise<ApiResponse> {
    try {
      // Remove sensitive fields that users shouldn't be able to change themselves
      const safeUpdateDto = { ...updateUserDto };
      delete (safeUpdateDto as any).role;
      delete (safeUpdateDto as any).organizationId;

      const user = await this.usersService.update(req.user.id, safeUpdateDto);
      return {
        success: true,
        data: user,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'PROFILE_UPDATE_ERROR',
          message: err.message || 'Failed to update profile',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get('test-create')
  @SetMetadata('skip-auth', true)
  async testCreateForm(): Promise<string> {
    return `
    <html>
    <body>
    <h2>Test User Creation</h2>
    <form id="userForm">
      <input type="email" name="email" placeholder="Email" required><br><br>
      <input type="password" name="password" placeholder="Password (min 8 chars)" required><br><br>
      <input type="text" name="name" placeholder="Full Name" required><br><br>
      <select name="role">
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select><br><br>
      <input type="text" name="organizationName" placeholder="Organization Name (optional)"><br><br>
      <button type="submit">Create User</button>
    </form>
    <div id="result"></div>
    <script>
    document.getElementById('userForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      try {
        const response = await fetch('/api/v2/users/test-create-api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
      } catch (error) {
        document.getElementById('result').innerHTML = 'Error: ' + error.message;
      }
    });
    </script>
    </body>
    </html>`;
  }

  @Post('test-create-api')
  @SetMetadata('skip-auth', true)
  @HttpCode(HttpStatus.CREATED)
  async testCreateApi(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        success: true,
        data: user,
        message: 'User created successfully (test endpoint)',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'USER_CREATION_ERROR',
          message: err.message || 'Failed to create user',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}