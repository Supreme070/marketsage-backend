import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UnifiedCampaignService } from './unified-campaign.service';
import { CampaignABTestService } from './campaign-abtest.service';
import { CampaignWorkflowService } from './campaign-workflow.service';
import { 
  CreateUnifiedCampaignDto, 
  UpdateUnifiedCampaignDto,
  CreateABTestDto,
  CreateABTestVariantDto,
  UpdateABTestDto,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  CampaignQueryDto,
  CampaignAnalyticsQueryDto,
  SendCampaignDto,
  ScheduleCampaignDto
} from './dto/campaigns.dto';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(
    private readonly unifiedCampaignService: UnifiedCampaignService,
    private readonly abTestService: CampaignABTestService,
    private readonly workflowService: CampaignWorkflowService,
  ) {}

  // ==================== UNIFIED CAMPAIGNS ====================

  @Post()
  async createCampaign(
    @Body() data: CreateUnifiedCampaignDto,
    @Request() req: any,
  ) {
    return this.unifiedCampaignService.createUnifiedCampaign(
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get()
  async getCampaigns(
    @Query() query: CampaignQueryDto,
    @Request() req: any,
  ) {
    return this.unifiedCampaignService.getUnifiedCampaigns(
      query, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get(':id')
  async getCampaignById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.unifiedCampaignService.getUnifiedCampaignById(
      id, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post(':id/send')
  async sendCampaign(
    @Param('id') id: string,
    @Body() data: SendCampaignDto,
    @Request() req: any,
  ) {
    return this.unifiedCampaignService.sendUnifiedCampaign(
      id, 
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post(':id/duplicate')
  async duplicateCampaign(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.unifiedCampaignService.duplicateUnifiedCampaign(
      id, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Delete(':id')
  async deleteCampaign(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.unifiedCampaignService.deleteUnifiedCampaign(
      id, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get(':id/analytics')
  async getCampaignAnalytics(
    @Param('id') id: string,
    @Query() query: CampaignAnalyticsQueryDto,
    @Request() req: any,
  ) {
    return this.unifiedCampaignService.getUnifiedCampaignAnalytics(
      id, 
      query, 
      req.user.id, 
      req.user.organizationId
    );
  }

  // ==================== A/B TESTING ====================

  @Post(':id/ab-tests')
  async createABTest(
    @Param('id') campaignId: string,
    @Body() data: CreateABTestDto,
    @Request() req: any,
  ) {
    return this.abTestService.createABTest(
      campaignId, 
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get(':id/ab-tests')
  async getABTests(
    @Param('id') campaignId: string,
    @Request() req: any,
  ) {
    return this.abTestService.getABTests(
      campaignId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get('ab-tests/:abTestId')
  async getABTestById(
    @Param('abTestId') abTestId: string,
    @Request() req: any,
  ) {
    return this.abTestService.getABTestById(
      abTestId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Put('ab-tests/:abTestId')
  async updateABTest(
    @Param('abTestId') abTestId: string,
    @Body() data: UpdateABTestDto,
    @Request() req: any,
  ) {
    return this.abTestService.updateABTest(
      abTestId, 
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Delete('ab-tests/:abTestId')
  async deleteABTest(
    @Param('abTestId') abTestId: string,
    @Request() req: any,
  ) {
    return this.abTestService.deleteABTest(
      abTestId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post('ab-tests/:abTestId/start')
  async startABTest(
    @Param('abTestId') abTestId: string,
    @Request() req: any,
  ) {
    return this.abTestService.startABTest(
      abTestId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post('ab-tests/:abTestId/pause')
  async pauseABTest(
    @Param('abTestId') abTestId: string,
    @Request() req: any,
  ) {
    return this.abTestService.pauseABTest(
      abTestId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post('ab-tests/:abTestId/complete')
  async completeABTest(
    @Param('abTestId') abTestId: string,
    @Request() req: any,
  ) {
    return this.abTestService.completeABTest(
      abTestId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get('ab-tests/:abTestId/analytics')
  async getABTestAnalytics(
    @Param('abTestId') abTestId: string,
    @Request() req: any,
  ) {
    return this.abTestService.getABTestAnalytics(
      abTestId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  // ==================== A/B TEST VARIANTS ====================

  @Post('ab-tests/:abTestId/variants')
  async createVariant(
    @Param('abTestId') abTestId: string,
    @Body() data: CreateABTestVariantDto,
    @Request() req: any,
  ) {
    return this.abTestService.createVariant(
      abTestId, 
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get('ab-tests/:abTestId/variants')
  async getVariants(
    @Param('abTestId') abTestId: string,
    @Request() req: any,
  ) {
    return this.abTestService.getVariants(
      abTestId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Put('variants/:variantId')
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() data: Partial<CreateABTestVariantDto>,
    @Request() req: any,
  ) {
    return this.abTestService.updateVariant(
      variantId, 
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Delete('variants/:variantId')
  async deleteVariant(
    @Param('variantId') variantId: string,
    @Request() req: any,
  ) {
    return this.abTestService.deleteVariant(
      variantId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  // ==================== WORKFLOWS ====================

  @Post(':id/workflows')
  async createWorkflow(
    @Param('id') campaignId: string,
    @Body() data: CreateWorkflowDto,
    @Request() req: any,
  ) {
    return this.workflowService.createWorkflow(
      campaignId, 
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get(':id/workflows')
  async getWorkflows(
    @Param('id') campaignId: string,
    @Request() req: any,
  ) {
    return this.workflowService.getWorkflows(
      campaignId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get('workflows/:workflowId')
  async getWorkflowById(
    @Param('workflowId') workflowId: string,
    @Request() req: any,
  ) {
    return this.workflowService.getWorkflowById(
      workflowId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Put('workflows/:workflowId')
  async updateWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() data: UpdateWorkflowDto,
    @Request() req: any,
  ) {
    return this.workflowService.updateWorkflow(
      workflowId, 
      data, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Delete('workflows/:workflowId')
  async deleteWorkflow(
    @Param('workflowId') workflowId: string,
    @Request() req: any,
  ) {
    return this.workflowService.deleteWorkflow(
      workflowId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post('workflows/:workflowId/activate')
  async activateWorkflow(
    @Param('workflowId') workflowId: string,
    @Request() req: any,
  ) {
    return this.workflowService.activateWorkflow(
      workflowId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post('workflows/:workflowId/deactivate')
  async deactivateWorkflow(
    @Param('workflowId') workflowId: string,
    @Request() req: any,
  ) {
    return this.workflowService.deactivateWorkflow(
      workflowId, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Post('workflows/:workflowId/execute')
  async executeWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() data: { contactId: string; triggerData?: any },
    @Request() req: any,
  ) {
    return this.workflowService.executeWorkflow(
      workflowId, 
      data.contactId, 
      data.triggerData
    );
  }

  @Get('workflows/:workflowId/executions')
  async getWorkflowExecutions(
    @Param('workflowId') workflowId: string,
    @Query() query: any,
    @Request() req: any,
  ) {
    return this.workflowService.getWorkflowExecutions(
      workflowId, 
      query, 
      req.user.id, 
      req.user.organizationId
    );
  }

  @Get('workflows/:workflowId/analytics')
  async getWorkflowAnalytics(
    @Param('workflowId') workflowId: string,
    @Request() req: any,
  ) {
    return this.workflowService.getWorkflowAnalytics(
      workflowId, 
      req.user.id, 
      req.user.organizationId
    );
  }
}