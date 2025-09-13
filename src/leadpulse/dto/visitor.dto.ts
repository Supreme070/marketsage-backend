import { IsString, IsOptional, IsObject, IsInt, Min, Max } from 'class-validator';

export class CreateVisitorDto {
  @IsString()
  fingerprint!: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  @IsString()
  utmSource?: string;

  @IsOptional()
  @IsString()
  utmMedium?: string;

  @IsOptional()
  @IsString()
  utmCampaign?: string;
}

export class VisitorQueryDto {
  @IsOptional()
  @IsString()
  fingerprint?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'lastVisit';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class CreateTouchpointDto {
  @IsOptional()
  @IsString()
  visitorId?: string;

  @IsOptional()
  @IsString()
  anonymousVisitorId?: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsInt()
  value?: number = 1;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
