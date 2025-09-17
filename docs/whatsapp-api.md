# WhatsApp Business API Documentation

## Overview

The WhatsApp Business API module provides comprehensive functionality for managing WhatsApp Business campaigns, templates, and providers. This module integrates with Meta WhatsApp Business API and Twilio WhatsApp to enable businesses to send transactional and promotional messages to their customers.

## Base URL

All WhatsApp API endpoints are prefixed with `/api/v2/whatsapp`

## Authentication

All endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Data Models

### WhatsApp Campaign

```typescript
interface WhatsAppCampaign {
  id: string;
  name: string;
  description?: string;
  from: string;
  content?: string;
  templateId?: string;
  messageType: 'text' | 'template' | 'image' | 'document' | 'video' | 'audio' | 'location' | 'contact' | 'interactive';
  mediaData?: {
    type: 'image' | 'document' | 'video' | 'audio';
    url: string;
    filename?: string;
    caption?: string;
  };
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED' | 'CANCELLED';
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  template?: {
    id: string;
    name: string;
    content: string;
  };
  lists: Array<{
    id: string;
    name: string;
  }>;
  segments: Array<{
    id: string;
    name: string;
  }>;
  _count: {
    activities: number;
  };
}
```

### WhatsApp Template

```typescript
interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables?: string[];
  category?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  templateName?: string;
  language?: string;
  components?: Array<{
    type: 'header' | 'body' | 'footer' | 'button';
    text?: string;
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    example?: {
      header_text?: string[];
      body_text?: string[][];
    };
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    campaigns: number;
  };
}
```

### WhatsApp Provider

```typescript
interface WhatsAppProvider {
  id: string;
  provider: 'meta' | 'twilio' | 'infobip';
  businessAccountId: string;
  phoneNumberId: string;
  accessToken: string;
  webhookUrl: string;
  verifyToken: string;
  phoneNumber?: string;
  displayName?: string;
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed';
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
  };
}
```

## Campaign Endpoints

### Create Campaign

**POST** `/api/v2/whatsapp/campaigns`

Creates a new WhatsApp campaign.

**Request Body:**
```json
{
  "name": "Welcome Campaign",
  "description": "Welcome new customers",
  "from": "+1234567890",
  "content": "Welcome to our service!",
  "templateId": "template_123",
  "messageType": "text",
  "listIds": ["list_123"],
  "segmentIds": ["segment_123"],
  "scheduledFor": "2024-01-01T10:00:00Z"
}
```

**Response:**
```json
{
  "id": "campaign_123",
  "name": "Welcome Campaign",
  "status": "DRAFT",
  "createdAt": "2024-01-01T09:00:00Z",
  "createdBy": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Campaigns

**GET** `/api/v2/whatsapp/campaigns`

Retrieves a paginated list of WhatsApp campaigns.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by campaign status
- `search` (string): Search by campaign name

**Response:**
```json
{
  "campaigns": [
    {
      "id": "campaign_123",
      "name": "Welcome Campaign",
      "status": "DRAFT",
      "createdBy": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "template": null,
      "lists": [],
      "segments": [],
      "_count": {
        "activities": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### Get Campaign by ID

**GET** `/api/v2/whatsapp/campaigns/{id}`

Retrieves a specific WhatsApp campaign with full details.

**Response:**
```json
{
  "id": "campaign_123",
  "name": "Welcome Campaign",
  "description": "Welcome new customers",
  "from": "+1234567890",
  "content": "Welcome to our service!",
  "status": "DRAFT",
  "createdBy": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "template": {
    "id": "template_123",
    "name": "Welcome Template",
    "content": "Welcome {{name}}!"
  },
  "lists": [
    {
      "id": "list_123",
      "name": "New Customers"
    }
  ],
  "segments": [],
  "activities": [],
  "_count": {
    "activities": 0
  }
}
```

### Update Campaign

**PUT** `/api/v2/whatsapp/campaigns/{id}`

Updates an existing WhatsApp campaign.

**Request Body:**
```json
{
  "name": "Updated Campaign Name",
  "content": "Updated message content",
  "scheduledFor": "2024-01-02T10:00:00Z"
}
```

**Response:**
```json
{
  "id": "campaign_123",
  "name": "Updated Campaign Name",
  "content": "Updated message content",
  "status": "DRAFT",
  "updatedAt": "2024-01-01T10:30:00Z"
}
```

### Delete Campaign

**DELETE** `/api/v2/whatsapp/campaigns/{id}`

Deletes a WhatsApp campaign.

**Response:**
```json
{
  "message": "WhatsApp campaign deleted successfully"
}
```

### Duplicate Campaign

**POST** `/api/v2/whatsapp/campaigns/{id}/duplicate`

Creates a copy of an existing WhatsApp campaign.

**Response:**
```json
{
  "message": "WhatsApp campaign duplicated successfully",
  "originalCampaign": {
    "id": "campaign_123",
    "name": "Original Campaign"
  },
  "duplicatedCampaign": {
    "id": "campaign_124",
    "name": "Original Campaign (Copy)",
    "status": "DRAFT"
  }
}
```

### Send Campaign

**POST** `/api/v2/whatsapp/campaigns/{id}/send`

Sends a WhatsApp campaign to all recipients.

**Request Body:**
```json
{
  "scheduledFor": "2024-01-01T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Campaign sent successfully. 100 sent, 0 failed.",
  "campaign": {
    "id": "campaign_123",
    "status": "SENT"
  },
  "recipientsCount": 100,
  "successCount": 100,
  "failureCount": 0,
  "results": []
}
```

### Get Campaign Analytics

**GET** `/api/v2/whatsapp/campaigns/{id}/analytics`

Retrieves analytics data for a WhatsApp campaign.

**Query Parameters:**
- `startDate` (string): Start date for analytics (ISO 8601)
- `endDate` (string): End date for analytics (ISO 8601)

**Response:**
```json
{
  "campaign": {
    "id": "campaign_123",
    "name": "Welcome Campaign",
    "from": "+1234567890",
    "status": "SENT",
    "sentAt": "2024-01-01T10:00:00Z"
  },
  "analytics": {
    "totalSent": 100,
    "totalDelivered": 95,
    "totalRead": 80,
    "totalFailed": 5,
    "totalBounced": 0,
    "totalUnsubscribed": 2,
    "deliveryRate": 95.0,
    "readRate": 80.0,
    "failureRate": 5.0,
    "bounceRate": 0.0,
    "unsubscribeRate": 2.0
  },
  "activities": [
    {
      "id": "activity_123",
      "type": "SENT",
      "timestamp": "2024-01-01T10:00:00Z",
      "metadata": "{\"messageId\": \"msg_123\"}",
      "contact": {
        "id": "contact_123",
        "phone": "+1234567890",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
```

## Template Endpoints

### Create Template

**POST** `/api/v2/whatsapp/templates`

Creates a new WhatsApp template.

**Request Body:**
```json
{
  "name": "Welcome Template",
  "content": "Welcome {{name}}! Your account is ready.",
  "variables": ["name"],
  "category": "marketing"
}
```

**Response:**
```json
{
  "id": "template_123",
  "name": "Welcome Template",
  "content": "Welcome {{name}}! Your account is ready.",
  "variables": "[\"name\"]",
  "category": "marketing",
  "status": "PENDING",
  "createdBy": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "_count": {
    "campaigns": 0
  }
}
```

### Get Templates

**GET** `/api/v2/whatsapp/templates`

Retrieves a paginated list of WhatsApp templates.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by template status
- `search` (string): Search by template name

**Response:**
```json
{
  "templates": [
    {
      "id": "template_123",
      "name": "Welcome Template",
      "content": "Welcome {{name}}!",
      "status": "PENDING",
      "createdBy": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "_count": {
        "campaigns": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### Submit Template for Approval

**POST** `/api/v2/whatsapp/templates/submit`

Submits a template to Meta WhatsApp for approval.

**Request Body:**
```json
{
  "name": "welcome_template",
  "category": "MARKETING",
  "language": "en_US",
  "components": [
    {
      "type": "HEADER",
      "text": "Welcome {{name}}!"
    },
    {
      "type": "BODY",
      "text": "Your account is ready. Click the button below to get started."
    },
    {
      "type": "BUTTON",
      "text": "Get Started"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Template submitted successfully",
  "template": {
    "id": "template_123",
    "name": "welcome_template",
    "status": "PENDING"
  },
  "submissionResult": {
    "success": true,
    "messageId": "template_123",
    "provider": "meta"
  }
}
```

### Approve Template

**POST** `/api/v2/whatsapp/templates/{id}/approve`

Approves a template (admin only).

**Response:**
```json
{
  "message": "Template approved successfully",
  "template": {
    "id": "template_123",
    "status": "APPROVED"
  }
}
```

### Reject Template

**POST** `/api/v2/whatsapp/templates/{id}/reject`

Rejects a template (admin only).

**Request Body:**
```json
{
  "reason": "Template violates policy guidelines"
}
```

**Response:**
```json
{
  "message": "Template rejected successfully",
  "template": {
    "id": "template_123",
    "status": "REJECTED"
  }
}
```

## Provider Endpoints

### Create Provider

**POST** `/api/v2/whatsapp/providers`

Creates a new WhatsApp provider configuration.

**Request Body:**
```json
{
  "businessAccountId": "business_account_123",
  "phoneNumberId": "phone_number_123",
  "accessToken": "access_token_123",
  "webhookUrl": "https://your-domain.com/webhook",
  "verifyToken": "verify_token_123",
  "phoneNumber": "+1234567890",
  "displayName": "Your Business Name"
}
```

**Response:**
```json
{
  "id": "provider_123",
  "businessAccountId": "business_account_123",
  "phoneNumberId": "phone_number_123",
  "accessToken": "access_token_123",
  "webhookUrl": "https://your-domain.com/webhook",
  "verifyToken": "verify_token_123",
  "phoneNumber": "+1234567890",
  "displayName": "Your Business Name",
  "isActive": false,
  "verificationStatus": "pending",
  "organization": {
    "id": "org_123",
    "name": "Your Organization"
  }
}
```

### Get Providers

**GET** `/api/v2/whatsapp/providers`

Retrieves all WhatsApp providers for the organization.

**Response:**
```json
[
  {
    "id": "provider_123",
    "businessAccountId": "business_account_123",
    "phoneNumberId": "phone_number_123",
    "isActive": true,
    "verificationStatus": "verified",
    "organization": {
      "id": "org_123",
      "name": "Your Organization"
    }
  }
]
```

### Test Provider

**POST** `/api/v2/whatsapp/providers/{id}/test`

Tests the WhatsApp provider configuration.

**Request Body:**
```json
{
  "testPhoneNumber": "+1234567890",
  "testMessage": "Test message from MarketSage"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test WhatsApp message sent successfully",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

## Webhook Endpoints

### Webhook Verification

**GET** `/api/v2/whatsapp/webhook/verify`

Verifies webhook configuration with Meta WhatsApp.

**Query Parameters:**
- `hub.mode` (string): Must be "subscribe"
- `hub.challenge` (string): Challenge string from Meta
- `hub.verify_token` (string): Verification token

**Response:**
Returns the challenge string if verification is successful, or an error object if failed.

### Handle Webhook Events

**POST** `/api/v2/whatsapp/webhook/{organizationId}`

Handles incoming webhook events from Meta WhatsApp.

**Request Body:**
```json
{
  "entry": [
    {
      "changes": [
        {
          "field": "messages",
          "value": {
            "statuses": [
              {
                "id": "msg_123",
                "status": "delivered",
                "timestamp": "1234567890"
              }
            ],
            "messages": [
              {
                "from": "2348123456789",
                "text": {
                  "body": "Hello from customer"
                },
                "id": "msg_124"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true
}
```

## Tracking Endpoints

### Track Activity

**POST** `/api/v2/whatsapp/track/{campaignId}/{contactId}/{type}`

Tracks WhatsApp activity for analytics.

**Request Body:**
```json
{
  "timestamp": "2024-01-01T10:00:00Z",
  "metadata": {
    "messageId": "msg_123",
    "deliveryTime": "2024-01-01T10:00:05Z"
  }
}
```

**Response:**
```json
{
  "id": "activity_123",
  "campaignId": "campaign_123",
  "contactId": "contact_123",
  "type": "DELIVERED",
  "timestamp": "2024-01-01T10:00:00Z",
  "metadata": "{\"messageId\": \"msg_123\"}"
}
```

### Unsubscribe Contact

**POST** `/api/v2/whatsapp/unsubscribe/{contactId}`

Unsubscribes a contact from WhatsApp campaigns.

**Request Body:**
```json
{
  "campaignId": "campaign_123"
}
```

**Response:**
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

## Rate Limits

- Campaign creation: 10 requests per minute
- Campaign sending: 5 requests per minute
- Template submission: 3 requests per minute
- Provider testing: 5 requests per minute

## Webhook Security

Webhook endpoints use the verification token to ensure requests are coming from Meta WhatsApp. The token should be kept secure and not exposed in client-side code.

## Phone Number Validation

The API validates phone numbers using international format (E.164). Examples:
- Valid: `+2348123456789`, `+254712345678`, `+27123456789`
- Invalid: `123`, `+123`, `08123456789`

## Template Approval Process

1. Create template with components
2. Submit template for Meta approval
3. Wait for Meta approval (can take 24-48 hours)
4. Use approved template in campaigns

## Best Practices

1. **Template Design**: Keep templates simple and clear
2. **Message Timing**: Respect recipient time zones
3. **Content Guidelines**: Follow Meta's WhatsApp Business Policy
4. **Error Handling**: Implement proper error handling for failed messages
5. **Analytics**: Monitor delivery rates and engagement metrics
6. **Compliance**: Ensure compliance with local regulations (GDPR, POPIA)

## Integration Examples

### Frontend Integration

```typescript
// Using the useWhatsApp hook
const { campaigns, createCampaign, sendCampaign } = useWhatsApp();

// Create a new campaign
const newCampaign = await createCampaign({
  name: 'Welcome Campaign',
  content: 'Welcome to our service!',
  listIds: ['list_123']
});

// Send campaign
await sendCampaign(newCampaign.id);
```

### Webhook Integration

```typescript
// Handle webhook events
app.post('/api/v2/whatsapp/webhook/:orgId', (req, res) => {
  const { entry } = req.body;
  
  entry.forEach(entry => {
    entry.changes.forEach(change => {
      if (change.field === 'messages') {
        // Process message status updates
        change.value.statuses?.forEach(status => {
          console.log(`Message ${status.id}: ${status.status}`);
        });
        
        // Process incoming messages
        change.value.messages?.forEach(message => {
          console.log(`Received: ${message.text?.body}`);
        });
      }
    });
  });
  
  res.json({ success: true });
});
```

## Support

For technical support or questions about the WhatsApp Business API integration, please contact the development team or refer to the Meta WhatsApp Business API documentation.