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
import { SMSService } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  CreateSMSCampaignDto, 
  UpdateSMSCampaignDto, 
  SMSCampaignQueryDto,
  SendSMSCampaignDto,
  SMSCampaignAnalyticsDto,
} from './dto/sms-campaign.dto';
import { 
  CreateSMSTemplateDto, 
  UpdateSMSTemplateDto, 
  SMSTemplateQueryDto,
} from './dto/sms-template.dto';
import { 
  CreateSMSProviderDto, 
  UpdateSMSProviderDto, 
  TestSMSProviderDto,
} from './dto/sms-provider.dto';

@Controller('sms')
@UseGuards(JwtAuthGuard)
export class SMSController {
  constructor(private readonly smsService: SMSService) {}

  // ==================== SMS CAMPAIGNS ====================

  @Post('campaigns')
  async createCampaign(
    @Body() data: CreateSMSCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.createCampaign(data, userId, organizationId);
  }

  @Get('campaigns')
  async getCampaigns(
    @Query() query: SMSCampaignQueryDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.getCampaigns(query, userId, organizationId);
  }

  @Get('campaigns/:id')
  async getCampaignById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.getCampaignById(id, userId, organizationId);
  }

  @Put('campaigns/:id')
  async updateCampaign(
    @Param('id') id: string,
    @Body() data: UpdateSMSCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.updateCampaign(id, data, userId, organizationId);
  }

  @Delete('campaigns/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCampaign(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.deleteCampaign(id, userId, organizationId);
  }

  @Post('campaigns/:id/duplicate')
  async duplicateCampaign(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.duplicateCampaign(id, userId, organizationId);
  }

  @Post('campaigns/:id/send')
  async sendCampaign(
    @Param('id') id: string,
    @Body() data: SendSMSCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.sendCampaign(id, data, userId, organizationId);
  }

  @Get('campaigns/:id/analytics')
  async getCampaignAnalytics(
    @Param('id') id: string,
    @Query() query: SMSCampaignAnalyticsDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.smsService.getCampaignAnalytics(id, query, userId, organizationId);
  }

  // ==================== SMS TEMPLATES ====================

  @Post('templates')
  async createTemplate(
    @Body() data: CreateSMSTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.smsService.createTemplate(data, userId);
  }

  @Get('templates')
  async getTemplates(
    @Query() query: SMSTemplateQueryDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.smsService.getTemplates(query, userId);
  }

  @Get('templates/:id')
  async getTemplateById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.smsService.getTemplateById(id, userId);
  }

  @Put('templates/:id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() data: UpdateSMSTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.smsService.updateTemplate(id, data, userId);
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTemplate(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.smsService.deleteTemplate(id, userId);
  }

  // ==================== SMS PROVIDERS ====================

  @Post('providers')
  async createProvider(
    @Body() data: CreateSMSProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.smsService.createProvider(data, organizationId);
  }

  @Get('providers')
  async getProviders(@Request() req: any) {
    const organizationId = req.user.organizationId;
    
    return this.smsService.getProviders(organizationId);
  }

  @Get('providers/:id')
  async getProviderById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.smsService.getProviderById(id, organizationId);
  }

  @Put('providers/:id')
  async updateProvider(
    @Param('id') id: string,
    @Body() data: UpdateSMSProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.smsService.updateProvider(id, data, organizationId);
  }

  @Delete('providers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProvider(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.smsService.deleteProvider(id, organizationId);
  }

  @Post('providers/:id/test')
  async testProvider(
    @Param('id') id: string,
    @Body() data: TestSMSProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.smsService.testProvider(id, data, organizationId);
  }

  // ==================== SMS TRACKING ====================

  @Post('track/:campaignId/:contactId/:type')
  async trackActivity(
    @Param('campaignId') campaignId: string,
    @Param('contactId') contactId: string,
    @Param('type') type: string,
    @Body() metadata?: any,
  ) {
    return this.smsService.trackSMSActivity(campaignId, contactId, type, metadata);
  }

  @Post('unsubscribe/:contactId')
  async unsubscribeContact(
    @Param('contactId') contactId: string,
    @Body() body?: { campaignId?: string },
  ) {
    return this.smsService.unsubscribeContact(contactId, body?.campaignId);
  }
}
