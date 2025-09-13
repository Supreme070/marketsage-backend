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
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  CreateEmailCampaignDto, 
  UpdateEmailCampaignDto, 
  EmailCampaignQueryDto,
  SendEmailCampaignDto,
  EmailCampaignAnalyticsDto,
} from './dto/email-campaign.dto';
import { 
  CreateEmailTemplateDto, 
  UpdateEmailTemplateDto, 
  EmailTemplateQueryDto,
} from './dto/email-template.dto';
import { 
  CreateEmailProviderDto, 
  UpdateEmailProviderDto, 
  TestEmailProviderDto,
} from './dto/email-provider.dto';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // ==================== EMAIL CAMPAIGNS ====================

  @Post('campaigns')
  async createCampaign(
    @Body() data: CreateEmailCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.emailService.createCampaign(data, userId, organizationId);
  }

  @Get('campaigns')
  async getCampaigns(
    @Query() query: EmailCampaignQueryDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.emailService.getCampaigns(query, userId, organizationId);
  }

  @Get('campaigns/:id')
  async getCampaignById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.emailService.getCampaignById(id, userId, organizationId);
  }

  @Put('campaigns/:id')
  async updateCampaign(
    @Param('id') id: string,
    @Body() data: UpdateEmailCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.emailService.updateCampaign(id, data, userId, organizationId);
  }

  @Delete('campaigns/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCampaign(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.emailService.deleteCampaign(id, userId, organizationId);
  }

  @Post('campaigns/:id/send')
  async sendCampaign(
    @Param('id') id: string,
    @Body() data: SendEmailCampaignDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.emailService.sendCampaign(id, data, userId, organizationId);
  }

  @Get('campaigns/:id/analytics')
  async getCampaignAnalytics(
    @Param('id') id: string,
    @Query() query: EmailCampaignAnalyticsDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    
    return this.emailService.getCampaignAnalytics(id, query, userId, organizationId);
  }

  // ==================== EMAIL TEMPLATES ====================

  @Post('templates')
  async createTemplate(
    @Body() data: CreateEmailTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.emailService.createTemplate(data, userId);
  }

  @Get('templates')
  async getTemplates(
    @Query() query: EmailTemplateQueryDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.emailService.getTemplates(query, userId);
  }

  @Get('templates/:id')
  async getTemplateById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.emailService.getTemplateById(id, userId);
  }

  @Put('templates/:id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() data: UpdateEmailTemplateDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.emailService.updateTemplate(id, data, userId);
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTemplate(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    
    return this.emailService.deleteTemplate(id, userId);
  }

  // ==================== EMAIL PROVIDERS ====================

  @Post('providers')
  async createProvider(
    @Body() data: CreateEmailProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.emailService.createProvider(data, organizationId);
  }

  @Get('providers')
  async getProviders(@Request() req: any) {
    const organizationId = req.user.organizationId;
    
    return this.emailService.getProviders(organizationId);
  }

  @Get('providers/:id')
  async getProviderById(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.emailService.getProviderById(id, organizationId);
  }

  @Put('providers/:id')
  async updateProvider(
    @Param('id') id: string,
    @Body() data: UpdateEmailProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.emailService.updateProvider(id, data, organizationId);
  }

  @Delete('providers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProvider(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.emailService.deleteProvider(id, organizationId);
  }

  @Post('providers/:id/test')
  async testProvider(
    @Param('id') id: string,
    @Body() data: TestEmailProviderDto,
    @Request() req: any,
  ) {
    const organizationId = req.user.organizationId;
    
    return this.emailService.testProvider(id, data, organizationId);
  }

  // ==================== EMAIL TRACKING ====================

  @Post('track/:campaignId/:contactId/:type')
  async trackActivity(
    @Param('campaignId') campaignId: string,
    @Param('contactId') contactId: string,
    @Param('type') type: string,
    @Body() metadata?: any,
  ) {
    return this.emailService.trackEmailActivity(campaignId, contactId, type, metadata);
  }

  @Post('unsubscribe/:contactId')
  async unsubscribeContact(
    @Param('contactId') contactId: string,
    @Body() body?: { campaignId?: string },
  ) {
    return this.emailService.unsubscribeContact(contactId, body?.campaignId);
  }
}
