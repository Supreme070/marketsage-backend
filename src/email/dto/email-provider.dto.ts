import { IsString, IsOptional, IsEmail, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export enum EmailProviderType {
  MAILGUN = 'mailgun',
  SENDGRID = 'sendgrid',
  SMTP = 'smtp',
  POSTMARK = 'postmark',
  SES = 'ses',
}

// ==================== EMAIL PROVIDER DTOs ====================

export class CreateEmailProviderDto {
  @IsEnum(EmailProviderType)
  providerType!: EmailProviderType;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  apiSecret?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  // SMTP Configuration
  @IsOptional()
  @IsString()
  smtpHost?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  smtpPort?: number;

  @IsOptional()
  @IsString()
  smtpUsername?: string;

  @IsOptional()
  @IsString()
  smtpPassword?: string;

  @IsOptional()
  @IsBoolean()
  smtpSecure?: boolean = true;

  // Sender Configuration
  @IsEmail()
  fromEmail!: string;

  @IsOptional()
  @IsString()
  fromName?: string;

  @IsOptional()
  @IsEmail()
  replyToEmail?: string;

  // Tracking Configuration
  @IsOptional()
  @IsString()
  trackingDomain?: string;

  @IsOptional()
  @IsBoolean()
  enableTracking?: boolean = true;
}

export class UpdateEmailProviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  apiSecret?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  // SMTP Configuration
  @IsOptional()
  @IsString()
  smtpHost?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  smtpPort?: number;

  @IsOptional()
  @IsString()
  smtpUsername?: string;

  @IsOptional()
  @IsString()
  smtpPassword?: string;

  @IsOptional()
  @IsBoolean()
  smtpSecure?: boolean;

  // Sender Configuration
  @IsOptional()
  @IsEmail()
  fromEmail?: string;

  @IsOptional()
  @IsString()
  fromName?: string;

  @IsOptional()
  @IsEmail()
  replyToEmail?: string;

  // Tracking Configuration
  @IsOptional()
  @IsString()
  trackingDomain?: string;

  @IsOptional()
  @IsBoolean()
  enableTracking?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TestEmailProviderDto {
  @IsEmail()
  testEmail!: string;

  @IsOptional()
  @IsString()
  testSubject?: string = 'Test Email from MarketSage';

  @IsOptional()
  @IsString()
  testContent?: string = 'This is a test email to verify your email provider configuration.';
}
