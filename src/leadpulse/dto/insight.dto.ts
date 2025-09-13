import { IsString, IsOptional, IsEnum, IsInt, IsObject, IsArray, Min, Max } from 'class-validator';

export enum LeadPulseInsightType {
  BEHAVIOR = 'BEHAVIOR',
  PREDICTION = 'PREDICTION',
  OPPORTUNITY = 'OPPORTUNITY',
  TREND = 'TREND'
}

export enum LeadPulseImportance {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class CreateInsightDto {
  @IsEnum(LeadPulseInsightType)
  type!: LeadPulseInsightType;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsEnum(LeadPulseImportance)
  importance!: LeadPulseImportance;

  @IsOptional()
  @IsObject()
  metric?: Record<string, any>;

  @IsOptional()
  @IsString()
  recommendation?: string;
}

export class InsightQueryDto {
  @IsOptional()
  @IsEnum(LeadPulseInsightType)
  type?: LeadPulseInsightType;

  @IsOptional()
  @IsEnum(LeadPulseImportance)
  importance?: LeadPulseImportance;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class GenerateInsightDto {
  @IsString()
  trigger!: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
