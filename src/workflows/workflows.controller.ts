import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { OwnershipGuard } from '../auth/guards/ownership.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RequireOwnership } from '../auth/decorators/ownership.decorator';
import { Permission } from '../types/permissions';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.VIEW_WORKFLOW)
  async findAll(@Query('status') status?: string, @Request() req?: any) {
    return this.workflowsService.findAll(status, req?.user?.id);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard)
  @RequirePermissions(Permission.VIEW_WORKFLOW)
  @RequireOwnership('workflow')
  async findOne(@Param('id') id: string, @Request() req?: any) {
    return this.workflowsService.findOne(id, req?.user?.id);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.CREATE_WORKFLOW)
  async create(@Body() createWorkflowDto: CreateWorkflowDto, @Request() req?: any) {
    return this.workflowsService.create(createWorkflowDto, req?.user?.id);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard)
  @RequirePermissions(Permission.UPDATE_WORKFLOW)
  @RequireOwnership('workflow')
  async update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto, @Request() req?: any) {
    return this.workflowsService.update(id, updateWorkflowDto, req?.user?.id);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard, OwnershipGuard)
  @RequirePermissions(Permission.DELETE_WORKFLOW)
  @RequireOwnership('workflow')
  async remove(@Param('id') id: string, @Request() req?: any) {
    return this.workflowsService.remove(id, req?.user?.id);
  }

  @Post(':id/execute')
  @UseGuards(PermissionsGuard, OwnershipGuard)
  @RequirePermissions(Permission.EXECUTE_WORKFLOW)
  @RequireOwnership('workflow')
  async execute(@Param('id') id: string, @Request() req?: any) {
    return this.workflowsService.execute(id, req?.user?.id);
  }
}
