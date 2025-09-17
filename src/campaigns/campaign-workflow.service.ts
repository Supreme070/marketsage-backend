import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateWorkflowDto, 
  UpdateWorkflowDto,
  WorkflowStatus,
  TriggerType,
  ExecutionStatus
} from './dto/campaigns.dto';

@Injectable()
export class CampaignWorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== WORKFLOW MANAGEMENT ====================

  async createWorkflow(campaignId: string, data: CreateWorkflowDto, userId: string, organizationId: string) {
    // Verify campaign exists (check in any channel module)
    const campaign = await this.findCampaignInAnyChannel(campaignId, userId, organizationId);
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Validate trigger configuration
    if (data.triggerType && data.triggerConfig) {
      await this.validateTriggerConfig(data.triggerType, data.triggerConfig);
    }

    const workflow = await this.prisma.workflow.create({
      data: {
        name: data.name || 'Untitled Workflow',
        description: data.description,
        status: 'INACTIVE', // Use existing WorkflowStatus enum
        definition: JSON.stringify({
          type: 'CAMPAIGN_WORKFLOW',
          campaignId,
          triggerType: data.triggerType,
          triggerConfig: data.triggerConfig,
          conditions: data.conditions,
          actions: data.actions,
          isActive: data.isActive || false,
        }),
        createdById: userId,
      },
      include: {
        executions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return workflow;
  }

  async getWorkflows(campaignId: string, userId: string, organizationId: string) {
    // Verify campaign exists
    const campaign = await this.findCampaignInAnyChannel(campaignId, userId, organizationId);
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const workflows = await this.prisma.workflow.findMany({
      where: { 
        createdById: userId,
        AND: [
          {
            definition: {
              contains: '"type":"CAMPAIGN_WORKFLOW"',
            },
          },
          {
            definition: {
              contains: `"campaignId":"${campaignId}"`,
            },
          },
        ],
      },
      include: {
        executions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { executions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return workflows;
  }

  async getWorkflowById(workflowId: string, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        createdById: userId,
        definition: {
          contains: '"type":"CAMPAIGN_WORKFLOW"',
        },
      },
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { executions: true } },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async updateWorkflow(workflowId: string, data: UpdateWorkflowDto, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        createdById: userId,
        definition: {
          contains: '"type":"CAMPAIGN_WORKFLOW"',
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    const definition = JSON.parse(workflow.definition);
    
    if (definition.isActive && data.status === 'ARCHIVED') {
      throw new BadRequestException('Cannot archive active workflow');
    }

    // Validate trigger configuration if provided
    if (data.triggerType && data.triggerConfig) {
      await this.validateTriggerConfig(data.triggerType, data.triggerConfig);
    }

    // Update definition
    const updatedDefinition = {
      ...definition,
      name: data.name || definition.name,
      description: data.description || definition.description,
      triggerType: data.triggerType || definition.triggerType,
      triggerConfig: data.triggerConfig || definition.triggerConfig,
      conditions: data.conditions || definition.conditions,
      actions: data.actions || definition.actions,
      isActive: data.isActive !== undefined ? data.isActive : definition.isActive,
    };

    const updatedWorkflow = await this.prisma.workflow.update({
      where: { id: workflowId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status as any,
        definition: JSON.stringify(updatedDefinition),
      },
      include: {
        executions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return updatedWorkflow;
  }

  async deleteWorkflow(workflowId: string, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        createdById: userId,
        definition: {
          contains: '"type":"CAMPAIGN_WORKFLOW"',
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    const definition = JSON.parse(workflow.definition);
    
    if (definition.isActive) {
      throw new BadRequestException('Cannot delete active workflow');
    }

    await this.prisma.workflow.delete({
      where: { id: workflowId },
    });

    return { message: 'Workflow deleted successfully' };
  }

  // ==================== WORKFLOW EXECUTION ====================

  async activateWorkflow(workflowId: string, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        createdById: userId,
        definition: {
          contains: '"type":"CAMPAIGN_WORKFLOW"',
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    if (workflow.status !== 'INACTIVE') {
      throw new BadRequestException('Only inactive workflows can be activated');
    }

    const definition = JSON.parse(workflow.definition);
    definition.isActive = true;

    const updatedWorkflow = await this.prisma.workflow.update({
      where: { id: workflowId },
      data: {
        status: 'ACTIVE',
        definition: JSON.stringify(definition),
      },
    });

    return {
      message: 'Workflow activated successfully',
      workflow: updatedWorkflow,
    };
  }

  async deactivateWorkflow(workflowId: string, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        createdById: userId,
        definition: {
          contains: '"type":"CAMPAIGN_WORKFLOW"',
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    if (workflow.status !== 'ACTIVE') {
      throw new BadRequestException('Only active workflows can be deactivated');
    }

    const definition = JSON.parse(workflow.definition);
    definition.isActive = false;

    const updatedWorkflow = await this.prisma.workflow.update({
      where: { id: workflowId },
      data: {
        status: 'INACTIVE',
        definition: JSON.stringify(definition),
      },
    });

    return {
      message: 'Workflow deactivated successfully',
      workflow: updatedWorkflow,
    };
  }

  async executeWorkflow(workflowId: string, contactId: string, triggerData?: any) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    const definition = JSON.parse(workflow.definition);
    
    if (!definition.isActive) {
      throw new BadRequestException('Workflow is not active');
    }

    // Check if workflow should be triggered
    const shouldTrigger = await this.evaluateTrigger(definition, triggerData);
    if (!shouldTrigger) {
      return { message: 'Workflow trigger conditions not met' };
    }

    // Check conditions
    const conditionsMet = await this.evaluateConditions(definition, contactId, triggerData);
    if (!conditionsMet) {
      return { message: 'Workflow conditions not met' };
    }

    // Create execution record
    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowId,
        contactId,
        status: 'RUNNING',
        context: JSON.stringify({ triggerData, contactId }),
        startedAt: new Date(),
      },
    });

    try {
      // Execute workflow actions
      const result = await this.executeActions(definition, contactId, triggerData);

      // Update execution record
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          context: JSON.stringify({ ...JSON.parse(execution.context), result }),
        },
      });

      return {
        message: 'Workflow executed successfully',
        execution: {
          id: execution.id,
          status: 'COMPLETED',
          result,
        },
      };
    } catch (error) {
      // Update execution record with error
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });

      throw error;
    }
  }

  async getWorkflowExecutions(workflowId: string, query: any, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        createdById: userId,
        definition: {
          contains: '"type":"CAMPAIGN_WORKFLOW"',
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    const { page = 1, limit = 10, status, contactId } = query;
    const skip = (page - 1) * limit;

    const where: any = { workflowId };
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;

    const [executions, total] = await Promise.all([
      this.prisma.workflowExecution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' },
        include: {
          contact: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
        },
      }),
      this.prisma.workflowExecution.count({ where }),
    ]);

    return {
      executions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== WORKFLOW ANALYTICS ====================

  async getWorkflowAnalytics(workflowId: string, userId: string, organizationId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        id: workflowId,
        createdById: userId,
        definition: {
          contains: '"type":"CAMPAIGN_WORKFLOW"',
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    const executions = await this.prisma.workflowExecution.findMany({
      where: { workflowId },
    });

    const analytics = executions.reduce((acc, execution) => {
      acc.totalExecutions++;
      
      switch (execution.status) {
        case 'RUNNING':
          acc.running++;
          break;
        case 'FAILED':
          acc.failed++;
          break;
        case 'COMPLETED':
          acc.completed++;
          break;
        case 'PAUSED':
          acc.pending++;
          break;
        case 'CANCELLED':
          acc.cancelled++;
          break;
      }
      
      return acc;
    }, {
      totalExecutions: 0,
      completed: 0,
      failed: 0,
      running: 0,
      pending: 0,
      cancelled: 0,
    });

    const successRate = analytics.totalExecutions > 0 
      ? (analytics.completed / analytics.totalExecutions) * 100 
      : 0;

    const failureRate = analytics.totalExecutions > 0 
      ? (analytics.failed / analytics.totalExecutions) * 100 
      : 0;

    return {
      workflow: {
        id: workflow.id,
        name: workflow.name,
        status: workflow.status,
        totalExecutions: workflow.totalExecutions,
        successRate: workflow.successRate,
      },
      analytics: {
        ...analytics,
        successRate: Math.round(successRate * 100) / 100,
        failureRate: Math.round(failureRate * 100) / 100,
      },
    };
  }

  // ==================== HELPER METHODS ====================

  private async findCampaignInAnyChannel(campaignId: string, userId: string, organizationId: string) {
    // Try to find campaign in email module
    try {
      const emailCampaign = await this.prisma.emailCampaign.findFirst({
        where: {
          id: campaignId,
          createdById: userId,
          organizationId,
        },
      });
      if (emailCampaign) return emailCampaign;
    } catch (e) {
      // Campaign not found in email module
    }

    // Try to find campaign in SMS module
    try {
      const smsCampaign = await this.prisma.sMSCampaign.findFirst({
        where: {
          id: campaignId,
          createdById: userId,
        },
      });
      if (smsCampaign) return smsCampaign;
    } catch (e) {
      // Campaign not found in SMS module
    }

    // Try to find campaign in WhatsApp module
    try {
      const whatsappCampaign = await this.prisma.whatsAppCampaign.findFirst({
        where: {
          id: campaignId,
          createdById: userId,
        },
      });
      if (whatsappCampaign) return whatsappCampaign;
    } catch (e) {
      // Campaign not found in WhatsApp module
    }

    return null;
  }

  private async validateTriggerConfig(triggerType: TriggerType, config: string) {
    try {
      const triggerConfig = JSON.parse(config);
      
      switch (triggerType) {
        case TriggerType.TIME_BASED:
          if (!triggerConfig.schedule || !triggerConfig.timezone) {
            throw new BadRequestException('Time-based triggers require schedule and timezone');
          }
          break;
        case TriggerType.EVENT_BASED:
          if (!triggerConfig.eventType || !triggerConfig.eventSource) {
            throw new BadRequestException('Event-based triggers require eventType and eventSource');
          }
          break;
        case TriggerType.CONDITION_BASED:
          if (!triggerConfig.conditions || !Array.isArray(triggerConfig.conditions)) {
            throw new BadRequestException('Condition-based triggers require conditions array');
          }
          break;
        case TriggerType.API_TRIGGER:
          if (!triggerConfig.endpoint || !triggerConfig.method) {
            throw new BadRequestException('API triggers require endpoint and method');
          }
          break;
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException('Invalid trigger configuration JSON');
      }
      throw error;
    }
  }

  private async evaluateTrigger(definition: any, triggerData?: any): Promise<boolean> {
    const triggerConfig = JSON.parse(definition.triggerConfig);
    
    switch (definition.triggerType) {
      case TriggerType.TIME_BASED:
        return this.evaluateTimeBasedTrigger(triggerConfig);
      case TriggerType.EVENT_BASED:
        return this.evaluateEventBasedTrigger(triggerConfig, triggerData);
      case TriggerType.CONDITION_BASED:
        return this.evaluateConditionBasedTrigger(triggerConfig, triggerData);
      case TriggerType.MANUAL:
        return true; // Manual triggers are always executed when called
      case TriggerType.API_TRIGGER:
        return this.evaluateAPITrigger(triggerConfig, triggerData);
      default:
        return false;
    }
  }

  private evaluateTimeBasedTrigger(config: any): boolean {
    // Implement time-based trigger logic
    return true; // Simplified for now
  }

  private evaluateEventBasedTrigger(config: any, triggerData?: any): boolean {
    if (!triggerData) return false;
    
    return triggerData.eventType === config.eventType && 
           triggerData.eventSource === config.eventSource;
  }

  private evaluateConditionBasedTrigger(config: any, triggerData?: any): boolean {
    if (!triggerData) return false;
    
    // Evaluate each condition
    for (const condition of config.conditions) {
      if (!this.evaluateCondition(condition, triggerData)) {
        return false;
      }
    }
    
    return true;
  }

  private evaluateAPITrigger(config: any, triggerData?: any): boolean {
    // API triggers are typically validated by external systems
    return true; // Simplified for now
  }

  private evaluateCondition(condition: any, data: any): boolean {
    const { field, operator, value } = condition;
    const fieldValue = this.getNestedValue(data, field);
    
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'greater_than':
        return fieldValue > value;
      case 'less_than':
        return fieldValue < value;
      case 'contains':
        return String(fieldValue).includes(String(value));
      case 'not_contains':
        return !String(fieldValue).includes(String(value));
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue);
      default:
        return false;
    }
  }

  private async evaluateConditions(definition: any, contactId: string, triggerData?: any): Promise<boolean> {
    if (!definition.conditions) return true;
    
    try {
      const conditions = JSON.parse(definition.conditions);
      
      // Get contact data
      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
      });
      
      if (!contact) return false;
      
      // Evaluate conditions against contact data
      for (const condition of conditions) {
        if (!this.evaluateCondition(condition, { ...contact, ...triggerData })) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  private async executeActions(definition: any, contactId: string, triggerData?: any) {
    try {
      const actions = JSON.parse(definition.actions);
      const results = [];
      
      for (const action of actions) {
        const result = await this.executeAction(action, contactId, triggerData);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Failed to execute workflow actions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async executeAction(action: any, contactId: string, triggerData?: any) {
    const { type, config } = action;
    
    switch (type) {
      case 'send_email':
        return await this.executeSendEmailAction(config, contactId);
      case 'send_sms':
        return await this.executeSendSMSAction(config, contactId);
      case 'send_whatsapp':
        return await this.executeSendWhatsAppAction(config, contactId);
      case 'add_to_list':
        return await this.executeAddToListAction(config, contactId);
      case 'remove_from_list':
        return await this.executeRemoveFromListAction(config, contactId);
      case 'update_contact':
        return await this.executeUpdateContactAction(config, contactId);
      case 'wait':
        return await this.executeWaitAction(config);
      case 'webhook':
        return await this.executeWebhookAction(config, contactId, triggerData);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  private async executeSendEmailAction(config: any, contactId: string) {
    // Implement email sending logic
    return { type: 'send_email', status: 'completed', contactId };
  }

  private async executeSendSMSAction(config: any, contactId: string) {
    // Implement SMS sending logic
    return { type: 'send_sms', status: 'completed', contactId };
  }

  private async executeSendWhatsAppAction(config: any, contactId: string) {
    // Implement WhatsApp sending logic
    return { type: 'send_whatsapp', status: 'completed', contactId };
  }

  private async executeAddToListAction(config: any, contactId: string) {
    // Implement add to list logic
    return { type: 'add_to_list', status: 'completed', contactId };
  }

  private async executeRemoveFromListAction(config: any, contactId: string) {
    // Implement remove from list logic
    return { type: 'remove_from_list', status: 'completed', contactId };
  }

  private async executeUpdateContactAction(config: any, contactId: string) {
    // Implement contact update logic
    return { type: 'update_contact', status: 'completed', contactId };
  }

  private async executeWaitAction(config: any) {
    // Implement wait logic
    return { type: 'wait', status: 'completed' };
  }

  private async executeWebhookAction(config: any, contactId: string, triggerData?: any) {
    // Implement webhook execution logic
    return { type: 'webhook', status: 'completed', contactId };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}