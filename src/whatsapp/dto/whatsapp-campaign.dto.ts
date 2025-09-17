import { IsString, IsOptional, IsArray, IsEnum, IsDateString, IsBoolean, IsInt, Min, Max, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

export enum ActivityType {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export enum WATemplateStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum WhatsAppMessageType {
  TEXT = 'text',
  TEMPLATE = 'template',
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  LOCATION = 'location',
  CONTACT = 'contact',
  INTERACTIVE = 'interactive',
}

// ==================== WHATSAPP CAMPAIGN DTOs ====================

export class CreateWhatsAppCampaignDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  from!: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  listIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  segmentIds?: string[];

  @IsOptional()
  @IsEnum(WhatsAppMessageType)
  messageType?: WhatsAppMessageType;

  @IsOptional()
  @IsObject()
  mediaData?: {
    type: 'image' | 'document' | 'video' | 'audio';
    url: string;
    filename?: string;
    caption?: string;
  };

  @IsOptional()
  @IsObject()
  interactiveData?: {
    type: 'button' | 'list' | 'catalog';
    header?: { type: string; text?: string; media?: { type: string; link: string } };
    body: { text: string };
    footer?: { text: string };
    action: any;
  };
}

export class UpdateWhatsAppCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  listIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  segmentIds?: string[];

  @IsOptional()
  @IsEnum(WhatsAppMessageType)
  messageType?: WhatsAppMessageType;

  @IsOptional()
  @IsObject()
  mediaData?: {
    type: 'image' | 'document' | 'video' | 'audio';
    url: string;
    filename?: string;
    caption?: string;
  };

  @IsOptional()
  @IsObject()
  interactiveData?: {
    type: 'button' | 'list' | 'catalog';
    header?: { type: string; text?: string; media?: { type: string; link: string } };
    body: { text: string };
    footer?: { text: string };
    action: any;
  };
}

export class WhatsAppCampaignQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class SendWhatsAppCampaignDto {
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @IsOptional()
  @IsBoolean()
  testMode?: boolean = false;
}

export class WhatsAppCampaignAnalyticsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

// ==================== WHATSAPP TEMPLATE DTOs ====================

export class CreateWhatsAppTemplateDto {
  @IsString()
  name!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(WATemplateStatus)
  status?: WATemplateStatus;

  @IsOptional()
  @IsString()
  templateName?: string; // WhatsApp template name for Meta API

  @IsOptional()
  @IsString()
  language?: string; // Template language code

  @IsOptional()
  @IsObject()
  components?: any; // WhatsApp template components
}

export class UpdateWhatsAppTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(WATemplateStatus)
  status?: WATemplateStatus;

  @IsOptional()
  @IsString()
  templateName?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsObject()
  components?: any;
}

export class WhatsAppTemplateQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(WATemplateStatus)
  status?: WATemplateStatus;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// ==================== WHATSAPP PROVIDER DTOs ====================

export class CreateWhatsAppProviderDto {
  @IsString()
  businessAccountId!: string;

  @IsString()
  phoneNumberId!: string;

  @IsString()
  accessToken!: string;

  @IsString()
  webhookUrl!: string;

  @IsString()
  verifyToken!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = false;
}

export class UpdateWhatsAppProviderDto {
  @IsOptional()
  @IsString()
  businessAccountId?: string;

  @IsOptional()
  @IsString()
  phoneNumberId?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsString()
  verifyToken?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  verificationStatus?: string;
}

export class TestWhatsAppProviderDto {
  @IsString()
  testPhoneNumber!: string;

  @IsOptional()
  @IsString()
  testMessage?: string = 'Test WhatsApp message from MarketSage';
}

// ==================== WHATSAPP TEMPLATE SUBMISSION DTOs ====================

export class SubmitWhatsAppTemplateDto {
  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsString()
  language!: string;

  @IsObject()
  components!: any;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ApproveWhatsAppTemplateDto {
  @IsString()
  templateId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectWhatsAppTemplateDto {
  @IsString()
  templateId!: string;

  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
