import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { DomainWhitelistGuard } from '../../auth/guards/domain-whitelist.guard';
import { LeadPulseService } from '../services/leadpulse.service';
import { CreateFormDto, UpdateFormDto, FormQueryDto, FormSubmissionDto, SubmissionQueryDto } from '../dto/form.dto';
import { CreateInsightDto, InsightQueryDto, GenerateInsightDto } from '../dto/insight.dto';
import { CreateVisitorDto, VisitorQueryDto, CreateTouchpointDto } from '../dto/visitor.dto';

interface AuthenticatedRequest {
  user: {
    id: string;
    organizationId: string;
  };
}

interface ApiKeyRequest extends Request {
  organization: {
    id: string;
    name: string;
  };
  apiKey: {
    id: string;
    key: string;
  };
  headers: any;
  connection: any;
}

@Controller('leadpulse')
export class LeadPulseController {
  constructor(private readonly leadPulseService: LeadPulseService) {}

  // ==================== FORM MANAGEMENT ====================

  @UseGuards(JwtAuthGuard)
  @Post('forms')
  async createForm(@Request() req: AuthenticatedRequest, @Body() createFormDto: CreateFormDto) {
    return this.leadPulseService.createForm(req.user.id, req.user.organizationId, createFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('forms')
  async getForms(@Request() req: AuthenticatedRequest, @Query() query: FormQueryDto) {
    return this.leadPulseService.getForms(req.user.organizationId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('forms/:id')
  async getFormById(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leadPulseService.getFormById(id, req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('forms/:id')
  async updateForm(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto
  ) {
    return this.leadPulseService.updateForm(id, req.user.organizationId, updateFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('forms/:id')
  async deleteForm(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leadPulseService.deleteForm(id, req.user.organizationId);
  }

  // ==================== FORM SUBMISSIONS ====================

  @UseGuards(ApiKeyGuard, DomainWhitelistGuard)
  @Post('forms/submit')
  async submitForm(
    @Body() submissionDto: FormSubmissionDto,
    @Request() req: ApiKeyRequest
  ) {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return this.leadPulseService.submitForm(submissionDto, ipAddress, userAgent, undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get('submissions')
  async getSubmissions(@Request() req: AuthenticatedRequest, @Query() query: SubmissionQueryDto) {
    return this.leadPulseService.getSubmissions(req.user.organizationId, query);
  }

  // ==================== VISITOR MANAGEMENT ====================

  @UseGuards(ApiKeyGuard, DomainWhitelistGuard)
  @Post('visitors')
  async createVisitor(@Body() createVisitorDto: CreateVisitorDto) {
    return this.leadPulseService.createVisitor(createVisitorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('visitors')
  async getVisitors(@Query() query: VisitorQueryDto) {
    return this.leadPulseService.getVisitors(query);
  }

  @UseGuards(ApiKeyGuard, DomainWhitelistGuard)
  @Post('touchpoints')
  async createTouchpoint(@Body() createTouchpointDto: CreateTouchpointDto) {
    return this.leadPulseService.createTouchpoint(createTouchpointDto);
  }

  // ==================== INSIGHTS ====================

  @UseGuards(JwtAuthGuard)
  @Post('insights')
  async createInsight(@Body() createInsightDto: CreateInsightDto) {
    return this.leadPulseService.createInsight(createInsightDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('insights')
  async getInsights(@Query() query: InsightQueryDto) {
    return this.leadPulseService.getInsights(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('insights/generate')
  async generateInsight(@Body() generateInsightDto: GenerateInsightDto) {
    return this.leadPulseService.generateInsight(generateInsightDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('insights/:id')
  async deleteInsight(@Param('id') id: string) {
    return this.leadPulseService.deleteInsight(id);
  }
}
