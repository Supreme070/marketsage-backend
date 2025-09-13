import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsObject, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum FormStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum FormLayout {
  SINGLE_COLUMN = 'SINGLE_COLUMN',
  TWO_COLUMN = 'TWO_COLUMN',
  MULTI_COLUMN = 'MULTI_COLUMN'
}

export enum FormFieldType {
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  NUMBER = 'NUMBER',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  DATE = 'DATE',
  FILE = 'FILE',
  URL = 'URL'
}

export enum FormFieldWidth {
  FULL = 'FULL',
  HALF = 'HALF',
  THIRD = 'THIRD',
  QUARTER = 'QUARTER'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  SPAM = 'SPAM',
  DUPLICATE = 'DUPLICATE',
  FAILED = 'FAILED'
}

export class CreateFormFieldDto {
  @IsEnum(FormFieldType)
  type!: FormFieldType;

  @IsString()
  name!: string;

  @IsString()
  label!: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  helpText?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsObject()
  validation?: Record<string, any>;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsEnum(FormFieldWidth)
  width?: FormFieldWidth;

  @IsOptional()
  @IsString()
  cssClasses?: string;

  @IsOptional()
  @IsObject()
  conditionalLogic?: Record<string, any>;
}

export class CreateFormDto {
  @IsString()
  name!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;

  @IsOptional()
  @IsObject()
  theme?: Record<string, any>;

  @IsOptional()
  @IsEnum(FormLayout)
  layout?: FormLayout;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @IsOptional()
  @IsString()
  submitButtonText?: string;

  @IsOptional()
  @IsString()
  successMessage?: string;

  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormFieldDto)
  fields?: CreateFormFieldDto[];
}

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;

  @IsOptional()
  @IsObject()
  theme?: Record<string, any>;

  @IsOptional()
  @IsEnum(FormLayout)
  layout?: FormLayout;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @IsOptional()
  @IsString()
  submitButtonText?: string;

  @IsOptional()
  @IsString()
  successMessage?: string;

  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class FormSubmissionDto {
  @IsString()
  formId!: string;

  @IsOptional()
  @IsString()
  visitorId?: string;

  @IsObject()
  data!: Record<string, any>;

  @IsOptional()
  @IsObject()
  context?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referrer?: string;
  };
}

export class FormQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

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
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class SubmissionQueryDto {
  @IsOptional()
  @IsString()
  formId?: string;

  @IsOptional()
  @IsString()
  visitorId?: string;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

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
  sortBy?: string = 'submittedAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
