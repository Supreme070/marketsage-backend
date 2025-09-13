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
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RateLimit } from '../auth/decorators/rate-limit.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { OwnershipGuard } from '../auth/guards/ownership.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RequireOwnership } from '../auth/decorators/ownership.decorator';
import { Permission } from '../types/permissions';
import { ApiResponse } from '../types';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true,
}))
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('test-list')
  @SetMetadata('skip-auth', true)
  async testList(): Promise<ApiResponse> {
    try {
      const result = await this.organizationsService.findAll(1, 5);
      return {
        success: true,
        data: result,
        message: 'Organizations retrieved successfully (test endpoint)',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_FETCH_ERROR',
          message: err.message || 'Failed to fetch organizations',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Post()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.CREATE_ORGANIZATION)
  @RateLimit(5, 60 * 1000) // 5 organization creations per minute
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const organization = await this.organizationsService.create(
        createOrganizationDto,
        req.user.id,
      );
      return {
        success: true,
        data: organization,
        message: 'Organization created successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_CREATION_ERROR',
          message: err.message || 'Failed to create organization',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get()
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ORGANIZATION)
  @RateLimit(100, 60 * 1000) // 100 requests per minute
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      
      const result = await this.organizationsService.findAll(pageNum, limitNum, search);
      return {
        success: true,
        data: result,
        message: 'Organizations retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_FETCH_ERROR',
          message: err.message || 'Failed to fetch organizations',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ORGANIZATION)
  @RequireOwnership('Organization')
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const organization = await this.organizationsService.findOne(id);
      return {
        success: true,
        data: organization,
        message: 'Organization retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_FETCH_ERROR',
          message: err.message || 'Failed to fetch organization',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get(':id/stats')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ORGANIZATION)
  @RequireOwnership('Organization')
  @RateLimit(30, 60 * 1000) // 30 requests per minute
  async getOrganizationStats(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const stats = await this.organizationsService.getOrganizationStats(id);
      return {
        success: true,
        data: stats,
        message: 'Organization stats retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_STATS_ERROR',
          message: err.message || 'Failed to fetch organization stats',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Get(':id/users')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.VIEW_ORGANIZATION)
  @RequireOwnership('Organization')
  @RateLimit(50, 60 * 1000) // 50 requests per minute
  async getOrganizationUsers(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      
      const result = await this.organizationsService.getOrganizationUsers(id, pageNum, limitNum);
      return {
        success: true,
        data: result,
        message: 'Organization users retrieved successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_USERS_ERROR',
          message: err.message || 'Failed to fetch organization users',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard, RateLimitGuard)
  @RequirePermissions(Permission.UPDATE_ORGANIZATION)
  @RequireOwnership('Organization')
  @RateLimit(20, 60 * 1000) // 20 updates per minute
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const organization = await this.organizationsService.update(
        id,
        updateOrganizationDto,
        req.user.id,
        req.user.role,
      );
      return {
        success: true,
        data: organization,
        message: 'Organization updated successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_UPDATE_ERROR',
          message: err.message || 'Failed to update organization',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(Permission.DELETE_ORGANIZATION)
  @RateLimit(2, 60 * 1000) // 2 deletions per minute
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponse> {
    try {
      const result = await this.organizationsService.remove(
        id,
        req.user.id,
        req.user.role,
      );
      return {
        success: true,
        data: result,
        message: 'Organization deleted successfully',
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: {
          code: err.name || 'ORGANIZATION_DELETE_ERROR',
          message: err.message || 'Failed to delete organization',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}