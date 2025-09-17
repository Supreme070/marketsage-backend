# Campaigns API Documentation

## Overview
The Campaigns API provides comprehensive multi-channel campaign management, A/B testing, and workflow automation capabilities for MarketSage. This API enables unified campaign orchestration across Email, SMS, and WhatsApp channels.

## Base URL
```
/api/v2/campaigns
```

## Authentication
All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Unified Campaigns

### Create Campaign
**POST** `/campaigns`

Creates a new multi-channel campaign with support for Email, SMS, and WhatsApp channels.

**Request Body:**
```json
{
  "name": "Summer Sale Campaign",
  "description": "Multi-channel campaign for summer sale",
  "type": "MULTI_CHANNEL",
  "channels": ["EMAIL", "SMS", "WHATSAPP"],
  "priority": 1,
  "budget": 1000.0,
  "costPerMessage": 0.05,
  "recurrence": "ONE_TIME",
  "timezone": "UTC",
  "listIds": ["list1", "list2"],
  "segmentIds": ["segment1"],
  "scheduledFor": "2024-06-01T10:00:00Z",
  "emailConfig": {
    "subject": "Summer Sale - 50% Off!",
    "from": "noreply@company.com",
    "templateId": "template1",
    "content": "Check out our summer sale!"
  },
  "smsConfig": {
    "content": "Summer Sale: 50% off everything! Use code SUMMER50",
    "templateId": "sms_template1"
  },
  "whatsappConfig": {
    "content": "🌞 Summer Sale Alert! Get 50% off everything. Limited time offer!",
    "templateId": "whatsapp_template1"
  }
}
```

**Response:**
```json
{
  "id": "campaign_123",
  "name": "Summer Sale Campaign",
  "type": "MULTI_CHANNEL",
  "channels": ["EMAIL", "SMS", "WHATSAPP"],
  "status": "DRAFT",
  "createdAt": "2024-05-15T10:00:00Z",
  "channelCampaigns": [
    { "channel": "email", "campaignId": "email_123" },
    { "channel": "sms", "campaignId": "sms_123" },
    { "channel": "whatsapp", "campaignId": "whatsapp_123" }
  ]
}
```

### Get Campaigns
**GET** `/campaigns`

Retrieves a paginated list of campaigns with optional filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `status` (string): Filter by status (DRAFT, SCHEDULED, SENDING, SENT, PAUSED, CANCELLED, FAILED)
- `type` (string): Filter by type (EMAIL_ONLY, SMS_ONLY, WHATSAPP_ONLY, MULTI_CHANNEL, SEQUENTIAL, PARALLEL)
- `search` (string): Search by name or description

**Response:**
```json
{
  "campaigns": [
    {
      "id": "campaign_123",
      "name": "Summer Sale Campaign",
      "type": "MULTI_CHANNEL",
      "status": "DRAFT",
      "channels": ["EMAIL", "SMS"],
      "createdAt": "2024-05-15T10:00:00Z",
      "createdBy": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@company.com"
      },
      "lists": [{"id": "list1", "name": "VIP Customers"}],
      "segments": [{"id": "segment1", "name": "High Value"}],
      "_count": { "activities": 0 }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Campaign by ID
**GET** `/campaigns/{id}`

Retrieves detailed information about a specific campaign.

**Response:**
```json
{
  "id": "campaign_123",
  "name": "Summer Sale Campaign",
  "type": "MULTI_CHANNEL",
  "status": "SENT",
  "channels": ["EMAIL", "SMS", "WHATSAPP"],
  "sentAt": "2024-05-15T12:00:00Z",
  "totalSent": 1000,
  "totalDelivered": 950,
  "totalOpened": 500,
  "totalClicked": 100,
  "emailCampaigns": [
    {
      "id": "email_123",
      "name": "Summer Sale Campaign - Email",
      "status": "SENT",
      "template": {
        "id": "template1",
        "name": "Summer Sale Template",
        "content": "Check out our summer sale!"
      }
    }
  ],
  "activities": [
    {
      "id": "activity_123",
      "channel": "EMAIL",
      "type": "SENT",
      "timestamp": "2024-05-15T12:00:00Z"
    }
  ]
}
```

### Update Campaign
**PUT** `/campaigns/{id}`

Updates an existing campaign (only draft campaigns can be updated).

**Request Body:**
```json
{
  "name": "Updated Summer Sale Campaign",
  "description": "Updated description",
  "priority": 2,
  "budget": 1500.0,
  "listIds": ["list1", "list3"],
  "segmentIds": ["segment1", "segment2"]
}
```

### Delete Campaign
**DELETE** `/campaigns/{id}`

Deletes a campaign (only draft campaigns can be deleted).

**Response:**
```json
{
  "message": "Campaign deleted successfully"
}
```

### Duplicate Campaign
**POST** `/campaigns/{id}/duplicate`

Creates a copy of an existing campaign.

**Response:**
```json
{
  "message": "Campaign duplicated successfully",
  "originalCampaign": {
    "id": "campaign_123",
    "name": "Summer Sale Campaign"
  },
  "duplicatedCampaign": {
    "id": "campaign_124",
    "name": "Summer Sale Campaign (Copy)",
    "status": "DRAFT"
  }
}
```

### Send Campaign
**POST** `/campaigns/{id}/send`

Sends a campaign to all specified channels.

**Request Body:**
```json
{
  "scheduledFor": "2024-06-01T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Campaign sent successfully. 1000 sent, 50 failed.",
  "campaign": {
    "id": "campaign_123",
    "status": "SENT"
  },
  "recipientsCount": 1050,
  "successCount": 1000,
  "failureCount": 50,
  "results": [
    {
      "channel": "email",
      "campaignId": "email_123",
      "result": { "successCount": 500, "failureCount": 25 }
    },
    {
      "channel": "sms",
      "campaignId": "sms_123",
      "result": { "successCount": 500, "failureCount": 25 }
    }
  ]
}
```

### Schedule Campaign
**POST** `/campaigns/{id}/schedule`

Schedules a campaign for future sending.

**Request Body:**
```json
{
  "scheduledFor": "2024-06-01T10:00:00Z"
}
```

### Cancel Scheduled Campaign
**POST** `/campaigns/{id}/cancel-schedule`

Cancels a scheduled campaign.

### Get Campaign Analytics
**GET** `/campaigns/{id}/analytics`

Retrieves detailed analytics for a campaign.

**Query Parameters:**
- `startDate` (string): Start date for analytics (ISO 8601)
- `endDate` (string): End date for analytics (ISO 8601)

**Response:**
```json
{
  "campaign": {
    "id": "campaign_123",
    "name": "Summer Sale Campaign",
    "type": "MULTI_CHANNEL",
    "channels": ["EMAIL", "SMS"],
    "status": "SENT",
    "sentAt": "2024-05-15T12:00:00Z"
  },
  "analytics": {
    "totalSent": 1000,
    "totalDelivered": 950,
    "totalOpened": 500,
    "totalClicked": 100,
    "totalReplied": 25,
    "totalFailed": 50,
    "deliveryRate": 95.0,
    "openRate": 52.63,
    "clickRate": 20.0,
    "replyRate": 2.63,
    "failureRate": 5.0
  },
  "performance": [
    {
      "channel": "EMAIL",
      "date": "2024-05-15T00:00:00Z",
      "sent": 500,
      "delivered": 475,
      "opened": 250,
      "clicked": 50,
      "cost": 5.0,
      "revenue": 500.0
    }
  ]
}
```

## A/B Testing

### Create A/B Test
**POST** `/campaigns/{id}/ab-tests`

Creates a new A/B test for a campaign.

**Request Body:**
```json
{
  "name": "Subject Line Test",
  "description": "Testing different subject lines",
  "winnerCriteria": "HIGHEST_OPEN_RATE",
  "confidenceLevel": 95.0,
  "minSampleSize": 1000,
  "startDate": "2024-06-01T10:00:00Z",
  "endDate": "2024-06-07T10:00:00Z"
}
```

### Get A/B Tests
**GET** `/campaigns/{id}/ab-tests`

Retrieves all A/B tests for a campaign.

### Get A/B Test by ID
**GET** `/campaigns/ab-tests/{abTestId}`

Retrieves detailed information about a specific A/B test.

### Update A/B Test
**PUT** `/campaigns/ab-tests/{abTestId}`

Updates an A/B test configuration.

### Delete A/B Test
**DELETE** `/campaigns/ab-tests/{abTestId}`

Deletes an A/B test.

### Start A/B Test
**POST** `/campaigns/ab-tests/{abTestId}/start`

Starts an A/B test.

### Pause A/B Test
**POST** `/campaigns/ab-tests/{abTestId}/pause`

Pauses a running A/B test.

### Complete A/B Test
**POST** `/campaigns/ab-tests/{abTestId}/complete`

Completes an A/B test and determines the winner.

### Get A/B Test Analytics
**GET** `/campaigns/ab-tests/{abTestId}/analytics`

Retrieves detailed analytics for an A/B test.

## A/B Test Variants

### Create Variant
**POST** `/campaigns/ab-tests/{abTestId}/variants`

Creates a new variant for an A/B test.

**Request Body:**
```json
{
  "name": "Variant A - Control",
  "description": "Original subject line",
  "variantType": "SUBJECT",
  "config": "{\"subject\": \"Summer Sale - 50% Off!\"}",
  "weight": 50.0,
  "isControl": true
}
```

### Get Variants
**GET** `/campaigns/ab-tests/{abTestId}/variants`

Retrieves all variants for an A/B test.

### Update Variant
**PUT** `/campaigns/variants/{variantId}`

Updates a variant configuration.

### Delete Variant
**DELETE** `/campaigns/variants/{variantId}`

Deletes a variant.

## Workflows

### Create Workflow
**POST** `/campaigns/{id}/workflows`

Creates a new workflow for campaign automation.

**Request Body:**
```json
{
  "name": "Welcome Series",
  "description": "Automated welcome email sequence",
  "triggerType": "EVENT_BASED",
  "triggerConfig": "{\"eventType\": \"user_signup\", \"eventSource\": \"website\"}",
  "conditions": "{\"conditions\": [{\"field\": \"user.country\", \"operator\": \"equals\", \"value\": \"US\"}]}",
  "actions": "{\"actions\": [{\"type\": \"send_email\", \"config\": {\"templateId\": \"welcome1\"}}, {\"type\": \"wait\", \"config\": {\"duration\": \"1 day\"}}, {\"type\": \"send_email\", \"config\": {\"templateId\": \"welcome2\"}}]}",
  "isActive": false
}
```

### Get Workflows
**GET** `/campaigns/{id}/workflows`

Retrieves all workflows for a campaign.

### Get Workflow by ID
**GET** `/campaigns/workflows/{workflowId}`

Retrieves detailed information about a specific workflow.

### Update Workflow
**PUT** `/campaigns/workflows/{workflowId}`

Updates a workflow configuration.

### Delete Workflow
**DELETE** `/campaigns/workflows/{workflowId}`

Deletes a workflow.

### Activate Workflow
**POST** `/campaigns/workflows/{workflowId}/activate`

Activates a workflow.

### Deactivate Workflow
**POST** `/campaigns/workflows/{workflowId}/deactivate`

Deactivates a workflow.

### Execute Workflow
**POST** `/campaigns/workflows/{workflowId}/execute`

Manually executes a workflow for a specific contact.

**Request Body:**
```json
{
  "contactId": "contact_123",
  "triggerData": {
    "eventType": "user_signup",
    "userData": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Get Workflow Executions
**GET** `/campaigns/workflows/{workflowId}/executions`

Retrieves execution history for a workflow.

### Get Workflow Analytics
**GET** `/campaigns/workflows/{workflowId}/analytics`

Retrieves analytics for a workflow.

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "At least one channel must be specified",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Campaign not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Enums

### CampaignType
- `EMAIL_ONLY`: Email-only campaign
- `SMS_ONLY`: SMS-only campaign
- `WHATSAPP_ONLY`: WhatsApp-only campaign
- `MULTI_CHANNEL`: Multi-channel campaign
- `SEQUENTIAL`: Sequential channel campaign
- `PARALLEL`: Parallel channel campaign

### CampaignStatus
- `DRAFT`: Campaign is in draft state
- `SCHEDULED`: Campaign is scheduled for future sending
- `SENDING`: Campaign is currently being sent
- `SENT`: Campaign has been sent successfully
- `PAUSED`: Campaign is paused
- `CANCELLED`: Campaign has been cancelled
- `FAILED`: Campaign failed to send

### ChannelType
- `EMAIL`: Email channel
- `SMS`: SMS channel
- `WHATSAPP`: WhatsApp channel

### ABTestStatus
- `DRAFT`: A/B test is in draft state
- `RUNNING`: A/B test is currently running
- `COMPLETED`: A/B test has been completed
- `PAUSED`: A/B test is paused
- `CANCELLED`: A/B test has been cancelled

### WinnerCriteria
- `HIGHEST_OPEN_RATE`: Winner based on highest open rate
- `HIGHEST_CLICK_RATE`: Winner based on highest click rate
- `HIGHEST_REPLY_RATE`: Winner based on highest reply rate
- `HIGHEST_CONVERSION_RATE`: Winner based on highest conversion rate
- `LOWEST_COST_PER_CONVERSION`: Winner based on lowest cost per conversion
- `HIGHEST_REVENUE`: Winner based on highest revenue

### VariantType
- `CONTENT`: Content variant
- `SUBJECT`: Subject line variant
- `SENDER`: Sender variant
- `TIMING`: Timing variant
- `CHANNEL`: Channel variant
- `AUDIENCE`: Audience variant
- `CREATIVE`: Creative variant

### WorkflowStatus
- `DRAFT`: Workflow is in draft state
- `ACTIVE`: Workflow is active
- `PAUSED`: Workflow is paused
- `ARCHIVED`: Workflow is archived

### TriggerType
- `TIME_BASED`: Time-based trigger
- `EVENT_BASED`: Event-based trigger
- `CONDITION_BASED`: Condition-based trigger
- `MANUAL`: Manual trigger
- `API_TRIGGER`: API trigger

### ExecutionStatus
- `PENDING`: Execution is pending
- `RUNNING`: Execution is running
- `COMPLETED`: Execution completed successfully
- `FAILED`: Execution failed
- `CANCELLED`: Execution was cancelled
