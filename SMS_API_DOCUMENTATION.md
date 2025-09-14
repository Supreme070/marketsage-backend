# SMS Module API Documentation

## Overview

The SMS Module provides comprehensive SMS campaign management, template handling, provider integration, and analytics tracking for MarketSage. It supports multiple SMS providers including Africa's Talking, Twilio, Termii, and Nexmo.

## Base URL

All SMS endpoints are prefixed with `/api/v2/sms`

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## SMS Campaigns

### Create SMS Campaign

**POST** `/api/v2/sms/campaigns`

Creates a new SMS campaign.

#### Request Body

```json
{
  "name": "Welcome Campaign",
  "description": "Welcome new users",
  "from": "+2348123456789",
  "templateId": "template-123",
  "content": "Welcome to MarketSage!",
  "listIds": ["list-1", "list-2"],
  "segmentIds": ["segment-1"],
  "scheduledFor": "2023-12-31T23:59:59Z"
}
```

#### Response

```json
{
  "id": "campaign-123",
  "name": "Welcome Campaign",
  "description": "Welcome new users",
  "from": "+2348123456789",
  "content": "Welcome to MarketSage!",
  "status": "DRAFT",
  "scheduledFor": "2023-12-31T23:59:59Z",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z",
  "createdBy": {
    "id": "user-123",
    "name": "John Doe"
  },
  "template": {
    "id": "template-123",
    "name": "Welcome Template",
    "content": "Welcome {{name}}!"
  },
  "lists": [
    {
      "id": "list-1",
      "name": "New Users"
    }
  ],
  "segments": [
    {
      "id": "segment-1",
      "name": "Active Users"
    }
  ]
}
```

### Get SMS Campaigns

**GET** `/api/v2/sms/campaigns`

Retrieves a paginated list of SMS campaigns.

#### Query Parameters

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by campaign status (`DRAFT`, `SCHEDULED`, `SENDING`, `SENT`, `PAUSED`, `CANCELLED`)
- `search` (string, optional): Search by campaign name or description
- `sortBy` (string, optional): Sort field (`createdAt`, `updatedAt`, `name`)
- `sortOrder` (string, optional): Sort order (`asc`, `desc`)

#### Response

```json
{
  "campaigns": [
    {
      "id": "campaign-123",
      "name": "Welcome Campaign",
      "status": "DRAFT",
      "from": "+2348123456789",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "createdBy": {
        "id": "user-123",
        "name": "John Doe"
      }
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

### Get SMS Campaign by ID

**GET** `/api/v2/sms/campaigns/{id}`

Retrieves a specific SMS campaign by ID.

#### Response

```json
{
  "id": "campaign-123",
  "name": "Welcome Campaign",
  "description": "Welcome new users",
  "from": "+2348123456789",
  "content": "Welcome to MarketSage!",
  "status": "DRAFT",
  "scheduledFor": "2023-12-31T23:59:59Z",
  "sentAt": null,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z",
  "createdBy": {
    "id": "user-123",
    "name": "John Doe"
  },
  "template": {
    "id": "template-123",
    "name": "Welcome Template",
    "content": "Welcome {{name}}!"
  },
  "lists": [
    {
      "id": "list-1",
      "name": "New Users"
    }
  ],
  "segments": [
    {
      "id": "segment-1",
      "name": "Active Users"
    }
  ]
}
```

### Update SMS Campaign

**PUT** `/api/v2/sms/campaigns/{id}`

Updates an existing SMS campaign.

#### Request Body

```json
{
  "name": "Updated Welcome Campaign",
  "description": "Updated description",
  "content": "Updated welcome message",
  "scheduledFor": "2023-12-31T23:59:59Z"
}
```

#### Response

```json
{
  "id": "campaign-123",
  "name": "Updated Welcome Campaign",
  "description": "Updated description",
  "content": "Updated welcome message",
  "status": "DRAFT",
  "scheduledFor": "2023-12-31T23:59:59Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Delete SMS Campaign

**DELETE** `/api/v2/sms/campaigns/{id}`

Deletes an SMS campaign.

#### Response

```json
{
  "message": "SMS campaign deleted successfully"
}
```

### Send SMS Campaign

**POST** `/api/v2/sms/campaigns/{id}/send`

Sends an SMS campaign to all recipients.

#### Request Body

```json
{
  "scheduledFor": "2023-12-31T23:59:59Z"
}
```

#### Response

```json
{
  "message": "Campaign sent successfully. 95 sent, 5 failed.",
  "campaign": {
    "id": "campaign-123",
    "status": "SENT",
    "sentAt": "2023-01-01T12:00:00Z"
  },
  "recipientsCount": 100,
  "successCount": 95,
  "failureCount": 5,
  "results": [
    {
      "success": true,
      "messageId": "msg-123",
      "provider": "africastalking",
      "cost": 0.01
    }
  ]
}
```

### Get SMS Campaign Analytics

**GET** `/api/v2/sms/campaigns/{id}/analytics`

Retrieves analytics for a specific SMS campaign.

#### Query Parameters

- `startDate` (string, optional): Start date for analytics (ISO 8601)
- `endDate` (string, optional): End date for analytics (ISO 8601)

#### Response

```json
{
  "campaign": {
    "id": "campaign-123",
    "name": "Welcome Campaign",
    "from": "+2348123456789",
    "status": "SENT",
    "sentAt": "2023-01-01T12:00:00Z"
  },
  "analytics": {
    "totalSent": 100,
    "totalDelivered": 95,
    "totalFailed": 5,
    "totalBounced": 0,
    "totalUnsubscribed": 0,
    "deliveryRate": 95.0,
    "failureRate": 5.0,
    "bounceRate": 0.0,
    "unsubscribeRate": 0.0
  },
  "activities": [
    {
      "id": "activity-123",
      "type": "SENT",
      "timestamp": "2023-01-01T12:00:00Z",
      "contact": {
        "id": "contact-123",
        "phone": "+2348123456789"
      }
    }
  ]
}
```

## SMS Templates

### Create SMS Template

**POST** `/api/v2/sms/templates`

Creates a new SMS template.

#### Request Body

```json
{
  "name": "Welcome Template",
  "content": "Welcome {{name}}! Your account is ready.",
  "variables": ["name"],
  "category": "welcome"
}
```

#### Response

```json
{
  "id": "template-123",
  "name": "Welcome Template",
  "content": "Welcome {{name}}! Your account is ready.",
  "variables": ["name"],
  "category": "welcome",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z",
  "createdBy": {
    "id": "user-123",
    "name": "John Doe"
  }
}
```

### Get SMS Templates

**GET** `/api/v2/sms/templates`

Retrieves a paginated list of SMS templates.

#### Query Parameters

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `category` (string, optional): Filter by template category
- `search` (string, optional): Search by template name or content

#### Response

```json
{
  "templates": [
    {
      "id": "template-123",
      "name": "Welcome Template",
      "content": "Welcome {{name}}!",
      "category": "welcome",
      "createdAt": "2023-01-01T00:00:00Z",
      "createdBy": {
        "id": "user-123",
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### Get SMS Template by ID

**GET** `/api/v2/sms/templates/{id}`

Retrieves a specific SMS template by ID.

#### Response

```json
{
  "id": "template-123",
  "name": "Welcome Template",
  "content": "Welcome {{name}}! Your account is ready.",
  "variables": ["name"],
  "category": "welcome",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z",
  "createdBy": {
    "id": "user-123",
    "name": "John Doe"
  }
}
```

### Update SMS Template

**PUT** `/api/v2/sms/templates/{id}`

Updates an existing SMS template.

#### Request Body

```json
{
  "name": "Updated Welcome Template",
  "content": "Welcome {{name}}! Your account is ready to use.",
  "variables": ["name"],
  "category": "welcome"
}
```

#### Response

```json
{
  "id": "template-123",
  "name": "Updated Welcome Template",
  "content": "Welcome {{name}}! Your account is ready to use.",
  "variables": ["name"],
  "category": "welcome",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Delete SMS Template

**DELETE** `/api/v2/sms/templates/{id}`

Deletes an SMS template.

#### Response

```json
{
  "message": "SMS template deleted successfully"
}
```

## SMS Providers

### Create SMS Provider

**POST** `/api/v2/sms/providers`

Creates a new SMS provider configuration.

#### Request Body

```json
{
  "provider": "africastalking",
  "senderId": "MarketSage",
  "apiKey": "your-api-key",
  "username": "your-username",
  "isActive": true
}
```

#### Response

```json
{
  "id": "provider-123",
  "provider": "africastalking",
  "senderId": "MarketSage",
  "isActive": true,
  "verificationStatus": "pending",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Get SMS Providers

**GET** `/api/v2/sms/providers`

Retrieves all SMS providers for the organization.

#### Response

```json
[
  {
    "id": "provider-123",
    "provider": "africastalking",
    "senderId": "MarketSage",
    "isActive": true,
    "verificationStatus": "verified",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  {
    "id": "provider-456",
    "provider": "twilio",
    "senderId": "+1234567890",
    "isActive": false,
    "verificationStatus": "pending",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
]
```

### Get SMS Provider by ID

**GET** `/api/v2/sms/providers/{id}`

Retrieves a specific SMS provider by ID.

#### Response

```json
{
  "id": "provider-123",
  "provider": "africastalking",
  "senderId": "MarketSage",
  "isActive": true,
  "verificationStatus": "verified",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Update SMS Provider

**PUT** `/api/v2/sms/providers/{id}`

Updates an existing SMS provider configuration.

#### Request Body

```json
{
  "senderId": "UpdatedSender",
  "isActive": true
}
```

#### Response

```json
{
  "id": "provider-123",
  "provider": "africastalking",
  "senderId": "UpdatedSender",
  "isActive": true,
  "verificationStatus": "verified",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Delete SMS Provider

**DELETE** `/api/v2/sms/providers/{id}`

Deletes an SMS provider configuration.

#### Response

```json
{
  "message": "SMS provider deleted successfully"
}
```

### Test SMS Provider

**POST** `/api/v2/sms/providers/{id}/test`

Tests the SMS provider configuration by sending a test SMS.

#### Request Body

```json
{
  "testPhoneNumber": "+2348123456789",
  "testMessage": "Test SMS from MarketSage"
}
```

#### Response

```json
{
  "success": true,
  "message": "Test SMS sent successfully",
  "timestamp": "2023-01-01T12:00:00Z"
}
```

## SMS Tracking

### Track SMS Activity

**POST** `/api/v2/sms/track/{campaignId}/{contactId}/{type}`

Tracks SMS activity for analytics purposes.

#### Path Parameters

- `campaignId`: SMS campaign ID
- `contactId`: Contact ID
- `type`: Activity type (`SENT`, `DELIVERED`, `FAILED`, `BOUNCED`, `UNSUBSCRIBED`)

#### Request Body

```json
{
  "metadata": {
    "deliveredAt": "2023-01-01T12:00:00Z",
    "provider": "africastalking",
    "messageId": "msg-123"
  }
}
```

#### Response

```json
{
  "id": "activity-123",
  "campaignId": "campaign-123",
  "contactId": "contact-123",
  "type": "DELIVERED",
  "timestamp": "2023-01-01T12:00:00Z",
  "metadata": "{\"deliveredAt\":\"2023-01-01T12:00:00Z\",\"provider\":\"africastalking\",\"messageId\":\"msg-123\"}"
}
```

### Unsubscribe Contact

**POST** `/api/v2/sms/unsubscribe/{contactId}`

Unsubscribes a contact from SMS communications.

#### Request Body

```json
{
  "campaignId": "campaign-123"
}
```

#### Response

```json
{
  "message": "Contact unsubscribed successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
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
  "message": "Resource not found",
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

## SMS Provider Configuration

### Africa's Talking

```json
{
  "provider": "africastalking",
  "apiKey": "your-api-key",
  "username": "your-username",
  "senderId": "MarketSage"
}
```

### Twilio

```json
{
  "provider": "twilio",
  "apiKey": "your-account-sid",
  "apiSecret": "your-auth-token",
  "senderId": "+1234567890"
}
```

### Termii

```json
{
  "provider": "termii",
  "apiKey": "your-api-key",
  "senderId": "MarketSage"
}
```

### Nexmo/Vonage

```json
{
  "provider": "nexmo",
  "apiKey": "your-api-key",
  "apiSecret": "your-api-secret",
  "senderId": "MarketSage"
}
```

## Phone Number Validation

The SMS module validates phone numbers for the following countries:

- **Nigeria**: +234XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
- **Kenya**: +254XXXXXXXXX
- **South Africa**: +27XXXXXXXXX
- **Ghana**: +233XXXXXXXXX
- **Uganda**: +256XXXXXXXXX
- **Tanzania**: +255XXXXXXXXX
- **Cameroon**: +237XXXXXXXXX
- **Ivory Coast**: +225XXXXXXXXX
- **Mali**: +223XXXXXXXX
- **Senegal**: +221XXXXXXXXX
- **US/Canada**: +1XXXXXXXXXX

## Rate Limits

- Campaign creation: 100 per hour
- SMS sending: 1000 per hour
- Provider testing: 10 per hour
- Analytics requests: 100 per hour

## Webhooks

SMS providers can send webhooks for delivery status updates. Configure webhook URLs in your provider settings:

- **Delivery Status**: `POST /api/v2/sms/webhooks/delivery`
- **Bounce Status**: `POST /api/v2/sms/webhooks/bounce`
- **Unsubscribe**: `POST /api/v2/sms/webhooks/unsubscribe`
