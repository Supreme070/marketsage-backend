import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { WorkflowStatus } from '@prisma/client';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, userId?: string) {
    const where: any = {};
    
    if (status) {
      where.status = status as WorkflowStatus;
    }
    
    if (userId) {
      where.createdById = userId;
    }
    
    try {
      const workflows = await this.prisma.workflow.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      
      return {
        success: true,
        data: workflows,
        count: workflows.length,
      };
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return {
        success: false,
        error: 'Failed to fetch workflows',
        data: [],
        count: 0,
      };
    }
  }

  async findOne(id: string, userId?: string) {
    try {
      const where: any = { id };
      if (userId) {
        where.createdById = userId;
      }
      
      const workflow = await this.prisma.workflow.findFirst({
        where,
      });
      
      if (!workflow) {
        return {
          success: false,
          error: 'Workflow not found',
        };
      }
      
      return {
        success: true,
        data: workflow,
      };
    } catch (error) {
      console.error('Error fetching workflow:', error);
      return {
        success: false,
        error: 'Failed to fetch workflow',
      };
    }
  }

  async create(createWorkflowDto: CreateWorkflowDto, userId?: string) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User authentication required',
        };
      }

      const workflow = await this.prisma.workflow.create({
        data: {
          name: createWorkflowDto.name,
          description: createWorkflowDto.description,
          status: createWorkflowDto.status || WorkflowStatus.INACTIVE,
          definition: JSON.stringify(createWorkflowDto.definition || {}),
          createdById: userId,
        },
      });
      
      return {
        success: true,
        data: workflow,
      };
    } catch (error) {
      console.error('Error creating workflow:', error);
      return {
        success: false,
        error: 'Failed to create workflow',
      };
    }
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto, userId?: string) {
    try {
      const where: any = { id };
      if (userId) {
        where.createdById = userId;
      }
      
      const workflow = await this.prisma.workflow.updateMany({
        where,
        data: updateWorkflowDto,
      });
      
      if (workflow.count === 0) {
        return {
          success: false,
          error: 'Workflow not found or access denied',
        };
      }
      
      return {
        success: true,
        message: 'Workflow updated successfully',
      };
    } catch (error) {
      console.error('Error updating workflow:', error);
      return {
        success: false,
        error: 'Failed to update workflow',
      };
    }
  }

  async remove(id: string, userId?: string) {
    try {
      const where: any = { id };
      if (userId) {
        where.createdById = userId;
      }
      
      const result = await this.prisma.workflow.deleteMany({
        where,
      });
      
      if (result.count === 0) {
        return {
          success: false,
          error: 'Workflow not found or access denied',
        };
      }
      
      return {
        success: true,
        message: 'Workflow deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting workflow:', error);
      return {
        success: false,
        error: 'Failed to delete workflow',
      };
    }
  }

  async execute(id: string, userId?: string) {
    try {
      const where: any = { id };
      if (userId) {
        where.createdById = userId;
      }
      
      const workflow = await this.prisma.workflow.findFirst({
        where,
      });
      
      if (!workflow) {
        return {
          success: false,
          error: 'Workflow not found or access denied',
        };
      }
      
      // Mock execution for now
      return {
        success: true,
        message: 'Workflow execution started',
        executionId: `exec_${Date.now()}`,
      };
    } catch (error) {
      console.error('Error executing workflow:', error);
      return {
        success: false,
        error: 'Failed to execute workflow',
      };
    }
  }
}
