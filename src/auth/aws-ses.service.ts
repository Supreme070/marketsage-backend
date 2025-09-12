import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';
import { fromEnv } from '@aws-sdk/credential-providers';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class AwsSesService {
  private readonly logger = new Logger(AwsSesService.name);
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    this.fromEmail = this.configService.get<string>('AWS_SES_FROM_EMAIL', 'noreply@marketsage.africa');
    this.fromName = this.configService.get<string>('AWS_SES_FROM_NAME', 'MarketSage');

    // Initialize SES client with credentials from environment
    this.sesClient = new SESClient({
      region: this.region,
      credentials: fromEnv(), // This will use AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
    });

    this.logger.log(`AWS SES initialized for region: ${this.region}`);
    this.logger.log(`From email: ${this.fromEmail}`);
  }

  async sendVerificationEmail(email: string, name: string, pin: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Sending verification email to ${email}`);
      
      const template = this.createVerificationTemplate(name, pin);
      
      const params: SendEmailCommandInput = {
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: template.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: template.html,
              Charset: 'UTF-8',
            },
            Text: {
              Data: template.text,
              Charset: 'UTF-8',
            },
          },
        },
      };

      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);

      this.logger.log(`✅ Verification email sent successfully to ${email}. MessageId: ${result.MessageId}`);
      
      // In development, also log the PIN for testing
      if (process.env.NODE_ENV === 'development') {
        this.logger.log(`🔑 Development PIN for ${email}: ${pin}`);
      }
      
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send verification email to ${email}:`, error);
      
      // In development, fall back to console logging
      if (process.env.NODE_ENV === 'development') {
        this.logger.warn(`🔄 Falling back to console logging for development`);
        this.logVerificationEmail(email, name, pin);
        return true;
      }
      
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Sending welcome email to ${email}`);
      
      const template = this.createWelcomeTemplate(name);
      
      const params: SendEmailCommandInput = {
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: template.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: template.html,
              Charset: 'UTF-8',
            },
            Text: {
              Data: template.text,
              Charset: 'UTF-8',
            },
          },
        },
      };

      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);

      this.logger.log(`✅ Welcome email sent successfully to ${email}. MessageId: ${result.MessageId}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send welcome email to ${email}:`, error);
      
      // In development, fall back to console logging
      if (process.env.NODE_ENV === 'development') {
        this.logger.warn(`🔄 Falling back to console logging for development`);
        this.logWelcomeEmail(email, name);
        return true;
      }
      
      return false;
    }
  }

  private createVerificationTemplate(name: string, pin: string): EmailTemplate {
    const subject = 'Verify your MarketSage account';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your MarketSage account</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .pin-container {
            background: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .pin {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
        }
        .instructions {
            background: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .button {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MarketSage</div>
            <h1 class="title">Verify Your Account</h1>
        </div>
        
        <p>Hi ${name},</p>
        
        <p>Welcome to MarketSage! To complete your registration, please verify your email address using the verification code below:</p>
        
        <div class="pin-container">
            <div class="pin">${pin}</div>
        </div>
        
        <div class="instructions">
            <strong>Instructions:</strong>
            <ul>
                <li>Enter this 6-digit code in the verification field</li>
                <li>This code will expire in 15 minutes</li>
                <li>If you didn't request this code, please ignore this email</li>
            </ul>
        </div>
        
        <p>Once verified, you'll have full access to all MarketSage features including:</p>
        <ul>
            <li>📊 Advanced analytics and reporting</li>
            <li>📧 Email marketing campaigns</li>
            <li>📱 SMS and WhatsApp messaging</li>
            <li>🤖 AI-powered automation</li>
        </ul>
        
        <div class="footer">
            <p>This email was sent by MarketSage. If you have any questions, please contact our support team.</p>
            <p>© 2025 MarketSage. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
MarketSage - Verify Your Account

Hi ${name},

Welcome to MarketSage! To complete your registration, please verify your email address using the verification code below:

Verification Code: ${pin}

Instructions:
- Enter this 6-digit code in the verification field
- This code will expire in 15 minutes
- If you didn't request this code, please ignore this email

Once verified, you'll have full access to all MarketSage features including:
- Advanced analytics and reporting
- Email marketing campaigns
- SMS and WhatsApp messaging
- AI-powered automation

This email was sent by MarketSage. If you have any questions, please contact our support team.

© 2025 MarketSage. All rights reserved.
`;

    return { subject, html, text };
  }

  private createWelcomeTemplate(name: string): EmailTemplate {
    const subject = 'Welcome to MarketSage! 🎉';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MarketSage</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .welcome-badge {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
        }
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MarketSage</div>
            <h1 class="title">Welcome to MarketSage!</h1>
        </div>
        
        <div class="welcome-badge">
            <h2>🎉 Account Successfully Created!</h2>
            <p>Hi ${name}, your MarketSage account is now ready to use!</p>
        </div>
        
        <p>Thank you for joining MarketSage! You now have access to powerful marketing automation tools designed specifically for African businesses.</p>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">📊</div>
                <h3>Analytics</h3>
                <p>Track your campaign performance with detailed insights</p>
            </div>
            <div class="feature">
                <div class="feature-icon">📧</div>
                <h3>Email Marketing</h3>
                <p>Create and send professional email campaigns</p>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <h3>SMS & WhatsApp</h3>
                <p>Reach your customers on their preferred channels</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🤖</div>
                <h3>AI Automation</h3>
                <p>Let AI optimize your marketing strategies</p>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="https://marketsage.africa/dashboard" class="button">Get Started</a>
        </div>
        
        <p><strong>Need help getting started?</strong> Check out our <a href="https://marketsage.africa/docs">documentation</a> or contact our support team.</p>
        
        <div class="footer">
            <p>This email was sent by MarketSage. If you have any questions, please contact our support team.</p>
            <p>© 2025 MarketSage. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
MarketSage - Welcome!

Hi ${name},

🎉 Account Successfully Created!

Thank you for joining MarketSage! You now have access to powerful marketing automation tools designed specifically for African businesses.

Your MarketSage account includes:
- 📊 Analytics: Track your campaign performance with detailed insights
- 📧 Email Marketing: Create and send professional email campaigns
- 📱 SMS & WhatsApp: Reach your customers on their preferred channels
- 🤖 AI Automation: Let AI optimize your marketing strategies

Get started: https://marketsage.africa/dashboard

Need help getting started? Check out our documentation: https://marketsage.africa/docs

This email was sent by MarketSage. If you have any questions, please contact our support team.

© 2025 MarketSage. All rights reserved.
`;

    return { subject, html, text };
  }

  private logVerificationEmail(email: string, name: string, pin: string): void {
    console.log('\n' + '='.repeat(60));
    console.log('📧 VERIFICATION EMAIL (Development Mode)');
    console.log('='.repeat(60));
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Verification PIN: ${pin}`);
    console.log(`Subject: Verify your MarketSage account`);
    console.log('='.repeat(60) + '\n');
  }

  private logWelcomeEmail(email: string, name: string): void {
    console.log('\n' + '='.repeat(60));
    console.log('📧 WELCOME EMAIL (Development Mode)');
    console.log('='.repeat(60));
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Subject: Welcome to MarketSage! 🎉`);
    console.log('='.repeat(60) + '\n');
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test SES connection by sending a test email to ourselves
      const testParams: SendEmailCommandInput = {
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [this.fromEmail], // Send to ourselves for testing
        },
        Message: {
          Subject: {
            Data: 'MarketSage SES Test',
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: 'This is a test email to verify SES configuration.',
              Charset: 'UTF-8',
            },
          },
        },
      };

      const command = new SendEmailCommand(testParams);
      await this.sesClient.send(command);
      
      this.logger.log('✅ AWS SES connection test successful');
      return true;
    } catch (error) {
      this.logger.error('❌ AWS SES connection test failed:', error);
      return false;
    }
  }
}
