import { IsString, IsOptional, IsArray, IsObject, IsNumber, IsBoolean, IsEnum, MaxLength, Min, Max } from 'class-validator';

// Base AI Request DTOs
export class ChatMessageDto {
  @IsString()
  @MaxLength(4000)
  message!: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsArray()
  history?: Array<{ role: string; content: string }>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AnalysisRequestDto {
  @IsString()
  type!: 'customer' | 'campaign' | 'market' | 'performance' | 'sentiment' | 'competitor' | 'trend';

  @IsObject()
  data!: Record<string, any>;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;
}

export class PredictionRequestDto {
  @IsString()
  type!: 'churn' | 'ltv' | 'conversion' | 'engagement' | 'revenue' | 'demand' | 'risk';

  @IsString()
  targetId!: string;

  @IsOptional()
  @IsObject()
  features?: Record<string, any>;
}

export class ContentGenerationDto {
  @IsString()
  type!: 'email' | 'sms' | 'social' | 'blog' | 'ad' | 'landing' | 'product';

  @IsString()
  @MaxLength(200)
  prompt!: string;

  @IsOptional()
  @IsString()
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive' | 'informative';

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

// Advanced AI DTOs
export class AutonomousSegmentationDto {
  @IsString()
  criteria!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  minSegmentSize?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}

export class CustomerJourneyOptimizationDto {
  @IsString()
  customerId!: string;

  @IsOptional()
  @IsArray()
  touchpoints?: string[];

  @IsOptional()
  @IsObject()
  goals?: Record<string, any>;
}

export class CompetitorAnalysisDto {
  @IsString()
  competitor!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];

  @IsOptional()
  @IsObject()
  timeframe?: Record<string, any>;
}

export class PredictiveAnalyticsDto {
  @IsString()
  modelType!: 'churn' | 'ltv' | 'conversion' | 'engagement' | 'revenue';

  @IsObject()
  inputData!: Record<string, any>;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  forecastDays?: number;
}

export class PersonalizationEngineDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentTypes?: string[];
}

export class BrandReputationDto {
  @IsString()
  brandName!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsObject()
  timeframe?: Record<string, any>;
}

export class RevenueOptimizationDto {
  @IsString()
  strategy!: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  riskTolerance?: number;
}

export class CrossChannelIntelligenceDto {
  @IsArray()
  @IsString({ each: true })
  channels!: string[];

  @IsOptional()
  @IsObject()
  metrics?: Record<string, any>;

  @IsOptional()
  @IsString()
  timeframe?: string;
}

export class CustomerSuccessAutomationDto {
  @IsString()
  customerId!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actions?: string[];

  @IsOptional()
  @IsObject()
  triggers?: Record<string, any>;
}

export class SEOContentMarketingDto {
  @IsString()
  topic!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsString()
  targetAudience?: string;
}

export class SocialMediaManagementDto {
  @IsString()
  platform!: string;

  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;
}

export class MultimodalIntelligenceDto {
  @IsString()
  type!: 'image' | 'video' | 'audio' | 'text' | 'mixed';

  @IsObject()
  data!: Record<string, any>;

  @IsOptional()
  @IsString()
  analysisType?: string;
}

export class FederatedLearningDto {
  @IsString()
  modelId!: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  privacyMode?: boolean;
}

export class AutonomousExecutionDto {
  @IsString()
  taskType!: string;

  @IsObject()
  parameters!: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  requireApproval?: boolean;
}

export class PerformanceMonitoringDto {
  @IsString()
  metricType!: string;

  @IsOptional()
  @IsObject()
  thresholds?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alerts?: string[];
}

export class GovernanceDto {
  @IsString()
  policyType!: string;

  @IsOptional()
  @IsObject()
  rules?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  enforceCompliance?: boolean;
}

export class ErrorHandlingDto {
  @IsString()
  errorType!: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @IsOptional()
  @IsString()
  recoveryStrategy?: string;
}

export class EdgeComputingDto {
  @IsString()
  location!: string;

  @IsOptional()
  @IsObject()
  requirements?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  latencyThreshold?: number;
}

export class DatabaseOptimizationDto {
  @IsString()
  operation!: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  analyzeOnly?: boolean;
}

export class BulkOperationsDto {
  @IsString()
  operationType!: string;

  @IsArray()
  items!: any[];

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;
}

export class DelegationDto {
  @IsString()
  taskId!: string;

  @IsString()
  assigneeId!: string;

  @IsOptional()
  @IsObject()
  instructions?: Record<string, any>;
}

export class ApprovalDto {
  @IsString()
  requestId!: string;

  @IsString()
  @IsEnum(['approve', 'reject', 'pending'])
  status!: 'approve' | 'reject' | 'pending';

  @IsOptional()
  @IsString()
  comments?: string;
}

export class DeploymentDto {
  @IsString()
  environment!: string;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  rollbackOnFailure?: boolean;
}

export class FeedbackDto {
  @IsString()
  feedbackType!: string;

  @IsObject()
  data!: Record<string, any>;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class HealthCheckDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  components?: string[];

  @IsOptional()
  @IsBoolean()
  detailed?: boolean;
}

export class IntegrationDto {
  @IsString()
  integrationType!: string;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  testMode?: boolean;
}

export class MLTrainingDto {
  @IsString()
  modelType!: string;

  @IsObject()
  trainingData!: Record<string, any>;

  @IsOptional()
  @IsObject()
  hyperparameters?: Record<string, any>;
}

export class PermissionsDto {
  @IsString()
  userId!: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];

  @IsOptional()
  @IsString()
  resource?: string;
}

export class QueueDto {
  @IsString()
  queueName!: string;

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  priority?: number;
}

export class RAGDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sources?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxResults?: number;
}

export class ReportsDto {
  @IsString()
  reportType!: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsString()
  format?: 'pdf' | 'excel' | 'csv' | 'json';
}

export class StrategicDto {
  @IsString()
  strategyType!: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;
}

export class TestingDto {
  @IsString()
  testType!: string;

  @IsObject()
  testData!: Record<string, any>;

  @IsOptional()
  @IsObject()
  expectedResults?: Record<string, any>;
}

export class WorkflowDto {
  @IsString()
  workflowType!: string;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  autoExecute?: boolean;
}
