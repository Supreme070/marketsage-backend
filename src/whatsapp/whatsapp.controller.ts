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
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  CreateWhatsAppCampaignDto, 
  UpdateWhatsAppCampaignDto, 
  WhatsAppCampaignQueryDto,
  SendWhatsAppCampaignDto,
  WhatsAppCampaignAnalyticsDto,
} from './dto/whatsapp-campaign.dto';
import { 
  CreateWhatsAppTemplateDto, 
  UpdateWhatsAppTemplateDto, 
  WhatsAppTemplateQueryDto,
  SubmitWhatsAppTemplateDto,
  ApproveWhatsAppTemplateDto,
  RejectWhatsAppTemplateDto,
} from './dto/whatsapp-campaign.dto';
import { 
  CreateWhatsAppProviderDto, 
  UpdateWhatsAppProviderDto, 
  TestWhatsAppProviderDto,
} from './dto/whatsapp-campaign.dto';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  // ==================== WHATSAPP CAMPAIGNS ====================

  @Post('campaigns')
  async createCampaign(
    @Body() data: CreateWhatsAppCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.createCampaign(data, userId, organizationId);
  }

  @Get('campaigns')
  async getCampaigns(
    @Query() query: WhatsAppCampaignQueryDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.getCampaigns(query, userId, organizationId);
  }

  @Get('campaigns/:id')
  async getCampaignById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.getCampaignById(id, userId, organizationId);
  }

  @Put('campaigns/:id')
  async updateCampaign(
    @Param('id') id: string,
    @Body() data: UpdateWhatsAppCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.updateCampaign(id, data, userId, organizationId);
  }

  @Delete('campaigns/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCampaign(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.deleteCampaign(id, userId, organizationId);
  }

  @Post('campaigns/:id/duplicate')
  async duplicateCampaign(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.duplicateCampaign(id, userId, organizationId);
  }

  @Post('campaigns/:id/send')
  async sendCampaign(
    @Param('id') id: string,
    @Body() data: SendWhatsAppCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.sendCampaign(id, data, userId, organizationId);
  }

  @Get('campaigns/:id/analytics')
  async getCampaignAnalytics(
    @Param('id') id: string,
    @Query() query: WhatsAppCampaignAnalyticsDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.getCampaignAnalytics(id, query, userId, organizationId);
  }

  // ==================== WHATSAPP TEMPLATES ====================

  @Post('templates')
  async createTemplate(
    @Body() data: CreateWhatsAppTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.whatsappService.createTemplate(data, userId);
  }

  @Get('templates')
  async getTemplates(
    @Query() query: WhatsAppTemplateQueryDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.whatsappService.getTemplates(query, userId);
  }

  @Get('templates/:id')
  async getTemplateById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.whatsappService.getTemplateById(id, userId);
  }

  @Put('templates/:id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() data: UpdateWhatsAppTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.whatsappService.updateTemplate(id, data, userId);
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTemplate(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.whatsappService.deleteTemplate(id, userId);
  }

  @Post('templates/submit')
  async submitTemplate(
    @Body() data: SubmitWhatsAppTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.submitTemplate(data, userId, organizationId);
  }

  @Post('templates/:id/approve')
  async approveTemplate(
    @Param('id') id: string,
    @Body() data: ApproveWhatsAppTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.whatsappService.approveTemplate(id, data, userId);
  }

  @Post('templates/:id/reject')
  async rejectTemplate(
    @Param('id') id: string,
    @Body() data: RejectWhatsAppTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.whatsappService.rejectTemplate(id, data, userId);
  }

  // ==================== WHATSAPP PROVIDERS ====================

  @Post('providers')
  async createProvider(
    @Body() data: CreateWhatsAppProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.createProvider(data, organizationId);
  }

  @Get('providers')
  async getProviders(@Request() req: any) {
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.getProviders(organizationId);
  }

  @Get('providers/:id')
  async getProviderById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.getProviderById(id, organizationId);
  }

  @Put('providers/:id')
  async updateProvider(
    @Param('id') id: string,
    @Body() data: UpdateWhatsAppProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.updateProvider(id, data, organizationId);
  }

  @Delete('providers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProvider(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.deleteProvider(id, organizationId);
  }

  @Post('providers/:id/test')
  async testProvider(
    @Param('id') id: string,
    @Body() data: TestWhatsAppProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.whatsappService.testProvider(id, data, organizationId);
  }

  // ==================== WHATSAPP TRACKING ====================

  @Post('track/:campaignId/:contactId/:type')
  async trackActivity(
    @Param('campaignId') campaignId: string,
    @Param('contactId') contactId: string,
    @Param('type') type: string,
    @Body() metadata?: any,
  ) {
    return this.whatsappService.trackWhatsAppActivity(campaignId, contactId, type, metadata);
  }

  @Post('unsubscribe/:contactId')
  async unsubscribeContact(
    @Param('contactId') contactId: string,
    @Body() body?: { campaignId?: string },
  ) {
    return this.whatsappService.unsubscribeContact(contactId, body?.campaignId);
  }

}