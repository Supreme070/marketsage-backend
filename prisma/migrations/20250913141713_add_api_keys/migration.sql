-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'IT_ADMIN', 'SUPER_ADMIN', 'AI_AGENT');

-- CreateEnum
CREATE TYPE "ABTestStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ABTestType" AS ENUM ('SIMPLE_AB', 'MULTIVARIATE', 'ELEMENT');

-- CreateEnum
CREATE TYPE "ABTestMetric" AS ENUM ('OPEN_RATE', 'CLICK_RATE', 'CONVERSION_RATE', 'REVENUE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('LOGIN_ATTEMPT', 'FAILED_LOGIN', 'SUSPICIOUS_ACTIVITY', 'RATE_LIMIT_EXCEEDED', 'INVALID_INPUT', 'UNAUTHORIZED_ACCESS', 'DATA_BREACH_ATTEMPT', 'LOGIN_FAILURE', 'PERMISSION_DENIED', 'MALICIOUS_FILE_UPLOAD', 'XSS_ATTEMPT', 'SQL_INJECTION_ATTEMPT', 'PRIVILEGE_ESCALATION', 'MALICIOUS_REQUEST', 'PASSWORD_RESET', 'ACCOUNT_LOCKED', 'API_ABUSE');

-- CreateEnum
CREATE TYPE "SecuritySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DataProcessingType" AS ENUM ('COLLECTION', 'PROCESSING', 'SHARING', 'DELETION', 'ACCESS', 'RECTIFICATION', 'RESTRICTION', 'PORTABILITY');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('MARKETING', 'ANALYTICS', 'FUNCTIONAL', 'NECESSARY', 'THIRD_PARTY_SHARING');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('ACTIVE', 'UNSUBSCRIBED', 'BOUNCED', 'SPAM');

-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('STATIC', 'DYNAMIC');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'UNSUBSCRIBED', 'REPLIED', 'FAILED');

-- CreateEnum
CREATE TYPE "WATemplateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkflowNodeType" AS ENUM ('TRIGGER', 'CONDITION', 'ACTION', 'DELAY', 'EMAIL', 'SMS', 'WHATSAPP', 'NOTIFICATION', 'WEBHOOK', 'API_CALL', 'CRM_ACTION', 'PAYMENT_WEBHOOK', 'DATABASE_ACTION');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('CONTACT_CREATED', 'CONTACT_UPDATED', 'EMAIL_OPENED', 'EMAIL_CLICKED', 'FORM_SUBMITTED', 'WEBHOOK', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('EMAIL_CAMPAIGN', 'SMS_CAMPAIGN', 'WHATSAPP_CAMPAIGN', 'WORKFLOW', 'LIST', 'SEGMENT');

-- CreateEnum
CREATE TYPE "AnalyticsPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('PENDING', 'ACTIVE', 'ERROR', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SmartSegmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentTemplateType" AS ENUM ('EMAIL_SUBJECT', 'EMAIL_BODY', 'SMS_MESSAGE', 'WHATSAPP_MESSAGE', 'PUSH_NOTIFICATION');

-- CreateEnum
CREATE TYPE "ConversionCategory" AS ENUM ('AWARENESS', 'CONSIDERATION', 'CONVERSION', 'RETENTION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ConversionValueType" AS ENUM ('COUNT', 'REVENUE', 'SCORE');

-- CreateEnum
CREATE TYPE "AttributionModel" AS ENUM ('FIRST_TOUCH', 'LAST_TOUCH', 'LINEAR', 'TIME_DECAY', 'POSITION_BASED', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PredictionModelType" AS ENUM ('CHURN', 'LTV', 'CAMPAIGN_PERFORMANCE', 'SEND_TIME', 'OPEN_RATE', 'CLICK_RATE', 'CONVERSION_RATE');

-- CreateEnum
CREATE TYPE "ChurnRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "JourneyStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED', 'PAUSED');

-- CreateEnum
CREATE TYPE "TransitionTriggerType" AS ENUM ('AUTOMATIC', 'EVENT', 'CONVERSION', 'CONDITION', 'MANUAL');

-- CreateEnum
CREATE TYPE "JourneyMetricType" AS ENUM ('CONVERSION_RATE', 'CONTACTS_COUNT', 'DURATION', 'REVENUE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MetricAggregationType" AS ENUM ('SUM', 'AVERAGE', 'COUNT', 'MIN', 'MAX');

-- CreateEnum
CREATE TYPE "LeadPulseTouchpointType" AS ENUM ('PAGEVIEW', 'CLICK', 'FORM_VIEW', 'FORM_START', 'FORM_SUBMIT', 'CONVERSION');

-- CreateEnum
CREATE TYPE "LeadPulseInsightType" AS ENUM ('BEHAVIOR', 'PREDICTION', 'OPPORTUNITY', 'TREND');

-- CreateEnum
CREATE TYPE "LeadPulseImportance" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FormLayout" AS ENUM ('SINGLE_COLUMN', 'TWO_COLUMN', 'MULTI_STEP', 'FLOATING_LABELS');

-- CreateEnum
CREATE TYPE "FormFieldType" AS ENUM ('TEXT', 'EMAIL', 'PHONE', 'NUMBER', 'TEXTAREA', 'SELECT', 'MULTISELECT', 'RADIO', 'CHECKBOX', 'DATE', 'TIME', 'DATETIME', 'FILE', 'HIDDEN', 'HTML', 'DIVIDER');

-- CreateEnum
CREATE TYPE "FormFieldWidth" AS ENUM ('QUARTER', 'THIRD', 'HALF', 'TWO_THIRDS', 'THREE_QUARTERS', 'FULL');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'SPAM', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "LeadQuality" AS ENUM ('UNKNOWN', 'COLD', 'WARM', 'HOT', 'QUALIFIED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED', 'TRIALING');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'BANK', 'USSD', 'BANK_TRANSFER', 'QR', 'MOBILE_MONEY');

-- CreateEnum
CREATE TYPE "WorkflowExecutionStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StepExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "AnalyticsRange" AS ENUM ('HOUR', 'DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR');

-- CreateEnum
CREATE TYPE "WorkflowVersionStatus" AS ENUM ('DRAFT', 'STAGING', 'PRODUCTION', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('DEPLOYING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkflowTemplateCategory" AS ENUM ('WELCOME_SERIES', 'ABANDONED_CART', 'LEAD_NURTURING', 'CUSTOMER_RETENTION', 'RE_ENGAGEMENT', 'EVENT_BASED', 'BIRTHDAY_CAMPAIGNS', 'PRODUCT_LAUNCH', 'EDUCATIONAL_SERIES', 'FEEDBACK_COLLECTION', 'REFERRAL_PROGRAMS', 'SEASONAL_CAMPAIGNS', 'TRANSACTIONAL', 'FINTECH_ONBOARDING', 'PAYMENT_REMINDERS', 'KYC_VERIFICATION', 'LOAN_APPLICATION', 'SAVINGS_GOALS', 'INVESTMENT_ALERTS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "WorkflowTemplateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'FEATURED', 'DEPRECATED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "WorkflowTemplateComplexity" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "CostType" AS ENUM ('EMAIL_SEND', 'SMS_SEND', 'WHATSAPP_SEND', 'API_CALL', 'WEBHOOK_CALL', 'DATA_STORAGE', 'COMPUTE_TIME', 'EXTERNAL_SERVICE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BudgetPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('BUDGET_THRESHOLD', 'COST_SPIKE', 'BUDGET_EXCEEDED', 'COST_PROJECTION', 'UNUSUAL_USAGE');

-- CreateEnum
CREATE TYPE "ComplianceCategory" AS ENUM ('DATA_PROTECTION', 'CONSENT_MANAGEMENT', 'COMMUNICATION_LIMITS', 'FINANCIAL_REGULATIONS', 'ANTI_MONEY_LAUNDERING', 'KNOW_YOUR_CUSTOMER', 'REPORTING_REQUIREMENTS', 'CROSS_BORDER_TRANSFERS', 'MARKET_CONDUCT', 'CONSUMER_PROTECTION');

-- CreateEnum
CREATE TYPE "ComplianceSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLIANT', 'NON_COMPLIANT', 'REQUIRES_REVIEW', 'FAILED');

-- CreateEnum
CREATE TYPE "ComplianceRemediationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NOT_REQUIRED');

-- CreateEnum
CREATE TYPE "ViolationType" AS ENUM ('CONSENT_VIOLATION', 'DATA_RETENTION_VIOLATION', 'COMMUNICATION_FREQUENCY_VIOLATION', 'UNAUTHORIZED_CROSS_BORDER_TRANSFER', 'MISSING_OPT_OUT_MECHANISM', 'INADEQUATE_DATA_PROTECTION', 'IMPROPER_CONSENT_COLLECTION', 'MARKETING_HOUR_VIOLATION', 'INSUFFICIENT_DOCUMENTATION', 'REGULATORY_REPORTING_FAILURE');

-- CreateEnum
CREATE TYPE "ComplianceRiskLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ViolationStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'IN_REMEDIATION', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "ComplianceReportType" AS ENUM ('DAILY_SUMMARY', 'WEEKLY_DIGEST', 'MONTHLY_REPORT', 'QUARTERLY_ASSESSMENT', 'ANNUAL_REVIEW', 'INCIDENT_REPORT', 'REGULATORY_FILING', 'AUDIT_REPORT');

-- CreateEnum
CREATE TYPE "ReportPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "OfflineSyncStatus" AS ENUM ('PENDING', 'SYNCING', 'COMPLETED', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "OfflineEventSyncStatus" AS ENUM ('PENDING', 'SYNCING', 'COMPLETED', 'FAILED', 'DUPLICATE', 'CONFLICTED');

-- CreateEnum
CREATE TYPE "SyncType" AS ENUM ('UPLOAD', 'DOWNLOAD', 'FULL_SYNC', 'INCREMENTAL_SYNC');

-- CreateEnum
CREATE TYPE "SyncLogStatus" AS ENUM ('STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CacheType" AS ENUM ('USER_DATA', 'FORM_CONFIG', 'ANALYTICS_CONFIG', 'VISITOR_PROFILE', 'ENGAGEMENT_RULES', 'GEOGRAPHIC_DATA');

-- CreateEnum
CREATE TYPE "QueueType" AS ENUM ('EVENT_UPLOAD', 'DATA_DOWNLOAD', 'CONFIG_SYNC', 'ANALYTICS_SYNC', 'PROFILE_SYNC');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttributionDuplicateHandling" AS ENUM ('FIRST_TOUCH', 'LAST_TOUCH', 'HIGHEST_VALUE', 'SUM_VALUES', 'IGNORE_DUPLICATES');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SOCIAL', 'SEARCH', 'DISPLAY', 'DIRECT', 'REFERRAL', 'AFFILIATE', 'SMS', 'WHATSAPP', 'CONTENT', 'VIDEO', 'PODCAST', 'OFFLINE');

-- CreateEnum
CREATE TYPE "ConversionWindowType" AS ENUM ('FIXED', 'SLIDING', 'SESSION_BASED', 'EVENT_BASED');

-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS');

-- CreateEnum
CREATE TYPE "MessageQueueStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ERROR', 'MAINTENANCE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_FOR_RESPONSE', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SystemAlertType" AS ENUM ('PERFORMANCE', 'ERROR', 'SECURITY', 'CAPACITY', 'MAINTENANCE', 'DEPLOYMENT', 'BILLING', 'INTEGRATION');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billingEmail" TEXT,
    "billingName" TEXT,
    "billingAddress" TEXT,
    "vatNumber" TEXT,
    "messagingModel" TEXT NOT NULL DEFAULT 'customer_managed',
    "creditBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autoTopUp" BOOLEAN NOT NULL DEFAULT false,
    "autoTopUpAmount" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "autoTopUpThreshold" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "preferredProviders" TEXT,
    "region" TEXT NOT NULL DEFAULT 'us',

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "organizationId" TEXT,
    "company" TEXT,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendedAt" TIMESTAMP(3),
    "suspendedBy" TEXT,
    "suspensionReason" TEXT,
    "adminNotes" TEXT,
    "lastActiveAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferences" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "RegistrationTemp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "verificationPin" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationTemp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "credentials" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'PENDING',
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationSyncHistory" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "recordsProcessed" INTEGER,
    "error" TEXT,

    CONSTRAINT "IntegrationSyncHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "notes" TEXT,
    "tagsString" TEXT,
    "source" TEXT,
    "customFields" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastEngaged" TIMESTAMP(3),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "totalTransactions" INTEGER NOT NULL DEFAULT 0,
    "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "firstTransactionDate" TIMESTAMP(3),
    "lastTransactionDate" TIMESTAMP(3),
    "avgTimeBetweenTransactions" DOUBLE PRECISION,
    "avgTransactionValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "lastSeenDate" TIMESTAMP(3),
    "totalPageViews" INTEGER NOT NULL DEFAULT 0,
    "totalEmailOpens" INTEGER NOT NULL DEFAULT 0,
    "totalEmailClicks" INTEGER NOT NULL DEFAULT 0,
    "totalSMSResponses" INTEGER NOT NULL DEFAULT 0,
    "mostVisitedPage" TEXT,
    "preferredChannel" TEXT,
    "optimalContactTime" TEXT,
    "communicationFrequency" TEXT,
    "purchasePattern" TEXT,
    "engagementTrend" TEXT,
    "churnProbability" DOUBLE PRECISION DEFAULT 0,
    "churnRiskLevel" TEXT,
    "predictedLtv" DOUBLE PRECISION,
    "customerSegment" TEXT,
    "healthScore" INTEGER DEFAULT 50,
    "nextBestAction" JSONB,
    "lastActionDate" TIMESTAMP(3),
    "actionHistory" JSONB,
    "hasBirthday" BOOLEAN NOT NULL DEFAULT false,
    "nextBirthdayAction" TIMESTAMP(3),
    "specialDates" JSONB,
    "riskFactors" JSONB,
    "opportunities" JSONB,
    "aiConfidence" DOUBLE PRECISION DEFAULT 0.5,
    "modelVersion" TEXT DEFAULT '1.0',
    "lastPredictionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastCalculated" TIMESTAMP(3),

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIActionPlan" (
    "id" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "executedBy" TEXT,
    "executionResult" JSONB,
    "success" BOOLEAN,
    "customerResponse" JSONB,
    "impactMeasured" JSONB,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "riskLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIActionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerEvent" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "customerProfileId" TEXT,
    "organizationId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CustomerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ListType" NOT NULL DEFAULT 'STATIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListMember" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SegmentMember" (
    "id" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SegmentMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "design" TEXT,
    "previewText" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "replyTo" TEXT,
    "templateId" TEXT,
    "content" TEXT,
    "design" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailActivity" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,

    CONSTRAINT "EmailActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "SMSTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" "ABTestStatus" NOT NULL DEFAULT 'DRAFT',
    "testType" "ABTestType" NOT NULL,
    "testElements" TEXT NOT NULL,
    "winnerMetric" "ABTestMetric" NOT NULL,
    "winnerThreshold" DOUBLE PRECISION,
    "distributionPercent" DOUBLE PRECISION NOT NULL,
    "winnerVariantId" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "ABTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTestVariant" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "trafficPercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ABTestVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTestResult" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "metric" "ABTestMetric" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ABTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "from" TEXT NOT NULL,
    "templateId" TEXT,
    "content" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "SMSCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSActivity" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,

    CONSTRAINT "SMSActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSHistory" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT,
    "message" TEXT NOT NULL,
    "originalMessage" TEXT,
    "contactId" TEXT,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "messageId" TEXT,
    "error" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SMSHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" TEXT NOT NULL,
    "category" TEXT,
    "status" "WATemplateStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "from" TEXT NOT NULL,
    "templateId" TEXT,
    "content" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "WhatsAppCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppActivity" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,

    CONSTRAINT "WhatsAppActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppHistory" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "originalMessage" TEXT,
    "contactId" TEXT,
    "templateId" TEXT,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "messageId" TEXT,
    "error" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'INACTIVE',
    "definition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "performanceScore" DOUBLE PRECISION DEFAULT 0,
    "complexityRating" TEXT DEFAULT 'SIMPLE',
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowNode" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "type" "WorkflowNodeType" NOT NULL,
    "name" TEXT,
    "config" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION,
    "positionY" DOUBLE PRECISION,

    CONSTRAINT "WorkflowNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "condition" TEXT,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTrigger" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "type" "TriggerType" NOT NULL,
    "config" TEXT NOT NULL,

    CONSTRAINT "WorkflowTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" "WorkflowExecutionStatus" NOT NULL DEFAULT 'RUNNING',
    "currentStepId" TEXT,
    "context" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastExecutedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecutionStep" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "status" "StepExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3),
    "output" TEXT,
    "errorMessage" TEXT,
    "retryState" TEXT,

    CONSTRAINT "WorkflowExecutionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseSecurityEvent" (
    "id" TEXT NOT NULL,
    "type" "SecurityEventType" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL,
    "source" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseSecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseDataProcessingLog" (
    "id" TEXT NOT NULL,
    "type" "DataProcessingType" NOT NULL,
    "dataSubject" TEXT NOT NULL,
    "dataTypes" TEXT[],
    "purpose" TEXT NOT NULL,
    "legalBasis" TEXT NOT NULL,
    "processor" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retentionUntil" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadPulseDataProcessingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "changes" JSONB,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadPulseAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseConsent" (
    "id" TEXT NOT NULL,
    "contactId" TEXT,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "consentType" "ConsentType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "grantedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "source" TEXT,
    "evidenceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseDataRetention" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "retentionPeriod" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDeletion" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LeadPulseDataRetention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowEvent" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT,
    "contactId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "period" "AnalyticsPeriod" NOT NULL,
    "metrics" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementTime" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "engagementType" "ActivityType" NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hourOfDay" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EngagementTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "status" "SmartSegmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "category" TEXT NOT NULL,
    "type" "ContentTemplateType" NOT NULL,
    "template" TEXT NOT NULL,
    "keywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentGeneration" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "prompt" TEXT,
    "result" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SendTimeOptimization" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hourOfDay" INTEGER NOT NULL,
    "engagementScore" DOUBLE PRECISION NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SendTimeOptimization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eventType" TEXT NOT NULL,
    "category" "ConversionCategory" NOT NULL,
    "valueType" "ConversionValueType" NOT NULL DEFAULT 'COUNT',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "ConversionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionTracking" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "contactId" TEXT,
    "value" DOUBLE PRECISION,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,
    "attributionModel" "AttributionModel" NOT NULL DEFAULT 'LAST_TOUCH',
    "touchPoints" TEXT,

    CONSTRAINT "ConversionTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionFunnel" (
    "id" TEXT NOT NULL,
    "funnelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" JSONB NOT NULL,
    "goalValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "ConversionFunnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionFunnelReport" (
    "id" TEXT NOT NULL,
    "funnelId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionFunnelReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributionSettings" (
    "id" TEXT NOT NULL,
    "defaultModel" "AttributionModel" NOT NULL DEFAULT 'LAST_TOUCH',
    "customWeights" TEXT,
    "lookbackWindow" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributionSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAnalysis" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "ContentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRecommendation" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "suggestedContent" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "impactScore" DOUBLE PRECISION NOT NULL,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "ContentRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectLineTest" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "originalSubject" TEXT NOT NULL,
    "variants" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "winnerVariantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,

    CONSTRAINT "SubjectLineTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectLineTestResult" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "opens" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "openRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "SubjectLineTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentimentAnalysis" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "positive" TEXT NOT NULL,
    "negative" TEXT NOT NULL,
    "emotions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentimentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPersonalization" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "personalizedContent" TEXT NOT NULL,
    "replacements" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentPersonalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictionModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PredictionModelType" NOT NULL,
    "description" TEXT,
    "algorithm" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "metrics" TEXT,
    "version" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PredictionModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "predictionType" "PredictionModelType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "features" TEXT,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurnPrediction" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "riskLevel" "ChurnRiskLevel" NOT NULL,
    "topFactors" TEXT NOT NULL,
    "nextActionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChurnPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifetimeValuePrediction" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "predictedValue" DOUBLE PRECISION NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "timeframe" INTEGER NOT NULL,
    "segments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LifetimeValuePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignPerformancePrediction" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "openRate" DOUBLE PRECISION,
    "clickRate" DOUBLE PRECISION,
    "conversionRate" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION,
    "factors" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignPerformancePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptimalSendTime" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "channelType" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hourOfDay" INTEGER NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptimalSendTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyStage" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "expectedDuration" INTEGER,
    "conversionGoal" DOUBLE PRECISION,
    "isEntryPoint" BOOLEAN NOT NULL DEFAULT false,
    "isExitPoint" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyTransition" (
    "id" TEXT NOT NULL,
    "fromStageId" TEXT NOT NULL,
    "toStageId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "conditions" TEXT,
    "triggerType" "TransitionTriggerType" NOT NULL,
    "triggerDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactJourney" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" "JourneyStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "currentStageId" TEXT,

    CONSTRAINT "ContactJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactJourneyStage" (
    "id" TEXT NOT NULL,
    "contactJourneyId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,

    CONSTRAINT "ContactJourneyStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactJourneyTransition" (
    "id" TEXT NOT NULL,
    "contactJourneyId" TEXT NOT NULL,
    "transitionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromStageId" TEXT NOT NULL,
    "toStageId" TEXT NOT NULL,
    "triggerSource" TEXT,

    CONSTRAINT "ContactJourneyTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyMetric" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metricType" "JourneyMetricType" NOT NULL,
    "targetValue" DOUBLE PRECISION,
    "aggregationType" "MetricAggregationType" NOT NULL DEFAULT 'SUM',
    "formula" TEXT,
    "isSuccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyStageMetric" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION,
    "actualValue" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyStageMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyAnalytics" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalContacts" INTEGER NOT NULL,
    "activeContacts" INTEGER NOT NULL,
    "completedContacts" INTEGER NOT NULL,
    "droppedContacts" INTEGER NOT NULL,
    "conversionRate" DOUBLE PRECISION NOT NULL,
    "averageDuration" INTEGER NOT NULL,
    "stageData" TEXT NOT NULL,

    CONSTRAINT "JourneyAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "contactId" TEXT,
    "segmentId" TEXT,
    "campaignId" TEXT,
    "regionId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskDependency" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dependsOnTaskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI_ContentAnalysis" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "supremeScore" INTEGER NOT NULL DEFAULT 0,
    "sentiment" DOUBLE PRECISION,
    "readability" INTEGER,
    "engagement" INTEGER,
    "analysis" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "AI_ContentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI_CustomerSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" TEXT,
    "customerCount" INTEGER NOT NULL DEFAULT 0,
    "churnRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lifetimeValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "AI_CustomerSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI_ChatHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "context" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AI_ChatHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI_Tool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "config" TEXT,
    "usage" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "AI_Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_memory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "importance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "embedding" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "sessionId" TEXT,
    "relatedMemories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversation_message" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "memoryId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversation_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseVisitor" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "firstVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVisit" TIMESTAMP(3) NOT NULL,
    "totalVisits" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "engagementLevel" TEXT,
    "city" TEXT,
    "country" TEXT,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "metadata" JSONB,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousVisitor" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "contactId" TEXT,
    "firstVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVisit" TIMESTAMP(3) NOT NULL,
    "totalVisits" INTEGER NOT NULL DEFAULT 1,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "city" TEXT,
    "country" TEXT,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "AnonymousVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseJourney" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "stage" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseTouchpoint" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT,
    "anonymousVisitorId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "LeadPulseTouchpointType" NOT NULL,
    "url" TEXT,
    "duration" INTEGER,
    "value" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseTouchpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseInsight" (
    "id" TEXT NOT NULL,
    "type" "LeadPulseInsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "importance" "LeadPulseImportance" NOT NULL,
    "metric" JSONB,
    "recommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "FormStatus" NOT NULL DEFAULT 'DRAFT',
    "theme" JSONB,
    "layout" "FormLayout" NOT NULL DEFAULT 'SINGLE_COLUMN',
    "settings" JSONB,
    "submitButtonText" TEXT NOT NULL DEFAULT 'Submit',
    "successMessage" TEXT NOT NULL DEFAULT 'Thank you for your submission!',
    "errorMessage" TEXT NOT NULL DEFAULT 'Something went wrong. Please try again.',
    "redirectUrl" TEXT,
    "isTrackingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "conversionGoal" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "embedCode" TEXT,
    "publicUrl" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseFormField" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "type" "FormFieldType" NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT,
    "helpText" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" TEXT,
    "validation" JSONB,
    "options" JSONB,
    "fileTypes" TEXT[],
    "maxFileSize" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "width" "FormFieldWidth" NOT NULL DEFAULT 'FULL',
    "cssClasses" TEXT,
    "conditionalLogic" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseFormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseFormSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "visitorId" TEXT,
    "contactId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "quality" "LeadQuality" NOT NULL DEFAULT 'UNKNOWN',
    "metadata" JSONB,

    CONSTRAINT "LeadPulseFormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseSubmissionData" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" "FormFieldType" NOT NULL,
    "value" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadPulseSubmissionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseFormAnalytics" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "fieldInteractions" INTEGER NOT NULL DEFAULT 0,
    "formStarts" INTEGER NOT NULL DEFAULT 0,
    "submissions" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageTime" INTEGER,
    "abandonmentRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fieldAnalytics" JSONB,
    "trafficSources" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseFormAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "interval" TEXT NOT NULL DEFAULT 'monthly',
    "features" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paystackPlanId" TEXT,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "paystackSubscriptionId" TEXT,
    "paystackCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paystackReference" TEXT NOT NULL,
    "paystackTransactionId" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "last4" TEXT,
    "expMonth" INTEGER,
    "expYear" INTEGER,
    "brand" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "paystackAuthorizationCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "sentiment" TEXT,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehavioralPrediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "predictions" TEXT NOT NULL,
    "segments" TEXT NOT NULL,
    "confidenceScores" TEXT NOT NULL,
    "explanatoryFactors" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BehavioralPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehavioralSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BehavioralSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "LeadPulseAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulsePageView" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOnPage" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "LeadPulsePageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseAnalytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "userAgent" TEXT,
    "viewport" JSONB,
    "referrer" TEXT,
    "isNewVisitor" BOOLEAN NOT NULL DEFAULT false,
    "scrollAnalytics" JSONB,
    "clickHeatmap" JSONB,
    "behavioralInsights" JSONB,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "userIntent" TEXT NOT NULL DEFAULT 'browse',
    "conversionProbability" INTEGER NOT NULL DEFAULT 0,
    "frustrationSignals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSProvider" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "senderId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SMSProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppBusinessConfig" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "businessAccountId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "webhookUrl" TEXT NOT NULL,
    "verifyToken" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "displayName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppBusinessConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailProvider" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "domain" TEXT,
    "smtpHost" TEXT,
    "smtpPort" INTEGER,
    "smtpUsername" TEXT,
    "smtpPassword" TEXT,
    "smtpSecure" BOOLEAN NOT NULL DEFAULT true,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "replyToEmail" TEXT,
    "trackingDomain" TEXT,
    "enableTracking" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "lastTested" TIMESTAMP(3),
    "testStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailDomainConfig" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "spfVerified" BOOLEAN NOT NULL DEFAULT false,
    "dkimVerified" BOOLEAN NOT NULL DEFAULT false,
    "dmarcVerified" BOOLEAN NOT NULL DEFAULT false,
    "mxVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "lastChecked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailDomainConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowAnalytics" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "dateRange" "AnalyticsRange" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "completedExecutions" INTEGER NOT NULL DEFAULT 0,
    "failedExecutions" INTEGER NOT NULL DEFAULT 0,
    "avgCompletionTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mostCommonError" TEXT,
    "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowQueueMetrics" (
    "id" TEXT NOT NULL,
    "queueName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "waitingJobs" INTEGER NOT NULL DEFAULT 0,
    "activeJobs" INTEGER NOT NULL DEFAULT 0,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "failedJobs" INTEGER NOT NULL DEFAULT 0,
    "processingRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgProcessingTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "memoryUsageMb" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "WorkflowQueueMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "approvalLevel" TEXT NOT NULL,
    "operationData" JSONB NOT NULL,
    "justification" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyViolation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafetyViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessagingUsage" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "messageCount" INTEGER NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "provider" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "MessagingUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "paymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderMetrics" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "deliveryRate" DOUBLE PRECISION NOT NULL,
    "averageDeliveryTime" DOUBLE PRECISION NOT NULL,
    "errorRate" DOUBLE PRECISION NOT NULL,
    "totalMessagesSent" INTEGER NOT NULL DEFAULT 0,
    "totalSuccessful" INTEGER NOT NULL DEFAULT 0,
    "totalFailed" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseRetentionRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "dataType" TEXT NOT NULL,
    "retentionPeriod" INTEGER NOT NULL,
    "conditions" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "schedule" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseRetentionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseComplianceAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseComplianceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseDataSubjectRequest" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "requestDetails" TEXT,
    "verificationMethod" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "responseData" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseDataSubjectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowVersion" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "description" TEXT,
    "status" "WorkflowVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowDeployment" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "fromVersionId" TEXT,
    "toVersionId" TEXT NOT NULL,
    "status" "DeploymentStatus" NOT NULL DEFAULT 'DEPLOYING',
    "deployedBy" TEXT NOT NULL,
    "deploymentNotes" TEXT,
    "affectedExecutions" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "rollbackPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowDeployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowRollback" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "fromVersionId" TEXT NOT NULL,
    "toVersionId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "rolledBackBy" TEXT NOT NULL,
    "deploymentId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT DEFAULT '{}',

    CONSTRAINT "WorkflowRollback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowVersionComparison" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "fromVersionId" TEXT NOT NULL,
    "toVersionId" TEXT NOT NULL,
    "comparison" TEXT NOT NULL,
    "riskAssessment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowVersionComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowBranch" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentVersionId" TEXT,
    "currentVersionId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowVersionTag" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowVersionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowApproval" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "approverUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "comments" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "WorkflowTemplateCategory" NOT NULL,
    "status" "WorkflowTemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "complexity" "WorkflowTemplateComplexity" NOT NULL DEFAULT 'BEGINNER',
    "definition" TEXT NOT NULL,
    "thumbnail" TEXT,
    "tags" TEXT[],
    "industry" TEXT[],
    "useCase" TEXT NOT NULL,
    "estimatedSetupTime" INTEGER NOT NULL DEFAULT 10,
    "features" TEXT[],
    "requirements" JSONB,
    "variables" JSONB,
    "triggerTypes" TEXT[],
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION DEFAULT 0,
    "authorName" TEXT,
    "authorUrl" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "changelog" TEXT[],
    "publishedAt" TIMESTAMP(3),
    "lastModifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTemplateSubcategory" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WorkflowTemplateSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTemplateInstallation" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "installationType" TEXT NOT NULL DEFAULT 'clone',
    "customizations" JSONB,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkflowTemplateInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTemplateReview" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowTemplateReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTemplateCollection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowTemplateCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTemplateAnalytics" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "WorkflowTemplateAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCostTracking" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "currentPeriodCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPeriodCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "emailCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "smsCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "whatsappCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "apiCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "webhookCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "storageCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "computeCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "externalCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "smsSent" INTEGER NOT NULL DEFAULT 0,
    "whatsappSent" INTEGER NOT NULL DEFAULT 0,
    "apiCalls" INTEGER NOT NULL DEFAULT 0,
    "webhookCalls" INTEGER NOT NULL DEFAULT 0,
    "costPerExecution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costPerContact" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costPerConversion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowCostTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCostEntry" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "costTrackingId" TEXT NOT NULL,
    "executionId" TEXT,
    "costType" "CostType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "provider" TEXT,
    "region" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingPeriod" TEXT,
    "workflowExecutionStepId" TEXT,

    CONSTRAINT "WorkflowCostEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowBudget" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "budgetAmount" DOUBLE PRECISION NOT NULL,
    "spentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remainingAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "budgetPeriod" "BudgetPeriod" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "warningThreshold" DOUBLE PRECISION NOT NULL DEFAULT 75,
    "criticalThreshold" DOUBLE PRECISION NOT NULL DEFAULT 90,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pauseOnExceeded" BOOLEAN NOT NULL DEFAULT false,
    "maxOverrun" DOUBLE PRECISION,
    "lastAlertSent" TIMESTAMP(3),
    "exceededAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCostAlert" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "budgetId" TEXT,
    "alertType" "AlertType" NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "thresholdValue" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "projectedValue" DOUBLE PRECISION,
    "metadata" JSONB,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "slackSent" BOOLEAN NOT NULL DEFAULT false,
    "webhookSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowCostAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCostRule" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "costType" "CostType",
    "provider" TEXT,
    "region" TEXT,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "tieredPricing" JSONB,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowCostRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCostProjection" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "projectionPeriod" "BudgetPeriod" NOT NULL,
    "projectionDate" TIMESTAMP(3) NOT NULL,
    "basePeriodStart" TIMESTAMP(3) NOT NULL,
    "basePeriodEnd" TIMESTAMP(3) NOT NULL,
    "historicalCost" DOUBLE PRECISION NOT NULL,
    "historicalVolume" INTEGER NOT NULL,
    "projectedCost" DOUBLE PRECISION NOT NULL,
    "projectedVolume" INTEGER NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "growthRate" DOUBLE PRECISION,
    "seasonalFactor" DOUBLE PRECISION,
    "trendFactor" DOUBLE PRECISION,
    "projectedEmailCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectedSmsCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectedWhatsappCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectedApiCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculationMethod" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowCostProjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowComplianceRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT NOT NULL,
    "regulation" TEXT NOT NULL,
    "category" "ComplianceCategory" NOT NULL,
    "severity" "ComplianceSeverity" NOT NULL,
    "conditions" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "WorkflowComplianceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowComplianceCheck" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "executionId" TEXT,
    "status" "ComplianceStatus" NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompliant" BOOLEAN NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "findings" JSONB,
    "recommendations" JSONB,
    "evidence" JSONB,
    "requiresAction" BOOLEAN NOT NULL DEFAULT false,
    "actionRequired" TEXT,
    "remediationStatus" "ComplianceRemediationStatus" NOT NULL DEFAULT 'PENDING',
    "remediatedAt" TIMESTAMP(3),
    "remediatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowComplianceCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowComplianceViolation" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "executionId" TEXT,
    "checkId" TEXT,
    "violationType" "ViolationType" NOT NULL,
    "severity" "ComplianceSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "riskLevel" "ComplianceRiskLevel" NOT NULL,
    "financialImpact" DOUBLE PRECISION,
    "businessImpact" TEXT,
    "status" "ViolationStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolution" TEXT,
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "escalatedAt" TIMESTAMP(3),
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowComplianceViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowComplianceReport" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT,
    "reportType" "ComplianceReportType" NOT NULL,
    "period" "ReportPeriod" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalChecks" INTEGER NOT NULL DEFAULT 0,
    "compliantChecks" INTEGER NOT NULL DEFAULT 0,
    "violationsFound" INTEGER NOT NULL DEFAULT 0,
    "highRiskViolations" INTEGER NOT NULL DEFAULT 0,
    "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "summary" JSONB NOT NULL,
    "findings" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "trends" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedBy" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'JSON',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "WorkflowComplianceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceConfiguration" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "language" TEXT NOT NULL DEFAULT 'en',
    "primaryRegulator" TEXT NOT NULL,
    "regulations" JSONB NOT NULL,
    "dataRetention" JSONB NOT NULL,
    "consentRequirements" JSONB NOT NULL,
    "reportingRequirements" JSONB NOT NULL,
    "marketingHours" JSONB NOT NULL,
    "communicationLimits" JSONB NOT NULL,
    "optOutRequirements" JSONB NOT NULL,
    "encryptionRequired" BOOLEAN NOT NULL DEFAULT true,
    "dataLocalization" BOOLEAN NOT NULL DEFAULT false,
    "crossBorderTransfer" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ComplianceConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseOfflineSession" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "deviceInfo" JSONB NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "connectionStatus" TEXT NOT NULL DEFAULT 'offline',
    "eventsCount" INTEGER NOT NULL DEFAULT 0,
    "dataSize" INTEGER NOT NULL DEFAULT 0,
    "lastSyncAt" TIMESTAMP(3),
    "syncStatus" "OfflineSyncStatus" NOT NULL DEFAULT 'PENDING',
    "lastKnownLocation" JSONB,
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseOfflineSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseOfflineEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "localEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "url" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "serverTimestamp" TIMESTAMP(3),
    "syncStatus" "OfflineEventSyncStatus" NOT NULL DEFAULT 'PENDING',
    "syncAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastSyncAttempt" TIMESTAMP(3),
    "syncError" TEXT,
    "isConflicted" BOOLEAN NOT NULL DEFAULT false,
    "conflictReason" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseOfflineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseOfflineSyncLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "syncType" "SyncType" NOT NULL,
    "status" "SyncLogStatus" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "eventsProcessed" INTEGER NOT NULL DEFAULT 0,
    "eventsSucceeded" INTEGER NOT NULL DEFAULT 0,
    "eventsFailed" INTEGER NOT NULL DEFAULT 0,
    "dataTransferred" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" TIMESTAMP(3),
    "connectionType" TEXT,
    "networkSpeed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseOfflineSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseOfflineCache" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "cacheType" "CacheType" NOT NULL,
    "data" JSONB NOT NULL,
    "version" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    "syncPriority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseOfflineCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseOfflineQueue" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "queueType" "QueueType" NOT NULL,
    "payload" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "nextProcessAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPulseOfflineQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseAttributionConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "viewThroughWindow" INTEGER NOT NULL,
    "clickThroughWindow" INTEGER NOT NULL,
    "attributionModel" "AttributionModel" NOT NULL,
    "conversionEvents" JSONB NOT NULL,
    "conversionValue" JSONB,
    "channels" JSONB NOT NULL,
    "touchpointTypes" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "crossDevice" BOOLEAN NOT NULL DEFAULT false,
    "crossDomain" BOOLEAN NOT NULL DEFAULT false,
    "deduplicationWindow" INTEGER NOT NULL DEFAULT 24,
    "duplicateHandling" "AttributionDuplicateHandling" NOT NULL DEFAULT 'FIRST_TOUCH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "LeadPulseAttributionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseAttribution" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "conversionId" TEXT NOT NULL,
    "conversionType" TEXT NOT NULL,
    "conversionValue" DOUBLE PRECISION,
    "conversionData" JSONB,
    "conversionTime" TIMESTAMP(3) NOT NULL,
    "visitorId" TEXT,
    "anonymousVisitorId" TEXT,
    "sessionId" TEXT,
    "attributionModel" "AttributionModel" NOT NULL,
    "touchpointsCount" INTEGER NOT NULL DEFAULT 0,
    "totalCredit" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "attributionData" JSONB NOT NULL,
    "firstTouch" JSONB,
    "lastTouch" JSONB,
    "channelBreakdown" JSONB,
    "deviceBreakdown" JSONB,
    "journeyDuration" INTEGER,
    "touchpointCount" INTEGER NOT NULL DEFAULT 0,
    "uniqueChannels" INTEGER NOT NULL DEFAULT 0,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recalculatedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "LeadPulseAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseAttributionTouchpoint" (
    "id" TEXT NOT NULL,
    "attributionId" TEXT NOT NULL,
    "touchpointId" TEXT NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL,
    "timeToCconv" INTEGER NOT NULL,
    "touchpointType" TEXT NOT NULL,
    "channel" TEXT,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "content" TEXT,
    "url" TEXT,
    "decayFactor" DOUBLE PRECISION,
    "positionWeight" DOUBLE PRECISION,
    "channelWeight" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadPulseAttributionTouchpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "channel" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "attributionConfigId" TEXT,
    "customAttribution" JSONB,
    "budget" DOUBLE PRECISION,
    "goalConversions" INTEGER,
    "goalValue" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "conversionValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "LeadPulseCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPulseConversionWindow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "windowType" "ConversionWindowType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "unit" "TimeUnit" NOT NULL,
    "conversionEvents" JSONB NOT NULL,
    "conversionRules" JSONB,
    "includeViewThrough" BOOLEAN NOT NULL DEFAULT true,
    "includeClickThrough" BOOLEAN NOT NULL DEFAULT true,
    "crossSessionWindow" BOOLEAN NOT NULL DEFAULT true,
    "hasValue" BOOLEAN NOT NULL DEFAULT false,
    "valueField" TEXT,
    "defaultValue" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "LeadPulseConversionWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPCampaignMetrics" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "campaignType" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "delivered" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,
    "converted" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "responded" INTEGER NOT NULL DEFAULT 0,
    "openRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responseRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "abTestData" JSONB,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCPCampaignMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPCustomerPredictions" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "churnRisk" DOUBLE PRECISION NOT NULL,
    "lifetimeValue" DOUBLE PRECISION NOT NULL,
    "engagementScore" INTEGER NOT NULL,
    "segment" TEXT NOT NULL,
    "lastActivityDate" TIMESTAMP(3) NOT NULL,
    "nextBestAction" TEXT NOT NULL,
    "preferredChannel" TEXT NOT NULL,
    "behavioralScores" JSONB NOT NULL,
    "insights" JSONB NOT NULL,
    "confidenceScore" INTEGER NOT NULL DEFAULT 85,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCPCustomerPredictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPVisitorSessions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "sessionStart" TIMESTAMP(3) NOT NULL,
    "sessionEnd" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "pagesViewed" INTEGER NOT NULL DEFAULT 0,
    "interactions" INTEGER NOT NULL DEFAULT 0,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "conversionValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trafficSource" TEXT NOT NULL,
    "trafficMedium" TEXT NOT NULL,
    "referrer" TEXT,
    "utmCampaign" TEXT,
    "pageViews" JSONB NOT NULL,
    "journeyPattern" TEXT NOT NULL,
    "characteristics" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "hasConverted" BOOLEAN NOT NULL DEFAULT false,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCPVisitorSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPMonitoringMetrics" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "category" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricValue" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "tags" JSONB,
    "alertLevel" TEXT NOT NULL DEFAULT 'info',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCPMonitoringMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaAccount" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "scope" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemMetrics" (
    "id" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "SystemMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "eventType" "SecurityEventType" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageQueue" (
    "id" TEXT NOT NULL,
    "queueName" TEXT NOT NULL,
    "status" "MessageQueueStatus" NOT NULL,
    "totalJobs" INTEGER NOT NULL DEFAULT 0,
    "pendingJobs" INTEGER NOT NULL DEFAULT 0,
    "processingJobs" INTEGER NOT NULL DEFAULT 0,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "failedJobs" INTEGER NOT NULL DEFAULT 0,
    "stuckJobs" INTEGER NOT NULL DEFAULT 0,
    "lastProcessed" TIMESTAMP(3),
    "avgProcessTime" DOUBLE PRECISION,
    "errorRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "throughput" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isHealthy" BOOLEAN NOT NULL DEFAULT true,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "SupportPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "assignedTo" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "senderId" TEXT,
    "senderType" "SenderType" NOT NULL,
    "message" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemAlert" (
    "id" TEXT NOT NULL,
    "alertType" "SystemAlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "triggered" BOOLEAN NOT NULL DEFAULT true,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "type" "NoteType" NOT NULL DEFAULT 'INFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContactToConversionEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContactToConversionEvent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SMSCampaignLists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SMSCampaignLists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WACampaignLists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WACampaignLists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WACampaignSegments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WACampaignSegments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CampaignLists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CampaignLists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CampaignSegments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CampaignSegments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SMSCampaignSegments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SMSCampaignSegments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CollectionTemplates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CollectionTemplates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CampaignTouchpoints" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CampaignTouchpoints_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_lastLoginAt_idx" ON "User"("lastLoginAt");

-- CreateIndex
CREATE INDEX "User_lastActivityAt_idx" ON "User"("lastActivityAt");

-- CreateIndex
CREATE INDEX "User_suspendedAt_idx" ON "User"("suspendedAt");

-- CreateIndex
CREATE INDEX "User_suspendedBy_idx" ON "User"("suspendedBy");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "UserSession_activityId_idx" ON "UserSession"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationTemp_email_key" ON "RegistrationTemp"("email");

-- CreateIndex
CREATE INDEX "RegistrationTemp_email_idx" ON "RegistrationTemp"("email");

-- CreateIndex
CREATE INDEX "RegistrationTemp_expiresAt_idx" ON "RegistrationTemp"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_organizationId_idx" ON "Contact"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_contactId_key" ON "CustomerProfile"("contactId");

-- CreateIndex
CREATE INDEX "CustomerProfile_organizationId_idx" ON "CustomerProfile"("organizationId");

-- CreateIndex
CREATE INDEX "CustomerProfile_churnProbability_idx" ON "CustomerProfile"("churnProbability");

-- CreateIndex
CREATE INDEX "CustomerProfile_healthScore_idx" ON "CustomerProfile"("healthScore");

-- CreateIndex
CREATE INDEX "CustomerProfile_customerSegment_idx" ON "CustomerProfile"("customerSegment");

-- CreateIndex
CREATE INDEX "CustomerProfile_lastCalculated_idx" ON "CustomerProfile"("lastCalculated");

-- CreateIndex
CREATE INDEX "AIActionPlan_organizationId_status_idx" ON "AIActionPlan"("organizationId", "status");

-- CreateIndex
CREATE INDEX "AIActionPlan_customerProfileId_idx" ON "AIActionPlan"("customerProfileId");

-- CreateIndex
CREATE INDEX "AIActionPlan_scheduledFor_idx" ON "AIActionPlan"("scheduledFor");

-- CreateIndex
CREATE INDEX "CustomerEvent_organizationId_processed_idx" ON "CustomerEvent"("organizationId", "processed");

-- CreateIndex
CREATE INDEX "CustomerEvent_contactId_idx" ON "CustomerEvent"("contactId");

-- CreateIndex
CREATE INDEX "CustomerEvent_timestamp_idx" ON "CustomerEvent"("timestamp");

-- CreateIndex
CREATE INDEX "List_organizationId_idx" ON "List"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ListMember_listId_contactId_key" ON "ListMember"("listId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "SegmentMember_segmentId_contactId_key" ON "SegmentMember"("segmentId", "contactId");

-- CreateIndex
CREATE INDEX "EmailCampaign_organizationId_idx" ON "EmailCampaign"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ABTestResult_testId_variantId_metric_key" ON "ABTestResult"("testId", "variantId", "metric");

-- CreateIndex
CREATE INDEX "SMSHistory_userId_idx" ON "SMSHistory"("userId");

-- CreateIndex
CREATE INDEX "SMSHistory_messageId_idx" ON "SMSHistory"("messageId");

-- CreateIndex
CREATE INDEX "SMSHistory_status_idx" ON "SMSHistory"("status");

-- CreateIndex
CREATE INDEX "SMSHistory_createdAt_idx" ON "SMSHistory"("createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppHistory_userId_idx" ON "WhatsAppHistory"("userId");

-- CreateIndex
CREATE INDEX "WhatsAppHistory_messageId_idx" ON "WhatsAppHistory"("messageId");

-- CreateIndex
CREATE INDEX "WhatsAppHistory_status_idx" ON "WhatsAppHistory"("status");

-- CreateIndex
CREATE INDEX "WhatsAppHistory_createdAt_idx" ON "WhatsAppHistory"("createdAt");

-- CreateIndex
CREATE INDEX "Workflow_status_createdAt_idx" ON "Workflow"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Workflow_performanceScore_status_idx" ON "Workflow"("performanceScore", "status");

-- CreateIndex
CREATE INDEX "Workflow_createdById_status_idx" ON "Workflow"("createdById", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_sourceId_targetId_key" ON "Connection"("sourceId", "targetId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_status_lastExecutedAt_idx" ON "WorkflowExecution"("status", "lastExecutedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowExecution_workflowId_contactId_key" ON "WorkflowExecution"("workflowId", "contactId");

-- CreateIndex
CREATE INDEX "WorkflowExecutionStep_executionId_stepId_idx" ON "WorkflowExecutionStep"("executionId", "stepId");

-- CreateIndex
CREATE INDEX "WorkflowExecutionStep_status_scheduledFor_idx" ON "WorkflowExecutionStep"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "LeadPulseSecurityEvent_type_severity_timestamp_idx" ON "LeadPulseSecurityEvent"("type", "severity", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseSecurityEvent_userId_timestamp_idx" ON "LeadPulseSecurityEvent"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseSecurityEvent_ipAddress_timestamp_idx" ON "LeadPulseSecurityEvent"("ipAddress", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseDataProcessingLog_dataSubject_timestamp_idx" ON "LeadPulseDataProcessingLog"("dataSubject", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseDataProcessingLog_type_timestamp_idx" ON "LeadPulseDataProcessingLog"("type", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseDataProcessingLog_retentionUntil_idx" ON "LeadPulseDataProcessingLog"("retentionUntil");

-- CreateIndex
CREATE INDEX "LeadPulseAuditLog_resource_resourceId_timestamp_idx" ON "LeadPulseAuditLog"("resource", "resourceId", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseAuditLog_userId_timestamp_idx" ON "LeadPulseAuditLog"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseAuditLog_action_timestamp_idx" ON "LeadPulseAuditLog"("action", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseConsent_email_consentType_idx" ON "LeadPulseConsent"("email", "consentType");

-- CreateIndex
CREATE INDEX "LeadPulseConsent_contactId_idx" ON "LeadPulseConsent"("contactId");

-- CreateIndex
CREATE INDEX "LeadPulseConsent_granted_grantedAt_idx" ON "LeadPulseConsent"("granted", "grantedAt");

-- CreateIndex
CREATE INDEX "LeadPulseDataRetention_resource_resourceId_idx" ON "LeadPulseDataRetention"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "LeadPulseDataRetention_scheduledDeletion_deleted_idx" ON "LeadPulseDataRetention"("scheduledDeletion", "deleted");

-- CreateIndex
CREATE INDEX "LeadPulseDataRetention_dataType_scheduledDeletion_idx" ON "LeadPulseDataRetention"("dataType", "scheduledDeletion");

-- CreateIndex
CREATE INDEX "WorkflowEvent_eventType_processed_createdAt_idx" ON "WorkflowEvent"("eventType", "processed", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_entityType_entityId_period_key" ON "Analytics"("entityType", "entityId", "period");

-- CreateIndex
CREATE INDEX "EngagementTime_contactId_entityType_engagementType_idx" ON "EngagementTime"("contactId", "entityType", "engagementType");

-- CreateIndex
CREATE INDEX "EngagementTime_dayOfWeek_hourOfDay_idx" ON "EngagementTime"("dayOfWeek", "hourOfDay");

-- CreateIndex
CREATE UNIQUE INDEX "SendTimeOptimization_contactId_dayOfWeek_hourOfDay_key" ON "SendTimeOptimization"("contactId", "dayOfWeek", "hourOfDay");

-- CreateIndex
CREATE INDEX "ConversionTracking_entityType_entityId_idx" ON "ConversionTracking"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ConversionTracking_contactId_idx" ON "ConversionTracking"("contactId");

-- CreateIndex
CREATE INDEX "ConversionTracking_eventId_idx" ON "ConversionTracking"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversionFunnel_funnelId_key" ON "ConversionFunnel"("funnelId");

-- CreateIndex
CREATE INDEX "ConversionFunnel_organizationId_idx" ON "ConversionFunnel"("organizationId");

-- CreateIndex
CREATE INDEX "ConversionFunnel_funnelId_idx" ON "ConversionFunnel"("funnelId");

-- CreateIndex
CREATE INDEX "ConversionFunnel_isActive_idx" ON "ConversionFunnel"("isActive");

-- CreateIndex
CREATE INDEX "SubjectLineTest_campaignId_idx" ON "SubjectLineTest"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectLineTestResult_testId_variantId_key" ON "SubjectLineTestResult"("testId", "variantId");

-- CreateIndex
CREATE INDEX "SentimentAnalysis_entityType_entityId_idx" ON "SentimentAnalysis"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ContentPersonalization_campaignId_idx" ON "ContentPersonalization"("campaignId");

-- CreateIndex
CREATE INDEX "ContentPersonalization_contactId_idx" ON "ContentPersonalization"("contactId");

-- CreateIndex
CREATE INDEX "Prediction_entityType_entityId_idx" ON "Prediction"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Prediction_predictionType_idx" ON "Prediction"("predictionType");

-- CreateIndex
CREATE INDEX "ChurnPrediction_contactId_idx" ON "ChurnPrediction"("contactId");

-- CreateIndex
CREATE INDEX "ChurnPrediction_riskLevel_idx" ON "ChurnPrediction"("riskLevel");

-- CreateIndex
CREATE INDEX "LifetimeValuePrediction_contactId_idx" ON "LifetimeValuePrediction"("contactId");

-- CreateIndex
CREATE INDEX "CampaignPerformancePrediction_campaignId_idx" ON "CampaignPerformancePrediction"("campaignId");

-- CreateIndex
CREATE INDEX "OptimalSendTime_contactId_channelType_idx" ON "OptimalSendTime"("contactId", "channelType");

-- CreateIndex
CREATE UNIQUE INDEX "OptimalSendTime_contactId_channelType_dayOfWeek_hourOfDay_key" ON "OptimalSendTime"("contactId", "channelType", "dayOfWeek", "hourOfDay");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyTransition_fromStageId_toStageId_key" ON "JourneyTransition"("fromStageId", "toStageId");

-- CreateIndex
CREATE INDEX "ContactJourney_journeyId_contactId_idx" ON "ContactJourney"("journeyId", "contactId");

-- CreateIndex
CREATE INDEX "ContactJourney_status_idx" ON "ContactJourney"("status");

-- CreateIndex
CREATE INDEX "ContactJourneyStage_contactJourneyId_idx" ON "ContactJourneyStage"("contactJourneyId");

-- CreateIndex
CREATE INDEX "ContactJourneyStage_stageId_enteredAt_idx" ON "ContactJourneyStage"("stageId", "enteredAt");

-- CreateIndex
CREATE INDEX "ContactJourneyTransition_contactJourneyId_idx" ON "ContactJourneyTransition"("contactJourneyId");

-- CreateIndex
CREATE INDEX "ContactJourneyTransition_transitionId_idx" ON "ContactJourneyTransition"("transitionId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyStageMetric_stageId_metricId_key" ON "JourneyStageMetric"("stageId", "metricId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyAnalytics_journeyId_date_key" ON "JourneyAnalytics"("journeyId", "date");

-- CreateIndex
CREATE INDEX "Task_organizationId_idx" ON "Task"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskDependency_taskId_dependsOnTaskId_key" ON "TaskDependency"("taskId", "dependsOnTaskId");

-- CreateIndex
CREATE INDEX "ai_memory_userId_idx" ON "ai_memory"("userId");

-- CreateIndex
CREATE INDEX "ai_memory_organizationId_idx" ON "ai_memory"("organizationId");

-- CreateIndex
CREATE INDEX "ai_memory_type_idx" ON "ai_memory"("type");

-- CreateIndex
CREATE INDEX "ai_memory_sessionId_idx" ON "ai_memory"("sessionId");

-- CreateIndex
CREATE INDEX "ai_memory_importance_idx" ON "ai_memory"("importance");

-- CreateIndex
CREATE INDEX "ai_memory_lastAccessed_idx" ON "ai_memory"("lastAccessed");

-- CreateIndex
CREATE INDEX "ai_memory_expiresAt_idx" ON "ai_memory"("expiresAt");

-- CreateIndex
CREATE INDEX "ai_conversation_message_sessionId_idx" ON "ai_conversation_message"("sessionId");

-- CreateIndex
CREATE INDEX "ai_conversation_message_timestamp_idx" ON "ai_conversation_message"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPulseVisitor_fingerprint_key" ON "LeadPulseVisitor"("fingerprint");

-- CreateIndex
CREATE INDEX "LeadPulseVisitor_fingerprint_idx" ON "LeadPulseVisitor"("fingerprint");

-- CreateIndex
CREATE INDEX "LeadPulseVisitor_lastVisit_idx" ON "LeadPulseVisitor"("lastVisit");

-- CreateIndex
CREATE INDEX "LeadPulseVisitor_isActive_idx" ON "LeadPulseVisitor"("isActive");

-- CreateIndex
CREATE INDEX "LeadPulseVisitor_lastVisit_isActive_idx" ON "LeadPulseVisitor"("lastVisit", "isActive");

-- CreateIndex
CREATE INDEX "LeadPulseVisitor_engagementScore_lastVisit_idx" ON "LeadPulseVisitor"("engagementScore", "lastVisit");

-- CreateIndex
CREATE INDEX "LeadPulseVisitor_country_lastVisit_idx" ON "LeadPulseVisitor"("country", "lastVisit");

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousVisitor_fingerprint_key" ON "AnonymousVisitor"("fingerprint");

-- CreateIndex
CREATE INDEX "AnonymousVisitor_fingerprint_idx" ON "AnonymousVisitor"("fingerprint");

-- CreateIndex
CREATE INDEX "AnonymousVisitor_lastVisit_idx" ON "AnonymousVisitor"("lastVisit");

-- CreateIndex
CREATE INDEX "AnonymousVisitor_lastVisit_isActive_idx" ON "AnonymousVisitor"("lastVisit", "isActive");

-- CreateIndex
CREATE INDEX "AnonymousVisitor_engagementScore_lastVisit_idx" ON "AnonymousVisitor"("engagementScore", "lastVisit");

-- CreateIndex
CREATE INDEX "LeadPulseJourney_visitorId_idx" ON "LeadPulseJourney"("visitorId");

-- CreateIndex
CREATE INDEX "LeadPulseJourney_stage_idx" ON "LeadPulseJourney"("stage");

-- CreateIndex
CREATE INDEX "LeadPulseTouchpoint_visitorId_timestamp_idx" ON "LeadPulseTouchpoint"("visitorId", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseTouchpoint_anonymousVisitorId_timestamp_idx" ON "LeadPulseTouchpoint"("anonymousVisitorId", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseTouchpoint_type_idx" ON "LeadPulseTouchpoint"("type");

-- CreateIndex
CREATE INDEX "LeadPulseTouchpoint_timestamp_type_idx" ON "LeadPulseTouchpoint"("timestamp", "type");

-- CreateIndex
CREATE INDEX "LeadPulseTouchpoint_visitorId_type_timestamp_idx" ON "LeadPulseTouchpoint"("visitorId", "type", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseTouchpoint_type_timestamp_visitorId_idx" ON "LeadPulseTouchpoint"("type", "timestamp", "visitorId");

-- CreateIndex
CREATE INDEX "LeadPulseForm_status_idx" ON "LeadPulseForm"("status");

-- CreateIndex
CREATE INDEX "LeadPulseForm_isPublished_idx" ON "LeadPulseForm"("isPublished");

-- CreateIndex
CREATE INDEX "LeadPulseForm_createdBy_idx" ON "LeadPulseForm"("createdBy");

-- CreateIndex
CREATE INDEX "LeadPulseFormField_formId_order_idx" ON "LeadPulseFormField"("formId", "order");

-- CreateIndex
CREATE INDEX "LeadPulseFormField_type_idx" ON "LeadPulseFormField"("type");

-- CreateIndex
CREATE INDEX "LeadPulseFormSubmission_formId_submittedAt_idx" ON "LeadPulseFormSubmission"("formId", "submittedAt");

-- CreateIndex
CREATE INDEX "LeadPulseFormSubmission_visitorId_idx" ON "LeadPulseFormSubmission"("visitorId");

-- CreateIndex
CREATE INDEX "LeadPulseFormSubmission_contactId_idx" ON "LeadPulseFormSubmission"("contactId");

-- CreateIndex
CREATE INDEX "LeadPulseFormSubmission_status_idx" ON "LeadPulseFormSubmission"("status");

-- CreateIndex
CREATE INDEX "LeadPulseSubmissionData_submissionId_idx" ON "LeadPulseSubmissionData"("submissionId");

-- CreateIndex
CREATE INDEX "LeadPulseSubmissionData_fieldId_idx" ON "LeadPulseSubmissionData"("fieldId");

-- CreateIndex
CREATE INDEX "LeadPulseSubmissionData_fieldName_idx" ON "LeadPulseSubmissionData"("fieldName");

-- CreateIndex
CREATE INDEX "LeadPulseFormAnalytics_formId_idx" ON "LeadPulseFormAnalytics"("formId");

-- CreateIndex
CREATE INDEX "LeadPulseFormAnalytics_date_idx" ON "LeadPulseFormAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPulseFormAnalytics_formId_date_key" ON "LeadPulseFormAnalytics"("formId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_paystackReference_key" ON "Transaction"("paystackReference");

-- CreateIndex
CREATE INDEX "UserActivity_userId_timestamp_idx" ON "UserActivity"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "UserActivity_type_idx" ON "UserActivity"("type");

-- CreateIndex
CREATE INDEX "Purchase_activityId_idx" ON "Purchase"("activityId");

-- CreateIndex
CREATE INDEX "Interaction_activityId_idx" ON "Interaction"("activityId");

-- CreateIndex
CREATE INDEX "BehavioralPrediction_userId_createdAt_idx" ON "BehavioralPrediction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "BehavioralPrediction_modelId_idx" ON "BehavioralPrediction"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "BehavioralSegment_name_key" ON "BehavioralSegment"("name");

-- CreateIndex
CREATE INDEX "LeadPulseAlert_type_status_idx" ON "LeadPulseAlert"("type", "status");

-- CreateIndex
CREATE INDEX "LeadPulseAlert_priority_createdAt_idx" ON "LeadPulseAlert"("priority", "createdAt");

-- CreateIndex
CREATE INDEX "LeadPulsePageView_visitorId_timestamp_idx" ON "LeadPulsePageView"("visitorId", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulsePageView_url_idx" ON "LeadPulsePageView"("url");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPulseAnalytics_sessionId_key" ON "LeadPulseAnalytics"("sessionId");

-- CreateIndex
CREATE INDEX "LeadPulseAnalytics_sessionId_idx" ON "LeadPulseAnalytics"("sessionId");

-- CreateIndex
CREATE INDEX "LeadPulseAnalytics_visitorId_startTime_idx" ON "LeadPulseAnalytics"("visitorId", "startTime");

-- CreateIndex
CREATE INDEX "LeadPulseAnalytics_page_startTime_idx" ON "LeadPulseAnalytics"("page", "startTime");

-- CreateIndex
CREATE INDEX "LeadPulseAnalytics_engagementScore_idx" ON "LeadPulseAnalytics"("engagementScore");

-- CreateIndex
CREATE INDEX "LeadPulseAnalytics_userIntent_idx" ON "LeadPulseAnalytics"("userIntent");

-- CreateIndex
CREATE INDEX "LeadPulseAnalytics_conversionProbability_idx" ON "LeadPulseAnalytics"("conversionProbability");

-- CreateIndex
CREATE UNIQUE INDEX "SMSProvider_organizationId_key" ON "SMSProvider"("organizationId");

-- CreateIndex
CREATE INDEX "SMSProvider_organizationId_idx" ON "SMSProvider"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppBusinessConfig_organizationId_key" ON "WhatsAppBusinessConfig"("organizationId");

-- CreateIndex
CREATE INDEX "WhatsAppBusinessConfig_organizationId_idx" ON "WhatsAppBusinessConfig"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailProvider_organizationId_key" ON "EmailProvider"("organizationId");

-- CreateIndex
CREATE INDEX "EmailProvider_organizationId_idx" ON "EmailProvider"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailDomainConfig_organizationId_key" ON "EmailDomainConfig"("organizationId");

-- CreateIndex
CREATE INDEX "EmailDomainConfig_organizationId_idx" ON "EmailDomainConfig"("organizationId");

-- CreateIndex
CREATE INDEX "WorkflowAnalytics_dateRange_periodStart_idx" ON "WorkflowAnalytics"("dateRange", "periodStart");

-- CreateIndex
CREATE INDEX "WorkflowAnalytics_performanceScore_idx" ON "WorkflowAnalytics"("performanceScore");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowAnalytics_workflowId_dateRange_periodStart_key" ON "WorkflowAnalytics"("workflowId", "dateRange", "periodStart");

-- CreateIndex
CREATE INDEX "WorkflowQueueMetrics_queueName_timestamp_idx" ON "WorkflowQueueMetrics"("queueName", "timestamp");

-- CreateIndex
CREATE INDEX "WorkflowQueueMetrics_timestamp_idx" ON "WorkflowQueueMetrics"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalRequest_operationId_key" ON "ApprovalRequest"("operationId");

-- CreateIndex
CREATE INDEX "ApprovalRequest_requesterId_idx" ON "ApprovalRequest"("requesterId");

-- CreateIndex
CREATE INDEX "ApprovalRequest_approvedBy_idx" ON "ApprovalRequest"("approvedBy");

-- CreateIndex
CREATE INDEX "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");

-- CreateIndex
CREATE INDEX "ApprovalRequest_expiresAt_idx" ON "ApprovalRequest"("expiresAt");

-- CreateIndex
CREATE INDEX "SafetyViolation_userId_idx" ON "SafetyViolation"("userId");

-- CreateIndex
CREATE INDEX "SafetyViolation_ruleId_idx" ON "SafetyViolation"("ruleId");

-- CreateIndex
CREATE INDEX "SafetyViolation_riskLevel_idx" ON "SafetyViolation"("riskLevel");

-- CreateIndex
CREATE INDEX "SafetyViolation_resolved_idx" ON "SafetyViolation"("resolved");

-- CreateIndex
CREATE INDEX "MessagingUsage_organizationId_idx" ON "MessagingUsage"("organizationId");

-- CreateIndex
CREATE INDEX "MessagingUsage_channel_idx" ON "MessagingUsage"("channel");

-- CreateIndex
CREATE INDEX "MessagingUsage_timestamp_idx" ON "MessagingUsage"("timestamp");

-- CreateIndex
CREATE INDEX "MessagingUsage_provider_idx" ON "MessagingUsage"("provider");

-- CreateIndex
CREATE INDEX "CreditTransaction_organizationId_idx" ON "CreditTransaction"("organizationId");

-- CreateIndex
CREATE INDEX "CreditTransaction_type_idx" ON "CreditTransaction"("type");

-- CreateIndex
CREATE INDEX "CreditTransaction_status_idx" ON "CreditTransaction"("status");

-- CreateIndex
CREATE INDEX "CreditTransaction_createdAt_idx" ON "CreditTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "ProviderMetrics_provider_idx" ON "ProviderMetrics"("provider");

-- CreateIndex
CREATE INDEX "ProviderMetrics_channel_idx" ON "ProviderMetrics"("channel");

-- CreateIndex
CREATE INDEX "ProviderMetrics_region_idx" ON "ProviderMetrics"("region");

-- CreateIndex
CREATE INDEX "ProviderMetrics_lastUpdated_idx" ON "ProviderMetrics"("lastUpdated");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderMetrics_provider_channel_region_key" ON "ProviderMetrics"("provider", "channel", "region");

-- CreateIndex
CREATE INDEX "LeadPulseRetentionRule_enabled_idx" ON "LeadPulseRetentionRule"("enabled");

-- CreateIndex
CREATE INDEX "LeadPulseRetentionRule_dataType_idx" ON "LeadPulseRetentionRule"("dataType");

-- CreateIndex
CREATE INDEX "LeadPulseRetentionRule_retentionPeriod_idx" ON "LeadPulseRetentionRule"("retentionPeriod");

-- CreateIndex
CREATE INDEX "LeadPulseComplianceAlert_type_idx" ON "LeadPulseComplianceAlert"("type");

-- CreateIndex
CREATE INDEX "LeadPulseComplianceAlert_severity_idx" ON "LeadPulseComplianceAlert"("severity");

-- CreateIndex
CREATE INDEX "LeadPulseComplianceAlert_resolved_idx" ON "LeadPulseComplianceAlert"("resolved");

-- CreateIndex
CREATE INDEX "LeadPulseComplianceAlert_createdAt_idx" ON "LeadPulseComplianceAlert"("createdAt");

-- CreateIndex
CREATE INDEX "LeadPulseDataSubjectRequest_type_idx" ON "LeadPulseDataSubjectRequest"("type");

-- CreateIndex
CREATE INDEX "LeadPulseDataSubjectRequest_email_idx" ON "LeadPulseDataSubjectRequest"("email");

-- CreateIndex
CREATE INDEX "LeadPulseDataSubjectRequest_status_idx" ON "LeadPulseDataSubjectRequest"("status");

-- CreateIndex
CREATE INDEX "LeadPulseDataSubjectRequest_createdAt_idx" ON "LeadPulseDataSubjectRequest"("createdAt");

-- CreateIndex
CREATE INDEX "WorkflowVersion_workflowId_idx" ON "WorkflowVersion"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowVersion_status_idx" ON "WorkflowVersion"("status");

-- CreateIndex
CREATE INDEX "WorkflowVersion_version_idx" ON "WorkflowVersion"("version");

-- CreateIndex
CREATE INDEX "WorkflowVersion_createdAt_idx" ON "WorkflowVersion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowVersion_workflowId_version_key" ON "WorkflowVersion"("workflowId", "version");

-- CreateIndex
CREATE INDEX "WorkflowDeployment_workflowId_idx" ON "WorkflowDeployment"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowDeployment_status_idx" ON "WorkflowDeployment"("status");

-- CreateIndex
CREATE INDEX "WorkflowDeployment_startedAt_idx" ON "WorkflowDeployment"("startedAt");

-- CreateIndex
CREATE INDEX "WorkflowRollback_workflowId_idx" ON "WorkflowRollback"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowRollback_timestamp_idx" ON "WorkflowRollback"("timestamp");

-- CreateIndex
CREATE INDEX "WorkflowVersionComparison_workflowId_idx" ON "WorkflowVersionComparison"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowVersionComparison_fromVersionId_toVersionId_key" ON "WorkflowVersionComparison"("fromVersionId", "toVersionId");

-- CreateIndex
CREATE INDEX "WorkflowBranch_workflowId_idx" ON "WorkflowBranch"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowBranch_isActive_idx" ON "WorkflowBranch"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowBranch_workflowId_name_key" ON "WorkflowBranch"("workflowId", "name");

-- CreateIndex
CREATE INDEX "WorkflowVersionTag_versionId_idx" ON "WorkflowVersionTag"("versionId");

-- CreateIndex
CREATE INDEX "WorkflowVersionTag_tag_idx" ON "WorkflowVersionTag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowVersionTag_versionId_tag_key" ON "WorkflowVersionTag"("versionId", "tag");

-- CreateIndex
CREATE INDEX "WorkflowApproval_versionId_idx" ON "WorkflowApproval"("versionId");

-- CreateIndex
CREATE INDEX "WorkflowApproval_status_idx" ON "WorkflowApproval"("status");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_category_status_idx" ON "WorkflowTemplate"("category", "status");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_status_isFeatured_idx" ON "WorkflowTemplate"("status", "isFeatured");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_complexity_idx" ON "WorkflowTemplate"("complexity");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_usageCount_idx" ON "WorkflowTemplate"("usageCount");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_rating_idx" ON "WorkflowTemplate"("rating");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_publishedAt_idx" ON "WorkflowTemplate"("publishedAt");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_createdBy_idx" ON "WorkflowTemplate"("createdBy");

-- CreateIndex
CREATE INDEX "WorkflowTemplateSubcategory_templateId_sortOrder_idx" ON "WorkflowTemplateSubcategory"("templateId", "sortOrder");

-- CreateIndex
CREATE INDEX "WorkflowTemplateInstallation_userId_installedAt_idx" ON "WorkflowTemplateInstallation"("userId", "installedAt");

-- CreateIndex
CREATE INDEX "WorkflowTemplateInstallation_templateId_idx" ON "WorkflowTemplateInstallation"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTemplateInstallation_templateId_workflowId_key" ON "WorkflowTemplateInstallation"("templateId", "workflowId");

-- CreateIndex
CREATE INDEX "WorkflowTemplateReview_templateId_rating_idx" ON "WorkflowTemplateReview"("templateId", "rating");

-- CreateIndex
CREATE INDEX "WorkflowTemplateReview_userId_idx" ON "WorkflowTemplateReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTemplateReview_templateId_userId_key" ON "WorkflowTemplateReview"("templateId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTemplateCollection_slug_key" ON "WorkflowTemplateCollection"("slug");

-- CreateIndex
CREATE INDEX "WorkflowTemplateCollection_isPublic_isFeatured_idx" ON "WorkflowTemplateCollection"("isPublic", "isFeatured");

-- CreateIndex
CREATE INDEX "WorkflowTemplateCollection_createdBy_idx" ON "WorkflowTemplateCollection"("createdBy");

-- CreateIndex
CREATE INDEX "WorkflowTemplateAnalytics_templateId_eventType_timestamp_idx" ON "WorkflowTemplateAnalytics"("templateId", "eventType", "timestamp");

-- CreateIndex
CREATE INDEX "WorkflowTemplateAnalytics_userId_timestamp_idx" ON "WorkflowTemplateAnalytics"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "WorkflowTemplateAnalytics_eventType_timestamp_idx" ON "WorkflowTemplateAnalytics"("eventType", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowCostTracking_workflowId_key" ON "WorkflowCostTracking"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowCostTracking_workflowId_idx" ON "WorkflowCostTracking"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowCostTracking_currentPeriodCost_idx" ON "WorkflowCostTracking"("currentPeriodCost");

-- CreateIndex
CREATE INDEX "WorkflowCostTracking_lastCalculatedAt_idx" ON "WorkflowCostTracking"("lastCalculatedAt");

-- CreateIndex
CREATE INDEX "WorkflowCostEntry_workflowId_timestamp_idx" ON "WorkflowCostEntry"("workflowId", "timestamp");

-- CreateIndex
CREATE INDEX "WorkflowCostEntry_costType_timestamp_idx" ON "WorkflowCostEntry"("costType", "timestamp");

-- CreateIndex
CREATE INDEX "WorkflowCostEntry_executionId_idx" ON "WorkflowCostEntry"("executionId");

-- CreateIndex
CREATE INDEX "WorkflowCostEntry_costTrackingId_idx" ON "WorkflowCostEntry"("costTrackingId");

-- CreateIndex
CREATE INDEX "WorkflowBudget_workflowId_isActive_idx" ON "WorkflowBudget"("workflowId", "isActive");

-- CreateIndex
CREATE INDEX "WorkflowBudget_budgetPeriod_startDate_idx" ON "WorkflowBudget"("budgetPeriod", "startDate");

-- CreateIndex
CREATE INDEX "WorkflowBudget_exceededAt_idx" ON "WorkflowBudget"("exceededAt");

-- CreateIndex
CREATE INDEX "WorkflowCostAlert_workflowId_alertType_idx" ON "WorkflowCostAlert"("workflowId", "alertType");

-- CreateIndex
CREATE INDEX "WorkflowCostAlert_severity_isResolved_idx" ON "WorkflowCostAlert"("severity", "isResolved");

-- CreateIndex
CREATE INDEX "WorkflowCostAlert_createdAt_idx" ON "WorkflowCostAlert"("createdAt");

-- CreateIndex
CREATE INDEX "WorkflowCostRule_workflowId_isActive_idx" ON "WorkflowCostRule"("workflowId", "isActive");

-- CreateIndex
CREATE INDEX "WorkflowCostRule_costType_isActive_idx" ON "WorkflowCostRule"("costType", "isActive");

-- CreateIndex
CREATE INDEX "WorkflowCostRule_effectiveFrom_effectiveTo_idx" ON "WorkflowCostRule"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "WorkflowCostProjection_workflowId_projectionDate_idx" ON "WorkflowCostProjection"("workflowId", "projectionDate");

-- CreateIndex
CREATE INDEX "WorkflowCostProjection_projectionPeriod_idx" ON "WorkflowCostProjection"("projectionPeriod");

-- CreateIndex
CREATE INDEX "WorkflowComplianceRule_country_isActive_idx" ON "WorkflowComplianceRule"("country", "isActive");

-- CreateIndex
CREATE INDEX "WorkflowComplianceRule_regulation_isActive_idx" ON "WorkflowComplianceRule"("regulation", "isActive");

-- CreateIndex
CREATE INDEX "WorkflowComplianceRule_category_severity_idx" ON "WorkflowComplianceRule"("category", "severity");

-- CreateIndex
CREATE INDEX "WorkflowComplianceCheck_workflowId_status_idx" ON "WorkflowComplianceCheck"("workflowId", "status");

-- CreateIndex
CREATE INDEX "WorkflowComplianceCheck_ruleId_isCompliant_idx" ON "WorkflowComplianceCheck"("ruleId", "isCompliant");

-- CreateIndex
CREATE INDEX "WorkflowComplianceCheck_checkDate_status_idx" ON "WorkflowComplianceCheck"("checkDate", "status");

-- CreateIndex
CREATE INDEX "WorkflowComplianceViolation_workflowId_status_idx" ON "WorkflowComplianceViolation"("workflowId", "status");

-- CreateIndex
CREATE INDEX "WorkflowComplianceViolation_ruleId_severity_idx" ON "WorkflowComplianceViolation"("ruleId", "severity");

-- CreateIndex
CREATE INDEX "WorkflowComplianceViolation_violationType_status_idx" ON "WorkflowComplianceViolation"("violationType", "status");

-- CreateIndex
CREATE INDEX "WorkflowComplianceViolation_detectedAt_severity_idx" ON "WorkflowComplianceViolation"("detectedAt", "severity");

-- CreateIndex
CREATE INDEX "WorkflowComplianceReport_workflowId_reportType_idx" ON "WorkflowComplianceReport"("workflowId", "reportType");

-- CreateIndex
CREATE INDEX "WorkflowComplianceReport_period_startDate_idx" ON "WorkflowComplianceReport"("period", "startDate");

-- CreateIndex
CREATE INDEX "WorkflowComplianceReport_generatedAt_isPublished_idx" ON "WorkflowComplianceReport"("generatedAt", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceConfiguration_country_key" ON "ComplianceConfiguration"("country");

-- CreateIndex
CREATE INDEX "ComplianceConfiguration_country_isActive_idx" ON "ComplianceConfiguration"("country", "isActive");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineSession_deviceId_isActive_idx" ON "LeadPulseOfflineSession"("deviceId", "isActive");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineSession_sessionId_idx" ON "LeadPulseOfflineSession"("sessionId");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineSession_syncStatus_createdAt_idx" ON "LeadPulseOfflineSession"("syncStatus", "createdAt");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineSession_connectionStatus_updatedAt_idx" ON "LeadPulseOfflineSession"("connectionStatus", "updatedAt");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineEvent_syncStatus_timestamp_idx" ON "LeadPulseOfflineEvent"("syncStatus", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineEvent_eventType_timestamp_idx" ON "LeadPulseOfflineEvent"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineEvent_isConflicted_idx" ON "LeadPulseOfflineEvent"("isConflicted");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPulseOfflineEvent_sessionId_localEventId_key" ON "LeadPulseOfflineEvent"("sessionId", "localEventId");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineSyncLog_sessionId_startTime_idx" ON "LeadPulseOfflineSyncLog"("sessionId", "startTime");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineSyncLog_status_startTime_idx" ON "LeadPulseOfflineSyncLog"("status", "startTime");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineSyncLog_syncType_status_idx" ON "LeadPulseOfflineSyncLog"("syncType", "status");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineCache_cacheType_expiresAt_idx" ON "LeadPulseOfflineCache"("cacheType", "expiresAt");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineCache_isStale_syncPriority_idx" ON "LeadPulseOfflineCache"("isStale", "syncPriority");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPulseOfflineCache_deviceId_cacheKey_key" ON "LeadPulseOfflineCache"("deviceId", "cacheKey");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineQueue_deviceId_status_idx" ON "LeadPulseOfflineQueue"("deviceId", "status");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineQueue_queueType_priority_idx" ON "LeadPulseOfflineQueue"("queueType", "priority");

-- CreateIndex
CREATE INDEX "LeadPulseOfflineQueue_status_nextProcessAt_idx" ON "LeadPulseOfflineQueue"("status", "nextProcessAt");

-- CreateIndex
CREATE INDEX "LeadPulseAttributionConfig_isActive_isDefault_idx" ON "LeadPulseAttributionConfig"("isActive", "isDefault");

-- CreateIndex
CREATE INDEX "LeadPulseAttributionConfig_attributionModel_idx" ON "LeadPulseAttributionConfig"("attributionModel");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPulseAttribution_conversionId_key" ON "LeadPulseAttribution"("conversionId");

-- CreateIndex
CREATE INDEX "LeadPulseAttribution_conversionType_conversionTime_idx" ON "LeadPulseAttribution"("conversionType", "conversionTime");

-- CreateIndex
CREATE INDEX "LeadPulseAttribution_visitorId_conversionTime_idx" ON "LeadPulseAttribution"("visitorId", "conversionTime");

-- CreateIndex
CREATE INDEX "LeadPulseAttribution_attributionModel_conversionTime_idx" ON "LeadPulseAttribution"("attributionModel", "conversionTime");

-- CreateIndex
CREATE INDEX "LeadPulseAttribution_calculatedAt_configId_idx" ON "LeadPulseAttribution"("calculatedAt", "configId");

-- CreateIndex
CREATE INDEX "LeadPulseAttributionTouchpoint_attributionId_position_idx" ON "LeadPulseAttributionTouchpoint"("attributionId", "position");

-- CreateIndex
CREATE INDEX "LeadPulseAttributionTouchpoint_touchpointId_idx" ON "LeadPulseAttributionTouchpoint"("touchpointId");

-- CreateIndex
CREATE INDEX "LeadPulseAttributionTouchpoint_channel_timestamp_idx" ON "LeadPulseAttributionTouchpoint"("channel", "timestamp");

-- CreateIndex
CREATE INDEX "LeadPulseCampaign_channel_status_idx" ON "LeadPulseCampaign"("channel", "status");

-- CreateIndex
CREATE INDEX "LeadPulseCampaign_startDate_endDate_idx" ON "LeadPulseCampaign"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "LeadPulseCampaign_utmSource_utmMedium_utmCampaign_idx" ON "LeadPulseCampaign"("utmSource", "utmMedium", "utmCampaign");

-- CreateIndex
CREATE INDEX "LeadPulseConversionWindow_isActive_idx" ON "LeadPulseConversionWindow"("isActive");

-- CreateIndex
CREATE INDEX "LeadPulseConversionWindow_priority_isActive_idx" ON "LeadPulseConversionWindow"("priority", "isActive");

-- CreateIndex
CREATE INDEX "MCPCampaignMetrics_campaignType_organizationId_idx" ON "MCPCampaignMetrics"("campaignType", "organizationId");

-- CreateIndex
CREATE INDEX "MCPCampaignMetrics_calculatedAt_idx" ON "MCPCampaignMetrics"("calculatedAt");

-- CreateIndex
CREATE INDEX "MCPCustomerPredictions_segment_organizationId_idx" ON "MCPCustomerPredictions"("segment", "organizationId");

-- CreateIndex
CREATE INDEX "MCPCustomerPredictions_churnRisk_idx" ON "MCPCustomerPredictions"("churnRisk");

-- CreateIndex
CREATE INDEX "MCPCustomerPredictions_calculatedAt_idx" ON "MCPCustomerPredictions"("calculatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MCPVisitorSessions_sessionId_key" ON "MCPVisitorSessions"("sessionId");

-- CreateIndex
CREATE INDEX "MCPVisitorSessions_organizationId_sessionStart_idx" ON "MCPVisitorSessions"("organizationId", "sessionStart");

-- CreateIndex
CREATE INDEX "MCPVisitorSessions_isActive_idx" ON "MCPVisitorSessions"("isActive");

-- CreateIndex
CREATE INDEX "MCPVisitorSessions_hasConverted_idx" ON "MCPVisitorSessions"("hasConverted");

-- CreateIndex
CREATE INDEX "MCPVisitorSessions_journeyPattern_idx" ON "MCPVisitorSessions"("journeyPattern");

-- CreateIndex
CREATE INDEX "MCPMonitoringMetrics_category_metricName_idx" ON "MCPMonitoringMetrics"("category", "metricName");

-- CreateIndex
CREATE INDEX "MCPMonitoringMetrics_timestamp_idx" ON "MCPMonitoringMetrics"("timestamp");

-- CreateIndex
CREATE INDEX "MCPMonitoringMetrics_alertLevel_isActive_idx" ON "MCPMonitoringMetrics"("alertLevel", "isActive");

-- CreateIndex
CREATE INDEX "SocialMediaAccount_organizationId_idx" ON "SocialMediaAccount"("organizationId");

-- CreateIndex
CREATE INDEX "SocialMediaAccount_userId_idx" ON "SocialMediaAccount"("userId");

-- CreateIndex
CREATE INDEX "SocialMediaAccount_platform_idx" ON "SocialMediaAccount"("platform");

-- CreateIndex
CREATE INDEX "SocialMediaAccount_organizationId_platform_idx" ON "SocialMediaAccount"("organizationId", "platform");

-- CreateIndex
CREATE INDEX "SocialMediaAccount_isActive_idx" ON "SocialMediaAccount"("isActive");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminUserId_idx" ON "AdminAuditLog"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_idx" ON "AdminAuditLog"("action");

-- CreateIndex
CREATE INDEX "AdminAuditLog_resource_idx" ON "AdminAuditLog"("resource");

-- CreateIndex
CREATE INDEX "AdminAuditLog_timestamp_idx" ON "AdminAuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminEmail_idx" ON "AdminAuditLog"("adminEmail");

-- CreateIndex
CREATE INDEX "SystemMetrics_metricType_idx" ON "SystemMetrics"("metricType");

-- CreateIndex
CREATE INDEX "SystemMetrics_timestamp_idx" ON "SystemMetrics"("timestamp");

-- CreateIndex
CREATE INDEX "SystemMetrics_source_idx" ON "SystemMetrics"("source");

-- CreateIndex
CREATE INDEX "SecurityEvent_eventType_idx" ON "SecurityEvent"("eventType");

-- CreateIndex
CREATE INDEX "SecurityEvent_severity_idx" ON "SecurityEvent"("severity");

-- CreateIndex
CREATE INDEX "SecurityEvent_timestamp_idx" ON "SecurityEvent"("timestamp");

-- CreateIndex
CREATE INDEX "SecurityEvent_resolved_idx" ON "SecurityEvent"("resolved");

-- CreateIndex
CREATE INDEX "SecurityEvent_userId_idx" ON "SecurityEvent"("userId");

-- CreateIndex
CREATE INDEX "MessageQueue_status_idx" ON "MessageQueue"("status");

-- CreateIndex
CREATE INDEX "MessageQueue_queueName_idx" ON "MessageQueue"("queueName");

-- CreateIndex
CREATE INDEX "MessageQueue_timestamp_idx" ON "MessageQueue"("timestamp");

-- CreateIndex
CREATE INDEX "MessageQueue_isHealthy_idx" ON "MessageQueue"("isHealthy");

-- CreateIndex
CREATE UNIQUE INDEX "MessageQueue_queueName_key" ON "MessageQueue"("queueName");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketId_key" ON "SupportTicket"("ticketId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicket_priority_idx" ON "SupportTicket"("priority");

-- CreateIndex
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- CreateIndex
CREATE INDEX "SupportTicket_assignedTo_idx" ON "SupportTicket"("assignedTo");

-- CreateIndex
CREATE INDEX "SupportTicket_createdAt_idx" ON "SupportTicket"("createdAt");

-- CreateIndex
CREATE INDEX "SupportMessage_ticketId_idx" ON "SupportMessage"("ticketId");

-- CreateIndex
CREATE INDEX "SupportMessage_createdAt_idx" ON "SupportMessage"("createdAt");

-- CreateIndex
CREATE INDEX "SystemAlert_alertType_idx" ON "SystemAlert"("alertType");

-- CreateIndex
CREATE INDEX "SystemAlert_severity_idx" ON "SystemAlert"("severity");

-- CreateIndex
CREATE INDEX "SystemAlert_resolved_idx" ON "SystemAlert"("resolved");

-- CreateIndex
CREATE INDEX "SystemAlert_createdAt_idx" ON "SystemAlert"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_sessionToken_key" ON "AdminSession"("sessionToken");

-- CreateIndex
CREATE INDEX "AdminSession_userId_idx" ON "AdminSession"("userId");

-- CreateIndex
CREATE INDEX "AdminSession_sessionToken_idx" ON "AdminSession"("sessionToken");

-- CreateIndex
CREATE INDEX "AdminSession_loginAt_idx" ON "AdminSession"("loginAt");

-- CreateIndex
CREATE INDEX "AdminSession_isActive_idx" ON "AdminSession"("isActive");

-- CreateIndex
CREATE INDEX "AdminSession_ipAddress_idx" ON "AdminSession"("ipAddress");

-- CreateIndex
CREATE INDEX "AdminNote_userId_idx" ON "AdminNote"("userId");

-- CreateIndex
CREATE INDEX "AdminNote_createdById_idx" ON "AdminNote"("createdById");

-- CreateIndex
CREATE INDEX "AdminNote_type_idx" ON "AdminNote"("type");

-- CreateIndex
CREATE INDEX "AdminNote_createdAt_idx" ON "AdminNote"("createdAt");

-- CreateIndex
CREATE INDEX "_ContactToConversionEvent_B_index" ON "_ContactToConversionEvent"("B");

-- CreateIndex
CREATE INDEX "_SMSCampaignLists_B_index" ON "_SMSCampaignLists"("B");

-- CreateIndex
CREATE INDEX "_WACampaignLists_B_index" ON "_WACampaignLists"("B");

-- CreateIndex
CREATE INDEX "_WACampaignSegments_B_index" ON "_WACampaignSegments"("B");

-- CreateIndex
CREATE INDEX "_CampaignLists_B_index" ON "_CampaignLists"("B");

-- CreateIndex
CREATE INDEX "_CampaignSegments_B_index" ON "_CampaignSegments"("B");

-- CreateIndex
CREATE INDEX "_SMSCampaignSegments_B_index" ON "_SMSCampaignSegments"("B");

-- CreateIndex
CREATE INDEX "_CollectionTemplates_B_index" ON "_CollectionTemplates"("B");

-- CreateIndex
CREATE INDEX "_CampaignTouchpoints_B_index" ON "_CampaignTouchpoints"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "UserActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationSyncHistory" ADD CONSTRAINT "IntegrationSyncHistory_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIActionPlan" ADD CONSTRAINT "AIActionPlan_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIActionPlan" ADD CONSTRAINT "AIActionPlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIActionPlan" ADD CONSTRAINT "AIActionPlan_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIActionPlan" ADD CONSTRAINT "AIActionPlan_executedBy_fkey" FOREIGN KEY ("executedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEvent" ADD CONSTRAINT "CustomerEvent_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEvent" ADD CONSTRAINT "CustomerEvent_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEvent" ADD CONSTRAINT "CustomerEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMember" ADD CONSTRAINT "ListMember_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMember" ADD CONSTRAINT "ListMember_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SegmentMember" ADD CONSTRAINT "SegmentMember_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SegmentMember" ADD CONSTRAINT "SegmentMember_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EmailTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailActivity" ADD CONSTRAINT "EmailActivity_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailActivity" ADD CONSTRAINT "EmailActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSTemplate" ADD CONSTRAINT "SMSTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTest" ADD CONSTRAINT "ABTest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTestVariant" ADD CONSTRAINT "ABTestVariant_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ABTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTestResult" ADD CONSTRAINT "ABTestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ABTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTestResult" ADD CONSTRAINT "ABTestResult_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ABTestVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "SMSTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSActivity" ADD CONSTRAINT "SMSActivity_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "SMSCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSActivity" ADD CONSTRAINT "SMSActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSHistory" ADD CONSTRAINT "SMSHistory_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSHistory" ADD CONSTRAINT "SMSHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppTemplate" ADD CONSTRAINT "WhatsAppTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WhatsAppTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppActivity" ADD CONSTRAINT "WhatsAppActivity_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "WhatsAppCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppActivity" ADD CONSTRAINT "WhatsAppActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppHistory" ADD CONSTRAINT "WhatsAppHistory_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppHistory" ADD CONSTRAINT "WhatsAppHistory_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WhatsAppTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppHistory" ADD CONSTRAINT "WhatsAppHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowNode" ADD CONSTRAINT "WorkflowNode_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "WorkflowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "WorkflowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTrigger" ADD CONSTRAINT "WorkflowTrigger_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecutionStep" ADD CONSTRAINT "WorkflowExecutionStep_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "WorkflowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseSecurityEvent" ADD CONSTRAINT "LeadPulseSecurityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAuditLog" ADD CONSTRAINT "LeadPulseAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseConsent" ADD CONSTRAINT "LeadPulseConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseConsent" ADD CONSTRAINT "LeadPulseConsent_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEvent" ADD CONSTRAINT "WorkflowEvent_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEvent" ADD CONSTRAINT "WorkflowEvent_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionEvent" ADD CONSTRAINT "ConversionEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionTracking" ADD CONSTRAINT "ConversionTracking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "ConversionEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionTracking" ADD CONSTRAINT "ConversionTracking_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionFunnel" ADD CONSTRAINT "ConversionFunnel_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionFunnel" ADD CONSTRAINT "ConversionFunnel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionFunnelReport" ADD CONSTRAINT "ConversionFunnelReport_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "ConversionFunnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRecommendation" ADD CONSTRAINT "ContentRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectLineTest" ADD CONSTRAINT "SubjectLineTest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectLineTestResult" ADD CONSTRAINT "SubjectLineTestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "SubjectLineTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "PredictionModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStage" ADD CONSTRAINT "JourneyStage_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTransition" ADD CONSTRAINT "JourneyTransition_fromStageId_fkey" FOREIGN KEY ("fromStageId") REFERENCES "JourneyStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTransition" ADD CONSTRAINT "JourneyTransition_toStageId_fkey" FOREIGN KEY ("toStageId") REFERENCES "JourneyStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJourney" ADD CONSTRAINT "ContactJourney_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJourney" ADD CONSTRAINT "ContactJourney_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJourneyStage" ADD CONSTRAINT "ContactJourneyStage_contactJourneyId_fkey" FOREIGN KEY ("contactJourneyId") REFERENCES "ContactJourney"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJourneyStage" ADD CONSTRAINT "ContactJourneyStage_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "JourneyStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJourneyTransition" ADD CONSTRAINT "ContactJourneyTransition_contactJourneyId_fkey" FOREIGN KEY ("contactJourneyId") REFERENCES "ContactJourney"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJourneyTransition" ADD CONSTRAINT "ContactJourneyTransition_transitionId_fkey" FOREIGN KEY ("transitionId") REFERENCES "JourneyTransition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyMetric" ADD CONSTRAINT "JourneyMetric_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStageMetric" ADD CONSTRAINT "JourneyStageMetric_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "JourneyStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStageMetric" ADD CONSTRAINT "JourneyStageMetric_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "JourneyMetric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependsOnTaskId_fkey" FOREIGN KEY ("dependsOnTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI_ContentAnalysis" ADD CONSTRAINT "AI_ContentAnalysis_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI_CustomerSegment" ADD CONSTRAINT "AI_CustomerSegment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI_ChatHistory" ADD CONSTRAINT "AI_ChatHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI_Tool" ADD CONSTRAINT "AI_Tool_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_memory" ADD CONSTRAINT "ai_memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_memory" ADD CONSTRAINT "ai_memory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversation_message" ADD CONSTRAINT "ai_conversation_message_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "ai_memory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseJourney" ADD CONSTRAINT "LeadPulseJourney_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "AnonymousVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseTouchpoint" ADD CONSTRAINT "LeadPulseTouchpoint_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "LeadPulseVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseTouchpoint" ADD CONSTRAINT "LeadPulseTouchpoint_anonymousVisitorId_fkey" FOREIGN KEY ("anonymousVisitorId") REFERENCES "AnonymousVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseForm" ADD CONSTRAINT "LeadPulseForm_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseFormField" ADD CONSTRAINT "LeadPulseFormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "LeadPulseForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseFormSubmission" ADD CONSTRAINT "LeadPulseFormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "LeadPulseForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseFormSubmission" ADD CONSTRAINT "LeadPulseFormSubmission_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "LeadPulseVisitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseFormSubmission" ADD CONSTRAINT "LeadPulseFormSubmission_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseSubmissionData" ADD CONSTRAINT "LeadPulseSubmissionData_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "LeadPulseFormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseSubmissionData" ADD CONSTRAINT "LeadPulseSubmissionData_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "LeadPulseFormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseFormAnalytics" ADD CONSTRAINT "LeadPulseFormAnalytics_formId_fkey" FOREIGN KEY ("formId") REFERENCES "LeadPulseForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "UserActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "UserActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehavioralPrediction" ADD CONSTRAINT "BehavioralPrediction_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "PredictionModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAnalytics" ADD CONSTRAINT "LeadPulseAnalytics_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "LeadPulseVisitor"("fingerprint") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSProvider" ADD CONSTRAINT "SMSProvider_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppBusinessConfig" ADD CONSTRAINT "WhatsAppBusinessConfig_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailProvider" ADD CONSTRAINT "EmailProvider_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailDomainConfig" ADD CONSTRAINT "EmailDomainConfig_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowAnalytics" ADD CONSTRAINT "WorkflowAnalytics_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyViolation" ADD CONSTRAINT "SafetyViolation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyViolation" ADD CONSTRAINT "SafetyViolation_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagingUsage" ADD CONSTRAINT "MessagingUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowDeployment" ADD CONSTRAINT "WorkflowDeployment_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowDeployment" ADD CONSTRAINT "WorkflowDeployment_fromVersionId_fkey" FOREIGN KEY ("fromVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowDeployment" ADD CONSTRAINT "WorkflowDeployment_toVersionId_fkey" FOREIGN KEY ("toVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowDeployment" ADD CONSTRAINT "WorkflowDeployment_deployedBy_fkey" FOREIGN KEY ("deployedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRollback" ADD CONSTRAINT "WorkflowRollback_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRollback" ADD CONSTRAINT "WorkflowRollback_fromVersionId_fkey" FOREIGN KEY ("fromVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRollback" ADD CONSTRAINT "WorkflowRollback_toVersionId_fkey" FOREIGN KEY ("toVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRollback" ADD CONSTRAINT "WorkflowRollback_rolledBackBy_fkey" FOREIGN KEY ("rolledBackBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRollback" ADD CONSTRAINT "WorkflowRollback_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "WorkflowDeployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersionComparison" ADD CONSTRAINT "WorkflowVersionComparison_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersionComparison" ADD CONSTRAINT "WorkflowVersionComparison_fromVersionId_fkey" FOREIGN KEY ("fromVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersionComparison" ADD CONSTRAINT "WorkflowVersionComparison_toVersionId_fkey" FOREIGN KEY ("toVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBranch" ADD CONSTRAINT "WorkflowBranch_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBranch" ADD CONSTRAINT "WorkflowBranch_parentVersionId_fkey" FOREIGN KEY ("parentVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBranch" ADD CONSTRAINT "WorkflowBranch_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "WorkflowVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBranch" ADD CONSTRAINT "WorkflowBranch_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersionTag" ADD CONSTRAINT "WorkflowVersionTag_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "WorkflowVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersionTag" ADD CONSTRAINT "WorkflowVersionTag_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowApproval" ADD CONSTRAINT "WorkflowApproval_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "WorkflowVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowApproval" ADD CONSTRAINT "WorkflowApproval_approverUserId_fkey" FOREIGN KEY ("approverUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplate" ADD CONSTRAINT "WorkflowTemplate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateSubcategory" ADD CONSTRAINT "WorkflowTemplateSubcategory_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkflowTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateInstallation" ADD CONSTRAINT "WorkflowTemplateInstallation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkflowTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateInstallation" ADD CONSTRAINT "WorkflowTemplateInstallation_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateInstallation" ADD CONSTRAINT "WorkflowTemplateInstallation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateReview" ADD CONSTRAINT "WorkflowTemplateReview_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkflowTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateReview" ADD CONSTRAINT "WorkflowTemplateReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateCollection" ADD CONSTRAINT "WorkflowTemplateCollection_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateAnalytics" ADD CONSTRAINT "WorkflowTemplateAnalytics_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkflowTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplateAnalytics" ADD CONSTRAINT "WorkflowTemplateAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostTracking" ADD CONSTRAINT "WorkflowCostTracking_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostEntry" ADD CONSTRAINT "WorkflowCostEntry_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostEntry" ADD CONSTRAINT "WorkflowCostEntry_costTrackingId_fkey" FOREIGN KEY ("costTrackingId") REFERENCES "WorkflowCostTracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostEntry" ADD CONSTRAINT "WorkflowCostEntry_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "WorkflowExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostEntry" ADD CONSTRAINT "WorkflowCostEntry_workflowExecutionStepId_fkey" FOREIGN KEY ("workflowExecutionStepId") REFERENCES "WorkflowExecutionStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBudget" ADD CONSTRAINT "WorkflowBudget_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBudget" ADD CONSTRAINT "WorkflowBudget_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostAlert" ADD CONSTRAINT "WorkflowCostAlert_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostAlert" ADD CONSTRAINT "WorkflowCostAlert_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "WorkflowBudget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostAlert" ADD CONSTRAINT "WorkflowCostAlert_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostRule" ADD CONSTRAINT "WorkflowCostRule_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostRule" ADD CONSTRAINT "WorkflowCostRule_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCostProjection" ADD CONSTRAINT "WorkflowCostProjection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceRule" ADD CONSTRAINT "WorkflowComplianceRule_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceCheck" ADD CONSTRAINT "WorkflowComplianceCheck_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceCheck" ADD CONSTRAINT "WorkflowComplianceCheck_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "WorkflowComplianceRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceCheck" ADD CONSTRAINT "WorkflowComplianceCheck_remediatedBy_fkey" FOREIGN KEY ("remediatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceViolation" ADD CONSTRAINT "WorkflowComplianceViolation_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceViolation" ADD CONSTRAINT "WorkflowComplianceViolation_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "WorkflowComplianceRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceViolation" ADD CONSTRAINT "WorkflowComplianceViolation_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "WorkflowComplianceCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceViolation" ADD CONSTRAINT "WorkflowComplianceViolation_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceReport" ADD CONSTRAINT "WorkflowComplianceReport_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowComplianceReport" ADD CONSTRAINT "WorkflowComplianceReport_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceConfiguration" ADD CONSTRAINT "ComplianceConfiguration_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseOfflineEvent" ADD CONSTRAINT "LeadPulseOfflineEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LeadPulseOfflineSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseOfflineSyncLog" ADD CONSTRAINT "LeadPulseOfflineSyncLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LeadPulseOfflineSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAttributionConfig" ADD CONSTRAINT "LeadPulseAttributionConfig_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAttribution" ADD CONSTRAINT "LeadPulseAttribution_configId_fkey" FOREIGN KEY ("configId") REFERENCES "LeadPulseAttributionConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAttribution" ADD CONSTRAINT "LeadPulseAttribution_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "LeadPulseVisitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAttribution" ADD CONSTRAINT "LeadPulseAttribution_anonymousVisitorId_fkey" FOREIGN KEY ("anonymousVisitorId") REFERENCES "AnonymousVisitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAttributionTouchpoint" ADD CONSTRAINT "LeadPulseAttributionTouchpoint_attributionId_fkey" FOREIGN KEY ("attributionId") REFERENCES "LeadPulseAttribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseAttributionTouchpoint" ADD CONSTRAINT "LeadPulseAttributionTouchpoint_touchpointId_fkey" FOREIGN KEY ("touchpointId") REFERENCES "LeadPulseTouchpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseCampaign" ADD CONSTRAINT "LeadPulseCampaign_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseCampaign" ADD CONSTRAINT "LeadPulseCampaign_attributionConfigId_fkey" FOREIGN KEY ("attributionConfigId") REFERENCES "LeadPulseAttributionConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPulseConversionWindow" ADD CONSTRAINT "LeadPulseConversionWindow_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPCampaignMetrics" ADD CONSTRAINT "MCPCampaignMetrics_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPCustomerPredictions" ADD CONSTRAINT "MCPCustomerPredictions_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPCustomerPredictions" ADD CONSTRAINT "MCPCustomerPredictions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPVisitorSessions" ADD CONSTRAINT "MCPVisitorSessions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPMonitoringMetrics" ADD CONSTRAINT "MCPMonitoringMetrics_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaAccount" ADD CONSTRAINT "SocialMediaAccount_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaAccount" ADD CONSTRAINT "SocialMediaAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemAlert" ADD CONSTRAINT "SystemAlert_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToConversionEvent" ADD CONSTRAINT "_ContactToConversionEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToConversionEvent" ADD CONSTRAINT "_ContactToConversionEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "ConversionEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SMSCampaignLists" ADD CONSTRAINT "_SMSCampaignLists_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SMSCampaignLists" ADD CONSTRAINT "_SMSCampaignLists_B_fkey" FOREIGN KEY ("B") REFERENCES "SMSCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WACampaignLists" ADD CONSTRAINT "_WACampaignLists_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WACampaignLists" ADD CONSTRAINT "_WACampaignLists_B_fkey" FOREIGN KEY ("B") REFERENCES "WhatsAppCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WACampaignSegments" ADD CONSTRAINT "_WACampaignSegments_A_fkey" FOREIGN KEY ("A") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WACampaignSegments" ADD CONSTRAINT "_WACampaignSegments_B_fkey" FOREIGN KEY ("B") REFERENCES "WhatsAppCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignLists" ADD CONSTRAINT "_CampaignLists_A_fkey" FOREIGN KEY ("A") REFERENCES "EmailCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignLists" ADD CONSTRAINT "_CampaignLists_B_fkey" FOREIGN KEY ("B") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignSegments" ADD CONSTRAINT "_CampaignSegments_A_fkey" FOREIGN KEY ("A") REFERENCES "EmailCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignSegments" ADD CONSTRAINT "_CampaignSegments_B_fkey" FOREIGN KEY ("B") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SMSCampaignSegments" ADD CONSTRAINT "_SMSCampaignSegments_A_fkey" FOREIGN KEY ("A") REFERENCES "SMSCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SMSCampaignSegments" ADD CONSTRAINT "_SMSCampaignSegments_B_fkey" FOREIGN KEY ("B") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionTemplates" ADD CONSTRAINT "_CollectionTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "WorkflowTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionTemplates" ADD CONSTRAINT "_CollectionTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkflowTemplateCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignTouchpoints" ADD CONSTRAINT "_CampaignTouchpoints_A_fkey" FOREIGN KEY ("A") REFERENCES "LeadPulseCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignTouchpoints" ADD CONSTRAINT "_CampaignTouchpoints_B_fkey" FOREIGN KEY ("B") REFERENCES "LeadPulseTouchpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
