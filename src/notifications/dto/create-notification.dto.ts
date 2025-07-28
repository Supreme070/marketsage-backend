import { IsString, IsOptional, IsObject, IsEnum, MaxLength } from 'class-validator';

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export enum NotificationCategory {
  SYSTEM = 'SYSTEM',
  CAMPAIGN = 'CAMPAIGN',
  BILLING = 'BILLING',
  SECURITY = 'SECURITY',
  GENERAL = 'GENERAL',
}

export class CreateNotificationDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(1000)
  message!: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}