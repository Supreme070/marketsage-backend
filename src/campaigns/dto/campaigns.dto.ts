import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsBoolean, IsDateString, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// Enums
export enum CampaignType {
  EMAIL_ONLY = 'EMAIL_ONLY',
  SMS_ONLY = 'SMS_ONLY',
  WHATSAPP_ONLY = 'WHATSAPP_ONLY',
  MULTI_CHANNEL = 'MULTI_CHANNEL',
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
}

export enum ChannelType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export enum RecurrenceType {
  ONE_TIME = 'ONE_TIME',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

export enum ABTestStatus {
  DRAFT = 'DRAFT',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

export enum WinnerCriteria {
  HIGHEST_OPEN_RATE = 'HIGHEST_OPEN_RATE',
  HIGHEST_CLICK_RATE = 'HIGHEST_CLICK_RATE',
  HIGHEST_REPLY_RATE = 'HIGHEST_REPLY_RATE',
  HIGHEST_CONVERSION_RATE = 'HIGHEST_CONVERSION_RATE',
  LOWEST_COST_PER_CONVERSION = 'LOWEST_COST_PER_CONVERSION',
  HIGHEST_REVENUE = 'HIGHEST_REVENUE',
}

export enum VariantType {
  CONTENT = 'CONTENT',
  SUBJECT = 'SUBJECT',
  SENDER = 'SENDER',
  TIMING = 'TIMING',
  CHANNEL = 'CHANNEL',
  AUDIENCE = 'AUDIENCE',
  CREATIVE = 'CREATIVE',
}

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export enum TriggerType {
  TIME_BASED = 'TIME_BASED',
  EVENT_BASED = 'EVENT_BASED',
  CONDITION_BASED = 'CONDITION_BASED',
  MANUAL = 'MANUAL',
  API_TRIGGER = 'API_TRIGGER',
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// Channel Configuration DTOs
export class EmailConfigDto {
  @IsString()
  subject?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  replyTo?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  design?: string; // JSON string
}

export class SMSConfigDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  from?: string;
}

export class WhatsAppConfigDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  messageType?: string;
}

// Main Campaign DTOs
export class CreateUnifiedCampaignDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @IsArray()
  @IsEnum(ChannelType, { each: true })
  @IsOptional()
  channels?: ChannelType[];

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  priority?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  budget?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  costPerMessage?: number;

  @IsEnum(RecurrenceType)
  @IsOptional()
  recurrence?: RecurrenceType;

  @IsString()
  @IsOptional()
  recurrenceData?: string; // JSON string

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  segmentIds?: string[];

  @IsDateString()
  @IsOptional()
  scheduledFor?: string;

  // Channel-specific configurations
  @ValidateNested()
  @Type(() => EmailConfigDto)
  @IsOptional()
  emailConfig?: EmailConfigDto;

  @ValidateNested()
  @Type(() => SMSConfigDto)
  @IsOptional()
  smsConfig?: SMSConfigDto;

  @ValidateNested()
  @Type(() => WhatsAppConfigDto)
  @IsOptional()
  whatsappConfig?: WhatsAppConfigDto;
}

export class UpdateUnifiedCampaignDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @IsArray()
  @IsEnum(ChannelType, { each: true })
  @IsOptional()
  channels?: ChannelType[];

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  priority?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  budget?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  costPerMessage?: number;

  @IsEnum(RecurrenceType)
  @IsOptional()
  recurrence?: RecurrenceType;

  @IsString()
  @IsOptional()
  recurrenceData?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  segmentIds?: string[];

  @IsDateString()
  @IsOptional()
  scheduledFor?: string;
}

// A/B Testing DTOs
export class CreateABTestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WinnerCriteria)
  @IsOptional()
  winnerCriteria?: WinnerCriteria;

  @IsNumber()
  @IsOptional()
  @Min(80)
  @Max(99.9)
  confidenceLevel?: number;

  @IsNumber()
  @IsOptional()
  @Min(100)
  minSampleSize?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class CreateABTestVariantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(VariantType)
  @IsOptional()
  variantType?: VariantType;

  @IsString()
  @IsOptional()
  config?: string; // JSON string

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  weight?: number;

  @IsBoolean()
  @IsOptional()
  isControl?: boolean;
}

export class UpdateABTestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ABTestStatus)
  @IsOptional()
  status?: ABTestStatus;

  @IsEnum(WinnerCriteria)
  @IsOptional()
  winnerCriteria?: WinnerCriteria;

  @IsNumber()
  @IsOptional()
  @Min(80)
  @Max(99.9)
  confidenceLevel?: number;

  @IsNumber()
  @IsOptional()
  @Min(100)
  minSampleSize?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

// Workflow DTOs
export class CreateWorkflowDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TriggerType)
  @IsOptional()
  triggerType?: TriggerType;

  @IsString()
  @IsOptional()
  triggerConfig?: string; // JSON string

  @IsString()
  @IsOptional()
  conditions?: string; // JSON string

  @IsString()
  @IsOptional()
  actions?: string; // JSON string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateWorkflowDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WorkflowStatus)
  @IsOptional()
  status?: WorkflowStatus;

  @IsEnum(TriggerType)
  @IsOptional()
  triggerType?: TriggerType;

  @IsString()
  @IsOptional()
  triggerConfig?: string;

  @IsString()
  @IsOptional()
  conditions?: string;

  @IsString()
  @IsOptional()
  actions?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// Query DTOs
export class CampaignQueryDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;

  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @IsString()
  @IsOptional()
  search?: string;
}

export class CampaignAnalyticsQueryDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class SendCampaignDto {
  @IsDateString()
  @IsOptional()
  scheduledFor?: string;
}

export class ScheduleCampaignDto {
  @IsDateString()
  @IsOptional()
  scheduledFor?: string;
}
